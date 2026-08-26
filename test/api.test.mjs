import assert from "node:assert/strict"
import test from "node:test"

test("public api", async () => {
  const mod = await import("../dist/react-markdown.esm.js")
  assert.deepEqual(Object.keys(mod).sort(), [
    "MarkdownAsync",
    "MarkdownHooks",
    "default",
    "defaultUrlTransform",
  ])
})
