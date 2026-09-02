import {
  accessSync,
  constants,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { build as esbuild } from "esbuild"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const lilscriptRoot = process.env.LILSCRIPT_ROOT ?? resolve(root, "..", "lilscript")
const dist = resolve(root, "dist")
const file = "react-markdown"
const banner = "/*! @itslil/react-markdown 10.1.0 | LilScript reimplementation of react-markdown | MIT */\n"
const imports = `import {Fragment, jsx, jsxs} from 'react/jsx-runtime';
import {useEffect, useState} from 'react';
`

const externals = [
  "react",
  "react/jsx-runtime",
]

function compilerPath() {
  const candidates = [
    process.env.LILSCRIPT_COMPILER,
    resolve(lilscriptRoot, "target", "release", "lilscript"),
    resolve(lilscriptRoot, "target", "debug", "lilscript"),
  ].filter(Boolean)
  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.X_OK)
      return candidate
    } catch {}
  }
  return null
}

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit" })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function compileLil(compiler, configName, outputName) {
  run(compiler, [
    resolve(root, "src", "index.lil"),
    "--target",
    "js-module",
    "--config",
    resolve(root, configName),
    "-o",
    resolve(dist, outputName),
  ])
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
}

compileIfRequested()
mkdirSync(dist, { recursive: true })

const rawPath = resolve(dist, `${file}.raw.js`)
if (!existsSync(rawPath)) {
  throw new Error(`dist/${file}.raw.js is missing. Run with --compile after building LilScript.`)
}

const raw = readFileSync(rawPath, "utf8").trimEnd()
writeFileSync(resolve(dist, `${file}.esm.js`), `${banner}${imports}const development=false;\n${raw}\n`)
writeFileSync(resolve(dist, `${file}.development.js`), `${banner}${imports}const development=true;\n${raw}\n`)
const closedRawPath = resolve(dist, `${file}.closed.raw.js`)
if (existsSync(closedRawPath)) {
  const closed = readFileSync(closedRawPath, "utf8")
  writeFileSync(resolve(dist, `${file}.closed.js`), `${banner}${imports}const development=false;\n${closed.trimEnd()}\n`)
  unlinkSync(closedRawPath)
}

async function buildCommonJs(entryName, outputName) {
  await esbuild({
    absWorkingDir: dist,
    entryPoints: [resolve(dist, entryName)],
    outfile: resolve(dist, outputName),
    bundle: true,
    format: "cjs",
    platform: "node",
    external: externals,
    legalComments: "none",
    banner: { js: banner },
    logLevel: "error",
  })
}

await buildCommonJs(`${file}.esm.js`, `${file}.cjs`)
await buildCommonJs(`${file}.development.js`, `${file}.development.cjs`)

console.log(
  `wrote dist/${file}.esm.js, dist/${file}.development.js, dist/${file}.cjs, dist/${file}.development.cjs, dist/${file}.closed.js`,
)
