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

// Runtimes without a DOM that bundle with the `browser` condition too
// (Cloudflare Workers, Next.js edge) must get the entity-table build, as
// upstream's decode-named-character-reference routes them to its table.
test("worker and edge runtimes resolve a build that needs no document", async () => {
  const {build} = await import("esbuild")
  const root = new URL("..", import.meta.url).pathname
  // Next.js's edge compiler adds `edge-light` to the web conditions (no `worker`), so each
  // runtime's own condition must come before `browser`, as in decode-named-character-reference.
  const runtimes = {
    "cloudflare workers": ["workerd", "worker", "browser"],
    "next.js edge": ["edge-light", "browser", "module", "import"],
    "vercel edge functions": ["edge-light", "browser"],
    "web worker bundles": ["worker", "browser"],
    convex: ["convex", "browser"],
    deno: ["deno", "browser"],
    "react-native": ["react-native", "browser"],
    browser: ["browser"],
  }
  for (const [runtime, conditions] of Object.entries(runtimes)) {
    const result = await build({
      stdin: {contents: 'export {default} from "@itslil/react-markdown"', resolveDir: root},
      bundle: true, conditions, external: ["react", "react/jsx-runtime"], format: "esm",
      metafile: true, platform: "neutral", write: false, logLevel: "silent",
    })
    const inputs = Object.keys(result.metafile.inputs).filter((path) => path.startsWith("dist/"))
    const expected = runtime === "browser" ? "dist/react-markdown.browser.js" : "dist/react-markdown.esm.js"
    assert.deepEqual(inputs, [expected], runtime)
  }
})
