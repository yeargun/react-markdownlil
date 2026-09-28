// The delivered builds other than the development one the suites import: the
// production CommonJS file (the compiler's program with a module.exports
// wrapper) and the browser build, which decodes named character references
// through the document instead of the entity table.
import "global-jsdom/register"
import assert from "node:assert/strict"
import {createRequire} from "node:module"
import test from "node:test"

import React from "react"
import {renderToStaticMarkup} from "react-dom/server"

const require = createRequire(import.meta.url)
const render = (Markdown, children) => renderToStaticMarkup(React.createElement(Markdown, {children}))
const api = ["MarkdownAsync", "MarkdownHooks", "default", "defaultUrlTransform"]
const references = [
  "&copy; &amp; &lt;b&gt; &AElig; &frac12; &nbsp;.",
  "&not &notin; &notit; &semi; &foo; &amp",
  "[a](https://example.com/?a=1&copy=2 \"&quot;t&quot;\")",
  "`&copy;` and &#169; &#xA9; &#0;",
].join("\n\n")

test("production CommonJS matches the ES module", async () => {
  const esm = await import("../dist/react-markdown.esm.js")
  const cjs = require("../dist/react-markdown.cjs")
  assert.deepEqual(Object.keys(cjs).sort(), api)
  assert.equal(cjs.__esModule, true)
  assert.equal(Object.keys(cjs).includes("__esModule"), false)
  assert.equal(cjs.default.name, "Markdown")
  assert.equal(render(cjs.default, references), render(esm.default, references))
})

test("the browser build decodes references through the document as the table does", async () => {
  const esm = await import("../dist/react-markdown.esm.js")
  const browser = await import("../dist/react-markdown.browser.js")
  assert.deepEqual(Object.keys(browser).sort(), api)
  const expected = render(esm.default, references)
  assert.match(expected, /© &amp; &lt;b&gt; Æ ½/)
  assert.equal(render(browser.default, references), expected)
})

// Upstream's graph resolves two condition maps: decode-named-character-reference's
// (the entity table for convex, deno, edge-light, react-native, worker and workerd,
// the document under `browser`) and vfile's (node:path, node:process and node:url
// under `node`, its shims otherwise). The package maps each condition set to the
// program built for that pair: the Node program under `node`, the browser program
// under `browser`, and the worker program (table and shims) everywhere else. Under
// `development` each gets that program with devlop's assertions on.
test("each runtime resolves the program upstream's conditions give it", async () => {
  const {build} = await import("esbuild")
  const root = new URL("..", import.meta.url).pathname
  // Next.js's edge compiler adds `edge-light` to the web conditions (no `worker`), so each
  // runtime's own condition must come before `browser`, as in decode-named-character-reference.
  const runtimes = {
    "cloudflare workers": [["workerd", "worker", "browser"], "worker"],
    "next.js edge": [["edge-light", "browser", "module", "import"], "worker"],
    "vercel edge functions": [["edge-light", "browser"], "worker"],
    "web worker bundles": [["worker", "browser"], "worker"],
    "react-native": [["react-native", "browser"], "worker"],
    "convex functions": [["convex", "browser"], "worker"],
    "no runtime conditions": [["import"], "worker"],
    browser: [["browser"], "browser"],
    node: [["node", "import"], "node"],
    "node, require": [["node", "require"], "node-cjs"],
    deno: [["deno", "node", "import"], "node"],
    "convex node actions": [["convex", "node", "import"], "node"],
  }
  const files = {
    worker: ["dist/react-markdown.worker.js", "dist/react-markdown.worker.development.js"],
    browser: ["dist/react-markdown.browser.js", "dist/react-markdown.browser.development.js"],
    node: ["dist/react-markdown.esm.js", "dist/react-markdown.development.js"],
    "node-cjs": ["dist/react-markdown.cjs", "dist/react-markdown.development.cjs"],
  }
  for (const [runtime, [conditions, program]] of Object.entries(runtimes)) {
    for (const development of [false, true]) {
      const require = conditions.includes("require")
      const result = await build({
        stdin: {contents: require ? 'module.exports = require("@itslil/react-markdown")' : 'export {default} from "@itslil/react-markdown"', resolveDir: root},
        bundle: true, conditions: (development ? [...conditions, "development"] : conditions).filter((name) => name !== "require" && name !== "import"),
        external: ["react", "react/jsx-runtime", "node:*"], format: require ? "cjs" : "esm",
        metafile: true, platform: "neutral", write: false, logLevel: "silent",
      })
      const inputs = Object.keys(result.metafile.inputs).filter((path) => path.startsWith("dist/"))
      assert.deepEqual(inputs, [files[program][development ? 1 : 0]], `${runtime}${development ? ", development" : ""}`)
    }
  }
})

test("the worker build decodes references from the table, as the Node build does", async () => {
  const esm = await import("../dist/react-markdown.esm.js")
  const worker = await import("../dist/react-markdown.worker.js")
  assert.deepEqual(Object.keys(worker).sort(), api)
  assert.equal(render(worker.default, references), render(esm.default, references))
})
