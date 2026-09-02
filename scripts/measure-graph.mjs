import {execFileSync} from "node:child_process"
import {createHash} from "node:crypto"
import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs"
import {createRequire} from "node:module"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {build} from "esbuild"
import {minify} from "terser"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const external = ["react", "react/*"]
const lilscriptRoot = process.env.LILSCRIPT_ROOT ?? resolve(root, "..", "lilscript")
const compiler = process.env.LILSCRIPT_COMPILER ?? resolve(lilscriptRoot, "target", "release", "lilscript")
const codec = process.env.LILSCRIPT_CODEC ?? resolve(lilscriptRoot, "target", "release", "lilscript-codec")
const work = resolve(root, ".tmp", "measure-graph")

function sha256(code) {
  return createHash("sha256").update(code).digest("hex")
}

async function bundle(entry, options = {}) {
  return build({
    bundle: true,
    conditions: ["browser", "import"],
    entryPoints: [entry],
    external,
    format: "esm",
    legalComments: "none",
    metafile: true,
    platform: "browser",
    treeShaking: true,
    write: false,
    ...options,
  })
}

function artifact(code, measured) {
  return {
    raw: measured.raw,
    gzip9: measured.gzip9,
    brotli11: measured.brotli11,
    sha256: sha256(code),
  }
}

function imports(result) {
  return Array.from(
    result.outputFiles[0].text.matchAll(/from\s*["']([^"']+)["']/gu),
    (match) => match[1],
  ).sort()
}

const officialBundle = await bundle("react-markdown")
const officialCode = officialBundle.outputFiles[0].text
const officialTerser = await minify(officialCode, {
  compress: true,
  mangle: true,
  module: true,
})
if (!officialTerser.code) throw new Error("Terser did not produce the canonical official artifact")
const officialTerserNoMangle = await minify(officialCode, {
  compress: true,
  mangle: false,
  module: true,
})
if (!officialTerserNoMangle.code) throw new Error("Terser did not produce the no-mangle diagnostic")
const officialEsbuild = await bundle("react-markdown", {metafile: false, minify: true})

const lilPath = resolve(root, "dist", "react-markdown.esm.js")
const lilCode = readFileSync(lilPath)
const lilBundle = await bundle(lilPath)
const lilImports = imports(lilBundle)
if (JSON.stringify(lilImports) !== JSON.stringify(["react", "react/jsx-runtime"])) {
  throw new Error(`unexpected Lil graph imports: ${lilImports.join(", ")}`)
}

if (!existsSync(codec)) throw new Error(`canonical codec is missing at ${codec}`)
if (!existsSync(compiler)) throw new Error(`LilScript compiler is missing at ${compiler}`)
mkdirSync(work, {recursive: true})
const measuredInputs = [
  ["official-graph.js", officialCode],
  ["official-terser.js", officialTerser.code],
  ["official-terser-no-mangle.js", officialTerserNoMangle.code],
  ["official-esbuild.js", officialEsbuild.outputFiles[0].contents],
  ["lil-standalone.js", lilCode],
  ["lil-consumer-graph.js", lilBundle.outputFiles[0].contents],
]
const measuredPaths = measuredInputs.map(([name, code]) => {
  const path = resolve(work, name)
  writeFileSync(path, code)
  return path
})
const codecReport = JSON.parse(execFileSync(codec, ["--json", ...measuredPaths], {encoding: "utf8"}))
const [
  officialGraphMeasurement,
  officialMeasurement,
  officialNoMangleMeasurement,
  officialEsbuildMeasurement,
  standaloneMeasurement,
  graphMeasurement,
] = codecReport.artifacts
const official = artifact(officialTerser.code, officialMeasurement)
const standalone = artifact(lilCode, standaloneMeasurement)
const graph = artifact(lilBundle.outputFiles[0].contents, graphMeasurement)
const report = {
  schemaVersion: 1,
  tools: {
    node: process.version,
    esbuild: require("esbuild/package.json").version,
    terser: require("terser/package.json").version,
    compiler: {
      version: execFileSync(compiler, ["--version"], {encoding: "utf8"}).trim(),
      sha256: sha256(readFileSync(compiler)),
    },
    codec: {
      sha256: sha256(readFileSync(codec)),
      ...codecReport.codecs,
    },
  },
  settings: {
    official: "esbuild ESM graph, then Terser module=true/compress=true/mangle=true",
    lil: "LilScript js-module output with no post-minification",
    external,
    measurement: "lilscript-codec --json .tmp/measure-graph/*.js",
  },
  sourceGraphLockSha256: sha256(readFileSync(resolve(root, "source-graph.lock.json"))),
  official: {
    graph: artifact(officialCode, officialGraphMeasurement),
    terser: official,
    terserNoMangle: artifact(officialTerserNoMangle.code, officialNoMangleMeasurement),
    esbuild: artifact(officialEsbuild.outputFiles[0].contents, officialEsbuildMeasurement),
  },
  lil: {
    standalone,
    consumerGraph: graph,
    inputs: Object.keys(lilBundle.metafile.inputs).sort(),
    imports: lilImports,
  },
  deltaAgainstOfficialTerser: {
    standalone: {
      raw: standalone.raw - official.raw,
      gzip9: standalone.gzip9 - official.gzip9,
      brotli11: standalone.brotli11 - official.brotli11,
    },
    consumerGraph: {
      raw: graph.raw - official.raw,
      gzip9: graph.gzip9 - official.gzip9,
      brotli11: graph.brotli11 - official.brotli11,
    },
  },
}

const json = `${JSON.stringify(report, null, 2)}\n`
writeFileSync(resolve(root, "dist", "size-report.json"), json)
process.stdout.write(json)
