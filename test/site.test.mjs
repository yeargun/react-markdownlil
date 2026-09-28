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

  it("compares every library of the stack in one table, with the detail in place", () => {
    const html = readFileSync(resolve(root, "site/index.html"), "utf8")
    assert.match(html, /id="stack-body"/)
    assert.match(html, /id="stack-tabs"/)
    assert.match(html, /id="stack-detail"/)
    const stack = JSON.parse(readFileSync(resolve(root, "site/stack/index.json"), "utf8"))
    assert.ok(stack.packages.length >= 15)
    for (const pkg of stack.packages) {
      assert.ok(pkg.lil?.brotli11 > 0, `${pkg.id}: delivered lane`)
      assert.ok(pkg.bar?.brotli11 > 0, `${pkg.id}: bar`)
      assert.ok(!pkg.bar.id.includes("nomangle") && !pkg.bar.id.includes("browser"), `${pkg.id}: same-surface bar`)
      assert.ok(pkg.comparable || pkg.note, `${pkg.id}: an unlike comparison says why`)
    }
  })

  it("shows the real-app test, written from its results, in the page and the README alike", () => {
    const html = readFileSync(resolve(root, "site/index.html"), "utf8")
    assert.match(html, /id="real-app"/)
    const real = JSON.parse(readFileSync(resolve(root, "site/real-app.json"), "utf8"))
    assert.ok(real.cards.length >= 4)
    assert.ok(real.tables.length >= 8)
    for (const table of real.tables) {
      for (const row of table.rows) assert.equal(row.length, table.columns.length, `${table.id}: ${row[0]}`)
    }
    const readme = readFileSync(resolve(root, "README.md"), "utf8")
    const section = readme.match(/<!-- real-app:start -->([\s\S]*)<!-- real-app:end -->/)?.[1] ?? ""
    assert.match(section, /## In a real app/)
    for (const table of real.tables) assert.ok(section.includes(`### ${table.title}`), table.title)
  })

  it("shows this release only, with no previous-release comparison", () => {
    const results = JSON.parse(readFileSync(resolve(root, "site/results.json"), "utf8"))
    assert.equal("previousRelease" in results, false)
    assert.doesNotMatch(readFileSync(resolve(root, "site/compiler.js"), "utf8"), /previous/i)
    assert.doesNotMatch(readFileSync(resolve(root, "README.md"), "utf8"), /previous release/i)
  })
})
