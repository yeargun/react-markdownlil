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

test("runtime helpers are compiled from LilScript", () => {
  const source = readFileSync(new URL("../dist/react-markdown.esm.js", import.meta.url), "utf8")
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
    ["react", "react/jsx-runtime"],
  )
})
