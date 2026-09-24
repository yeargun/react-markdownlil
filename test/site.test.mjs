import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, it } from "node:test"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

describe("site", () => {
  it("has a markedlil-style lab with stack tabs", () => {
    assert.equal(existsSync(resolve(root, "site/index.html")), true)
    assert.equal(existsSync(resolve(root, "site/app.js")), true)
    assert.equal(existsSync(resolve(root, "site/results.json")), true)
    const html = readFileSync(resolve(root, "site/index.html"), "utf8")
    assert.match(html, /scoreboard/)
    assert.match(html, /#evidence/)
    assert.match(html, /#lab/)
    assert.match(html, /stack-tabs/)
    assert.match(html, /@itslil\/react-markdown/)
  })

  it("shows compile time, the delivered files and the bars", () => {
    const html = readFileSync(resolve(root, "site/index.html"), "utf8")
    assert.match(html, /id="compiler-release"/)
    assert.equal(existsSync(resolve(root, "site/compiler.js")), true)
    const results = JSON.parse(readFileSync(resolve(root, "site/results.json"), "utf8"))
    assert.match(results.compiler.revision, /^[0-9a-f]{7,40}$/)
    assert.match(results.compiler.binarySha256, /^[0-9a-f]{64}$/)
    assert.ok(results.compiler.compileWallMs.length >= 3)
    for (const invocation of results.compiler.invocations) {
      assert.equal(invocation.wallMs.length, results.compiler.compileWallMs.length)
      assert.ok(invocation.wallMs.every((ms) => ms > 0))
    }
    // A delivered file is compiler-written or says what wrote it.
    for (const entry of results.delivered) {
      assert.ok(entry.compilerWritten || /not compiler-written/.test(entry.writtenBy), entry.file)
    }
    const primary = results.size.find((lane) => lane.primary)
    const browser = results.delivered.find((entry) => entry.file === "dist/react-markdown.browser.js")
    assert.deepEqual([primary.raw, primary.gzip9, primary.brotli11], [browser.raw, browser.gzip9, browser.brotli11])
    const baseline = results.size.find((lane) => lane.baseline)
    const bars = results.size.filter((lane) => lane.id.startsWith("official-"))
    assert.equal(baseline.brotli11, Math.min(...bars.map((lane) => lane.brotli11)))
  })
})
