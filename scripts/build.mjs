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
const banner = "/*! @itslil/react-markdown 10.1.0 | LilScript reimplementation of react-markdown | MIT */\n"
const imports = `import {Fragment, jsx, jsxs} from 'react/jsx-runtime';
import {useEffect, useState} from 'react';
`

// CommonJS reads the same two host modules the ESM imports.
const requires = `const{Fragment,jsx,jsxs}=require("react/jsx-runtime"),{useEffect,useState}=require("react");`
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
  // table stays out. The locked graph is untouched: its decoder module is
  // swapped in a staging copy of the source.
  const staging = resolve(root, ".tmp", "browser-src")
  rmSync(staging, { recursive: true, force: true })
  cpSync(resolve(root, "src"), staging, { recursive: true })
  cpSync(
    resolve(root, "src", "browser", "decode-named.lil"),
    resolve(staging, "graph", "remark-parse", "micromark", "decode-named.lil"),
  )
  compileLil(compiler, "lilscript.toml", `${file}.browser.raw.js`, staging)
  rmSync(staging, { recursive: true, force: true })
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
writeFileSync(resolve(dist, `${file}.esm.js`), `${banner}${imports}${flag(false)}${raw}\n`)
writeFileSync(resolve(dist, `${file}.development.js`), `${banner}${imports}${flag(true)}${raw}\n`)
// CommonJS keeps the shape the earlier esbuild CJS build had: the named exports
// plus `default`, with a non-enumerable `__esModule` marker for interop.
const exportsObject = `module.exports=Object.defineProperty(${objectOf(main.bindings)},"__esModule",{value:!0});\n`
writeFileSync(resolve(dist, `${file}.cjs`), `${banner}"use strict";${requires}${flag(false)}${main.body}${exportsObject}`)
writeFileSync(
  resolve(dist, `${file}.development.cjs`),
  `${banner}"use strict";${requires}${flag(true)}${main.body}${exportsObject}`,
)
const browserRawPath = resolve(dist, `${file}.browser.raw.js`)
if (existsSync(browserRawPath)) {
  const browser = takeCompiled(`${file}.browser.raw.js`)
  splitExports(browser, `${file}.browser.raw.js`)
  writeFileSync(resolve(dist, `${file}.browser.js`), `${banner}${imports}${flag(false)}${browser}\n`)
  unlinkSync(browserRawPath)
}
const closedRawPath = resolve(dist, `${file}.closed.raw.js`)
if (existsSync(closedRawPath)) {
  const closed = takeCompiled(`${file}.closed.raw.js`)
  splitExports(closed, `${file}.closed.raw.js`)
  writeFileSync(resolve(dist, `${file}.closed.js`), `${banner}${imports}${flag(false)}${closed}\n`)
  unlinkSync(closedRawPath)
}

console.log(
  `wrote dist/${file}.esm.js, dist/${file}.browser.js, dist/${file}.development.js, dist/${file}.cjs, dist/${file}.development.cjs, dist/${file}.closed.js`,
)
