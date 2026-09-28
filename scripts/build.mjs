import {
  accessSync,
  appendFileSync,
  constants,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const lilscriptRoot = process.env.LILSCRIPT_ROOT ?? resolve(root, "..", "lilscript")
const dist = resolve(root, "dist")
const file = "react-markdown"
const { version } = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"))
const banner = `/*! @itslil/react-markdown ${version} | LilScript reimplementation of react-markdown | MIT */\n`
const imports = `import {Fragment, jsx, jsxs} from 'react/jsx-runtime';
import {useEffect, useState} from 'react';
`

// CommonJS reads the same two host modules the ESM imports.
const requires = `const{Fragment,jsx,jsxs}=require("react/jsx-runtime"),{useEffect,useState}=require("react");`
// The Node program (the `node` condition) also binds what vfile imports under `node`
// (src/vfile-imports.lil): node:path, node:process and node:url's fileURLToPath.
const nodeImports = `import minpathNode from 'node:path';
import minprocNode from 'node:process';
import {fileURLToPath as urlToPathNode} from 'node:url';
`
const nodeRequires = `const minpathNode=require("node:path"),minprocNode=require("node:process"),{fileURLToPath:urlToPathNode}=require("node:url");`
const publicApi = ["MarkdownAsync", "MarkdownHooks", "default", "defaultUrlTransform"]

function compilerPath() {
  // A pinned compiler is used or the build fails; it never falls back to another binary.
  if (process.env.LILSCRIPT_COMPILER) {
    accessSync(process.env.LILSCRIPT_COMPILER, constants.X_OK)
    return process.env.LILSCRIPT_COMPILER
  }
  const candidates = [
    resolve(lilscriptRoot, "target", "release", "lilscript"),
    resolve(lilscriptRoot, "target", "debug", "lilscript"),
  ]
  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.X_OK)
      return candidate
    } catch {}
  }
  return null
}

function run(cmd, args) {
  const started = process.hrtime.bigint()
  const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit" })
  if (result.status !== 0) process.exit(result.status ?? 1)
  return Number(process.hrtime.bigint() - started) / 1e6
}

// LILSCRIPT_COMPILE_LOG names a file that receives one JSON line per compiler
// invocation with its wall time; scripts/record-compile.mjs reads it for the site.
function compileLil(compiler, configName, outputName, source = resolve(root, "src")) {
  const wallMs = run(compiler, [
    resolve(source, "index.lil"),
    "--target",
    "js-module",
    "--config",
    resolve(root, configName),
    "-o",
    resolve(dist, outputName),
  ])
  if (process.env.LILSCRIPT_COMPILE_LOG) {
    appendFileSync(
      process.env.LILSCRIPT_COMPILE_LOG,
      `${JSON.stringify({ config: configName, output: outputName.replace(".raw.js", ".js"), wallMs })}\n`,
    )
  }
}

function compileIfRequested() {
  if (!process.argv.includes("--compile") && existsSync(resolve(dist, `${file}.raw.js`))) {
    return
  }
  const compiler = compilerPath()
  if (!compiler) {
    throw new Error("LilScript compiler not found. Set LILSCRIPT_COMPILER or build lilscript.")
  }
  run(process.execPath, [resolve(root, "scripts", "source-graph.mjs"), "--require-siblings"])
  mkdirSync(dist, { recursive: true })
  compileLil(compiler, "lilscript.toml", `${file}.raw.js`)
  compileLil(compiler, "lilscript.closed.toml", `${file}.closed.raw.js`)
  // The browser build (the `browser` export condition) decodes named
  // character references through the document, as upstream's browser graph
  // does (decode-named-character-reference's `index.dom.js`), so the entity
  // table stays out, and takes vfile's non-Node working directory (`/`). The
  // worker build (edge-light, react-native, worker, workerd) keeps the table,
  // as decode-named-character-reference routes those conditions, with the same
  // working directory. The locked graph is untouched: the modules are swapped
  // in a staging copy of the source.
  const staged = (name, swaps) => {
    const staging = resolve(root, ".tmp", `${name}-src`)
    rmSync(staging, { recursive: true, force: true })
    cpSync(resolve(root, "src"), staging, { recursive: true })
    for (const [from, to] of swaps) cpSync(resolve(root, "src", from), resolve(staging, to))
    compileLil(compiler, "lilscript.toml", `${file}.${name}.raw.js`, staging)
    rmSync(staging, { recursive: true, force: true })
  }
  // @itslil/unified's vfile imports its path, process and URL functions from
  // vfile-imports.lil (the Node binding); its browser/vfile-imports.lil holds vfile's shims.
  const shims = ["graph/unified/browser/vfile-imports.lil", "graph/unified/vfile-imports.lil"]
  staged("browser", [["browser/decode-named.lil", "graph/remark-parse/micromark/decode-named.lil"], shims])
  staged("worker", [shims])
}

