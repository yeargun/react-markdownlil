// Record this release's numbers in site/results.json, so the Pages site cannot drift from the build.
//
//   LILSCRIPT_COMPILER=<lilscript> LILSCRIPT_CODEC=<lilscript-codec> LILSCRIPT_REVISION=<compiler source revision> \
//     npm run record:release [-- --samples 3]
//
// 1. Builds the port `samples` times (scripts/build.mjs --compile) and records the wall time of each
//    compiler invocation (the build appends them to LILSCRIPT_COMPILE_LOG). The builds must write
//    identical bytes.
// 2. Measures the official browser graph and the browser build (scripts/measure-graph.mjs, which writes
//    dist/size-report.json), and every delivered file with the LilScript codec.
// 3. Counts the official react-markdown suite (test/official/test.jsx) on the development build.
// 4. Measures render throughput of the delivered ESM against official react-markdown in this Node.
//
// The row built from react-markdown's pinned Git source ("Git source + Terser") comes from the paired
// source build (site/comparison.json, comparison/source-build/); it and `previousRelease` are kept as
// they are.
import { createHash } from "node:crypto"
import { execFileSync, spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { cpus, loadavg, tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { performance } from "node:perf_hooks"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const argv = process.argv.slice(2)
const flag = (name, fallback = null) => {
  const at = argv.indexOf(`--${name}`)
  return at === -1 ? fallback : argv[at + 1]
}
const compiler = process.env.LILSCRIPT_COMPILER
const codec = process.env.LILSCRIPT_CODEC
if (!compiler || !codec) throw new Error("set LILSCRIPT_COMPILER and LILSCRIPT_CODEC")
const revision = flag("revision", process.env.LILSCRIPT_REVISION)
if (!revision) throw new Error("set LILSCRIPT_REVISION (or pass --revision) to the compiler's source revision")
const sampleCount = Number(flag("samples", "3"))

const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex")
const round = (value, digits = 1) => Math.round(value * 10 ** digits) / 10 ** digits
const work = mkdtempSync(join(tmpdir(), "react-markdownlil-release-"))

const compilerWritten =
  "compiler (the build adds a license banner, the two React imports and the `development` flag the program reads)"
const cjsWritten =
  "compiler (the build adds a license banner, the React requires, the `development` flag, and module.exports in place of the export clause)"
const deliveredFiles = [
  ["dist/react-markdown.browser.js", "ESM, `browser` condition: named references decoded by the document", compilerWritten],
  ["dist/react-markdown.esm.js", "ESM (npm import, Node): named references from the entity table", compilerWritten],
  ["dist/react-markdown.cjs", "CommonJS (npm require)", cjsWritten],
  ["dist/react-markdown.development.js", "ESM, `development` condition (devlop assertions on)", compilerWritten],
  ["dist/react-markdown.development.cjs", "CommonJS, `development` condition", cjsWritten],
  ["dist/react-markdown.closed.js", "`./closed` export: no builtin or callback assumptions", compilerWritten],
]

// 1. Compile time. The host is shared, so its load is recorded next to the samples.
const timingLog = join(work, "compile.jsonl")
const loadAverage1m = loadavg()[0]
const buildMs = []
let firstHashes = null
for (let sample = 0; sample < sampleCount; sample++) {
  const started = performance.now()
  execFileSync(process.execPath, [join(root, "scripts", "build.mjs"), "--compile"], {
    cwd: root,
    env: { ...process.env, LILSCRIPT_COMPILE_LOG: timingLog },
    stdio: ["ignore", "ignore", "inherit"],
  })
  buildMs.push(performance.now() - started)
  const hashes = deliveredFiles.map(([file]) => sha256(resolve(root, file))).join(",")
  if (firstHashes && hashes !== firstHashes) throw new Error("two clean builds wrote different files")
  firstHashes = hashes
}
const entries = readFileSync(timingLog, "utf8").trim().split("\n").map((line) => JSON.parse(line))
const perBuild = entries.length / sampleCount
if (!Number.isInteger(perBuild)) throw new Error("uneven compile log")
// The build logs each compile by its output; the Node program (react-markdown.raw.js) becomes the
// ESM, the CommonJS and the two development files.
const delivers = (output) => (output === "react-markdown.js" ? "dist/react-markdown.esm.js" : `dist/${output}`)
const invocations = entries.slice(0, perBuild).map((entry, index) => ({
  source: "src/index.lil",
  config: entry.config,
  output: delivers(entry.output),
  wallMs: Array.from({ length: sampleCount }, (_, sample) => round(entries[sample * perBuild + index].wallMs)),
}))
const compileWallMs = Array.from({ length: sampleCount }, (_, sample) =>
  round(entries.slice(sample * perBuild, (sample + 1) * perBuild).reduce((sum, entry) => sum + entry.wallMs, 0)),
)

// 2. Sizes.
execFileSync(process.execPath, [join(root, "scripts", "measure-graph.mjs")], { cwd: root, stdio: ["ignore", "ignore", "inherit"] })
const report = JSON.parse(readFileSync(resolve(root, "dist", "size-report.json"), "utf8"))
const measured = JSON.parse(
  execFileSync(codec, ["--json", ...deliveredFiles.map(([file]) => resolve(root, file))], { encoding: "utf8" }),
)
const delivered = deliveredFiles.map(([file, role, writtenBy], index) => {
  const { raw, gzip9, brotli11 } = measured.artifacts[index]
  return { file, role, writtenBy, compilerWritten: true, sha256: sha256(resolve(root, file)), raw, gzip9, brotli11 }
})

// 3. The official suite, on the development build as upstream runs it.
const suite = spawnSync(
  process.execPath,
  [
    "--conditions",
    "development",
    "--experimental-loader=./test/load-jsx.js",
    "--no-warnings",
    "--test",
    "--test-reporter=tap",
    "test/official/test.jsx",
  ],
  { cwd: root, encoding: "utf8" },
)
const count = (key) => Number([...suite.stdout.matchAll(new RegExp(`^# ${key} (\\d+)$`, "gmu"))].at(-1)?.[1])
const official = { total: count("tests"), pass: count("pass") }
if (suite.status !== 0 || !official.total || official.pass !== official.total) {
  throw new Error(`official suite: ${official.pass}/${official.total}, exit ${suite.status}`)
}

// 4. Throughput: renderToStaticMarkup of upstream's readme (the same document for both lanes), each
// sample 10 renders, the lanes alternating; quiet median of 60 samples after discarding 3.
const React = (await import("react")).default
const { renderToStaticMarkup } = await import("react-dom/server")
const documentText = readFileSync(resolve(root, "node_modules", "react-markdown", "readme.md"), "utf8")
const officialMarkdown = (await import("react-markdown")).default
const lilMarkdown = (await import(pathToFileURL(resolve(root, "dist", "react-markdown.esm.js")).href)).default
const lanes = [officialMarkdown, lilMarkdown].map((Markdown) => {
  const render = () => renderToStaticMarkup(React.createElement(Markdown, { children: documentText }))
  return { render, expected: render(), times: [] }
})
if (lanes[0].expected !== lanes[1].expected) throw new Error("the two lanes render the readme differently")
for (let i = 0; i < 63; i++) {
  for (const lane of lanes) {
    let out
    const start = performance.now()
    for (let j = 0; j < 10; j++) out = lane.render()
    lane.times.push((performance.now() - start) / 10)
    if (out !== lane.expected) throw new Error("render output changed between runs")
  }
}
const [officialMs, lilMs] = lanes.map((lane) => {
  const quiet = lane.times.slice(3).sort((a, b) => a - b)
  return quiet[Math.floor(quiet.length / 2)]
})

rmSync(work, { recursive: true, force: true })

// Write results.json.
const resultsPath = resolve(root, "site", "results.json")
const results = JSON.parse(readFileSync(resultsPath, "utf8"))
const measuredAt = new Date().toISOString().replace(/\.\d+Z$/u, "Z")
const row = (id, name, sizes, note, extra = {}) => ({
  id,
  name,
  raw: sizes.raw,
  gzip9: sizes.gzip9,
  brotli11: sizes.brotli11,
  note,
  measuredAt,
  artifactSha256: sizes.sha256,
  ...extra,
})
const file = (path) => delivered.find((entry) => entry.file === path)
const sourceRow = results.size.find((lane) => lane.id === "official-source-terser")
const bars = [
  row("official", "Official react-markdown@10.1.0 browser graph", report.official.graph,
    `esbuild ${report.tools.esbuild} bundle of the published package and its runtime dependencies, browser conditions, React external; not minified`,
    { diagnostic: false }),
  row("official-terser-mangle", "Official · Terser mangle on", report.official.terser,
    `Terser ${report.tools.terser} of that graph: module, compress, mangle`),
  row("official-terser-nomangle", "Official · Terser mangle off", report.official.terserNoMangle,
    `Terser ${report.tools.terser} of that graph: module, compress, no mangle`),
  ...(report.official.oxc
    ? [
        row("official-oxc-mangle", "Official · Oxc mangle on", report.official.oxc, `${report.official.oxc.tool} of that graph, mangle on`),
        row("official-oxc-nomangle", "Official · Oxc mangle off", report.official.oxcNoMangle, `${report.official.oxcNoMangle.tool} of that graph, mangle off`),
      ]
    : []),
  row("official-esbuild", "Official · esbuild minify", report.official.esbuild, `esbuild ${report.tools.esbuild} minify of that graph`),
  ...(sourceRow ? [sourceRow] : []),
]
// The baseline is the strongest bar: the smallest minified official file by Brotli-11.
const baseline = bars.filter((lane) => lane.id !== "official").reduce((best, lane) => (lane.brotli11 < best.brotli11 ? lane : best))
for (const lane of bars) delete lane.baseline
baseline.baseline = true
const browser = file("dist/react-markdown.browser.js")
const node = file("dist/react-markdown.esm.js")
const closed = file("dist/react-markdown.closed.js")
results.size = [
  ...bars,
  row("itslil", "@itslil/react-markdown · browser", browser,
    "dist/react-markdown.browser.js as delivered (the package's `browser` condition): named character references decode through the document, as upstream's browser graph does. Compiler-written, no minifier after it.",
    { primary: true }),
  row("itslil-node", "@itslil/react-markdown · Node", node,
    "dist/react-markdown.esm.js as delivered (npm import): the same program with the 2,125-entry entity table, which upstream's Node graph also ships."),
  row("itslil-closed", "@itslil/react-markdown · closed", closed,
    "dist/react-markdown.closed.js, the `./closed` export: the Node program without the builtin and callback assumptions."),
]
const codecs = report.tools.codec
results.codec = `lilscript-codec: zlib ${codecs.gzip9.libraryVersion} gzip-${codecs.gzip9.level} / Google Brotli ${codecs.brotli11.libraryVersion} quality ${codecs.brotli11.quality}, lgwin ${codecs.brotli11.lgwin}`
results.node = process.version
results.runtime = `Node ${process.version}`
results.warmupDiscard = 3
results.comparison =
  `Official rows bundle react-markdown@10.1.0 and its runtime dependencies for the browser with esbuild ${report.tools.esbuild} (React external), then minify with Terser ${report.tools.terser}, Oxc or esbuild; one row is the same graph built from react-markdown's pinned Git source. ` +
  "LilScript rows are the delivered files, written by the compiler from one 69-module source graph with no minifier after it. The strongest bar is the baseline."
results.spec = { total: official.total, pass: official.pass, label: "official react-markdown tests" }
results.throughput = [
  { id: "official", name: "react-markdown@10.1.0", documentMs: round(officialMs, 3) },
  { id: "itslil", name: "@itslil/react-markdown", documentMs: round(lilMs, 3) },
]
results.throughputWorkload =
  "renderToStaticMarkup of react-markdown's readme (26 KB), 10 renders per sample, the two lanes alternating; both render the same markup. LilScript lane: dist/react-markdown.esm.js."
results.sizeMeasuredAt = measuredAt
results.delivered = delivered
results.compiler = {
  revision,
  binarySha256: sha256(compiler),
  codecSha256: sha256(codec),
  compileWallMs,
  invocations,
  timingScope: `wall time of the build's ${invocations.length} compiler invocations in ${sampleCount} clean builds (node scripts/build.mjs --compile), each spawned and timed by the build; the whole build, graph check and wrapping included, took ${buildMs.map((ms) => (ms / 1000).toFixed(2)).join(" / ")} s`,
  host: { cpus: cpus().length, loadAverage1m: round(loadAverage1m) },
  date: measuredAt.slice(0, 10),
}
writeFileSync(resultsPath, `${JSON.stringify(results, null, 2)}\n`)
console.log(
  `recorded: browser ${browser.brotli11} B Brotli-11 (bar ${baseline.name} ${baseline.brotli11}); Node ${node.brotli11}; ` +
    `compile ${compileWallMs.join(" / ")} ms; official suite ${official.pass}/${official.total}; ` +
    `render ${lilMs.toFixed(3)} ms vs official ${officialMs.toFixed(3)} ms`,
)
