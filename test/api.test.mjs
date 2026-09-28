import assert from "node:assert/strict"
import {readFileSync} from "node:fs"
import {createRequire} from "node:module"
import test from "node:test"

import React from "react"
import {renderToStaticMarkup} from "react-dom/server"

const require = createRequire(import.meta.url)

test("public api", async () => {
  const mod = await import("@itslil/react-markdown")
  assert.deepEqual(Object.keys(mod).sort(), [
    "MarkdownAsync",
    "MarkdownHooks",
    "default",
    "defaultUrlTransform",
  ])

  assert.equal(mod.default.name, "Markdown")
  assert.equal(mod.MarkdownAsync.name, "MarkdownAsync")
  assert.equal(mod.MarkdownHooks.name, "MarkdownHooks")
  assert.equal(mod.defaultUrlTransform.name, "defaultUrlTransform")

  const closed = await import("@itslil/react-markdown/closed")
  assert.deepEqual(Object.keys(closed).sort(), Object.keys(mod).sort())
  assert.equal(
    renderToStaticMarkup(React.createElement(closed.default, {children: "a"})),
    "<p>a</p>",
  )
})

test("CommonJS export", () => {
  const mod = require("@itslil/react-markdown")
  assert.deepEqual(Object.keys(mod).sort(), [
    "MarkdownAsync",
    "MarkdownHooks",
    "default",
    "defaultUrlTransform",
  ])
  assert.equal(
    renderToStaticMarkup(React.createElement(mod.default, {children: "a"})),
    "<p>a</p>",
  )
  assert.throws(
    () => mod.default({children: 1}),
    (error) => error.name === "Assertion" && error.code === "ERR_ASSERTION",
  )
})

// Each program imports React and nothing else of the graph; the Node program also imports
// the three Node modules upstream's vfile imports under `node` (node:path, node:process and
// node:url), where the browser and worker programs carry vfile's shims.
test("runtime helpers are compiled from LilScript", () => {
  const programs = {
    "react-markdown.esm.js": ["node:path", "node:process", "node:url", "react", "react/jsx-runtime"],
    "react-markdown.browser.js": ["react", "react/jsx-runtime"],
    "react-markdown.worker.js": ["react", "react/jsx-runtime"],
  }
  for (const [file, imports] of Object.entries(programs)) {
  const source = readFileSync(new URL(`../dist/${file}`, import.meta.url), "utf8")
  for (const dependency of [
    "@itslil/unified",
    "@itslil/remark-parse",
    "@itslil/remark-rehype",
    "devlop",
    "hast-util-to-jsx-runtime",
    "property-information",
    "style-to-js",
    "unist-util-visit",
    "vfile",
  ]) {
    assert.doesNotMatch(source, new RegExp(`from[ '\\"]+${dependency}`))
  }
  assert.deepEqual(
    [...source.matchAll(/from ['\"]([^'\"]+)['\"]/g)].map((match) => match[1]).sort(),
    imports,
    file,
  )
  }
})