compileIfRequested()
mkdirSync(dist, { recursive: true })

// The compiler writes an ES module whose last statement is its export clause.
// Every delivered file is that text: the ES modules with a banner, the two React
// imports and the `development` flag the program reads, and CommonJS with the
// imports as requires and the clause replaced by `module.exports`. No minifier
// or bundler runs over the compiler's output.
function splitExports(text, label) {
  const match = /;?export\s*\{([^}]*)\}\s*;?\s*$/.exec(text)
  if (!match) throw new Error(`${label}: the compiler's artifact has no trailing export clause`)
  const bindings = match[1].split(",").map((entry) => {
    const [local, exported = local] = entry.trim().split(/\s+as\s+/)
    return { local, exported }
  })
  const names = bindings.map(({ exported }) => exported).sort()
  if (names.join(",") !== [...publicApi].sort().join(",")) {
    throw new Error(`${label}: exports ${names.join(",")}, expected ${[...publicApi].sort().join(",")}`)
  }
  if (/\bimport\s*[{*\s"']|\bimport\.meta\b|\bexport\s*[{*]/.test(text.slice(0, match.index))) {
    throw new Error(`${label}: module syntax outside the trailing export clause`)
  }
  return { body: `${text.slice(0, match.index)};`, bindings }
}

function objectOf(bindings) {
  return `{${bindings
    .map(({ local, exported }) => (local === exported ? local : `${exported}:${local}`))
    .join(",")}}`
}

function takeCompiled(name) {
  const path = resolve(dist, name)
  if (!existsSync(path)) {
    throw new Error(`dist/${name} is missing. Run with --compile after building LilScript.`)
  }
  return readFileSync(path, "utf8").trimEnd()
}

const flag = (development) => `const development=${development};\n`
const raw = takeCompiled(`${file}.raw.js`)
const main = splitExports(raw, `${file}.raw.js`)
writeFileSync(resolve(dist, `${file}.esm.js`), `${banner}${imports}${nodeImports}${flag(false)}${raw}\n`)
writeFileSync(resolve(dist, `${file}.development.js`), `${banner}${imports}${nodeImports}${flag(true)}${raw}\n`)
// CommonJS keeps the shape the earlier esbuild CJS build had: the named exports
// plus `default`, with a non-enumerable `__esModule` marker for interop.
const exportsObject = `module.exports=Object.defineProperty(${objectOf(main.bindings)},"__esModule",{value:!0});\n`
writeFileSync(resolve(dist, `${file}.cjs`), `${banner}"use strict";${requires}${nodeRequires}${flag(false)}${main.body}${exportsObject}`)
writeFileSync(
  resolve(dist, `${file}.development.cjs`),
  `${banner}"use strict";${requires}${nodeRequires}${flag(true)}${main.body}${exportsObject}`,
)
// The browser and worker programs, each with its development file (the same
// program with the flag on), for the `development` condition in those runtimes.
for (const name of ["browser", "worker"]) {
  const rawPath = resolve(dist, `${file}.${name}.raw.js`)
  if (!existsSync(rawPath)) continue
  const program = takeCompiled(`${file}.${name}.raw.js`)
  splitExports(program, `${file}.${name}.raw.js`)
  // vfile's shims only: no path to a Node module may survive in these programs.
  if (/\b(?:minpathNode|minprocNode|urlToPathNode)\b/.test(program)) {
    throw new Error(`${file}.${name}.raw.js: the ${name} program still reads a Node module binding`)
  }
  writeFileSync(resolve(dist, `${file}.${name}.js`), `${banner}${imports}${flag(false)}${program}\n`)
  writeFileSync(resolve(dist, `${file}.${name}.development.js`), `${banner}${imports}${flag(true)}${program}\n`)
  unlinkSync(rawPath)
}
const closedRawPath = resolve(dist, `${file}.closed.raw.js`)
if (existsSync(closedRawPath)) {
  const closed = takeCompiled(`${file}.closed.raw.js`)
  splitExports(closed, `${file}.closed.raw.js`)
  writeFileSync(resolve(dist, `${file}.closed.js`), `${banner}${imports}${nodeImports}${flag(false)}${closed}\n`)
  unlinkSync(closedRawPath)
}

console.log(
  `wrote dist/${file}.esm.js, dist/${file}.browser.js, dist/${file}.worker.js, dist/${file}.development.js, dist/${file}.browser.development.js, dist/${file}.worker.development.js, dist/${file}.cjs, dist/${file}.development.cjs, dist/${file}.closed.js`,
)
