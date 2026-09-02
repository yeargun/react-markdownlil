import {execFileSync} from "node:child_process"
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from "node:fs"
import {tmpdir} from "node:os"
import {basename, dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const temp = mkdtempSync(resolve(tmpdir(), "react-markdown-local-"))
const packages = new Map([
  ["@itslil/react-markdown", root],
])

try {
  const dependencies = {react: "19.2.8", "react-dom": "19.2.8"}
  for (const [name, directory] of packages) {
    const packed = JSON.parse(execFileSync("npm", [
      "pack",
      "--ignore-scripts",
      "--json",
      "--pack-destination",
      temp,
      directory,
    ], {encoding: "utf8"}))[0]
    dependencies[name] = `file:./${basename(packed.filename)}`
  }

  writeFileSync(resolve(temp, "package.json"), JSON.stringify({
    name: "local-graph-check",
    private: true,
    type: "module",
    dependencies,
  }, null, 2))
  install("install", "--package-lock-only")
  const firstLock = readFileSync(resolve(temp, "package-lock.json"), "utf8")
  const lock = JSON.parse(firstLock)
  for (const name of packages.keys()) {
    const entry = lock.packages[`node_modules/${name}`]
    if (!entry?.resolved?.startsWith("file:")) {
      throw new Error(`${name} did not resolve from a local tarball`)
    }
  }
  for (const name of ["@itslil/unified", "@itslil/remark-parse", "@itslil/remark-rehype"]) {
    if (lock.packages[`node_modules/${name}`]) throw new Error(`${name} leaked into the standalone runtime graph`)
  }
  install("install", "--package-lock-only")
  assertEqual(readFileSync(resolve(temp, "package-lock.json"), "utf8"), firstLock, "package-lock changed on reinstall")
  install("ci")

  writeFileSync(resolve(temp, "verify.mjs"), `
    import React from "react";
    import {renderToStaticMarkup} from "react-dom/server";
    import Markdown from "@itslil/react-markdown";
    import {createRequire} from "node:module";
    const require = createRequire(import.meta.url);
    const required = require("@itslil/react-markdown");
    if (renderToStaticMarkup(React.createElement(Markdown, {children: "# local"})) !== "<h1>local</h1>") process.exit(1);
    if (renderToStaticMarkup(React.createElement(required.default, {children: "# local"})) !== "<h1>local</h1>") process.exit(1);
  `)
  execFileSync(process.execPath, [resolve(temp, "verify.mjs")], {cwd: temp, stdio: "inherit"})
  console.log("local tarball graph: reproducible lock, ESM and CJS load")
} finally {
  rmSync(temp, {recursive: true, force: true})
}

function install(command, ...extra) {
  execFileSync("npm", [command, "--ignore-scripts", "--offline", ...extra], {
    cwd: temp,
    stdio: "inherit",
  })
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(message)
}
