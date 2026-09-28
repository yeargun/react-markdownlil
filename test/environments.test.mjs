// What upstream resolves per runtime, compared with upstream itself: react-markdown@10.1.0
// and this package bundled with the same export conditions, run in the same environment.
// vfile's `#minproc` gives `process.cwd()` under `node` and `/` everywhere else; and
// @ungap/structured-clone (mdast-util-to-hast's `structuredClone`) falls back to its
// polyfill where the runtime has no structuredClone.
import "global-jsdom/register"
import assert from "node:assert/strict"
import {execFileSync} from "node:child_process"
import {mkdirSync, rmSync, writeFileSync} from "node:fs"
import {resolve} from "node:path"
import test from "node:test"
import {pathToFileURL} from "node:url"

import React from "react"
import {renderToStaticMarkup} from "react-dom/server"

const root = new URL("..", import.meta.url).pathname
const scratch = resolve(root, ".tmp", "environments")

async function bundle(name, specifier, conditions) {
  const {build} = await import("esbuild")
  const result = await build({
    stdin: {contents: `export {default} from "${specifier}"`, resolveDir: root},
    // As web bundlers resolve: the `browser` field too where the conditions are a browser's
    // (micromark's development build imports `debug`, whose browser entry is only there).
    bundle: true, conditions, external: ["react", "react/jsx-runtime", "node:*", "tty", "util"], format: "esm",
    mainFields: conditions.includes("browser") ? ["browser", "module", "main"] : ["module", "main"],
    platform: "neutral", write: false, logLevel: "silent",
    // debug's Node entry requires Node builtins; an ES module bundle gets `require` this way.
    banner: {js: 'import {createRequire} from "node:module"; const require = createRequire(import.meta.url);'},
  })
  mkdirSync(scratch, {recursive: true})
  const path = resolve(scratch, `${name}.mjs`)
  writeFileSync(path, result.outputFiles[0].text)
  return (await import(pathToFileURL(path).href)).default
}

// What a plugin sees of the pipeline's file: its working directory and vfile's path API,
// which vfile binds per condition too (node:path and node:url's fileURLToPath under `node`,
// its shims elsewhere); each step records its result or the error it throws.
function fileOf(Markdown) {
  const seen = []
  const step = (name, run) => {
    try {
      const value = run()
      seen.push([name, value instanceof Array ? [...value] : value])
    } catch (error) {
      seen.push([name, `throws ${error.name}${error.code ? ` ${error.code}` : ""}: ${error.message}`])
    }
  }
  const probe = () => (_, file) => {
    step("cwd", () => file.cwd)
    step("no path", () => [file.path, file.basename, file.dirname, file.extname, file.stem])
    step("set path", () => {
      file.path = "~/docs/readme.md"
      return [file.basename, file.dirname, file.extname, file.stem]
    })
    step("set basename", () => {
      file.basename = "index.mdx"
      return file.path
    })
    step("set stem", () => {
      file.stem = "notes.old"
      return [file.path, file.extname]
    })
    step("set extname", () => {
      file.extname = ".txt"
      return file.path
    })
    step("set dirname", () => {
      file.dirname = "../up/./x"
      return [file.path, file.dirname]
    })
    step("relative dots", () => {
      file.path = "./a/../b//c/"
      return [file.basename, file.dirname, file.extname, file.stem]
    })
    step("a backslash path", () => {
      file.path = "C:\\docs\\a.md"
      return [file.basename, file.dirname, file.extname]
    })
    step("basename with a separator", () => {
      file.basename = "a/b"
    })
    step("dirname without a path", () => {
      const copy = new file.constructor()
      copy.dirname = "x"
    })
    step("a file URL", () => {
      file.path = new URL("file:///tmp/a%20b.md")
      return [file.path, file.basename]
    })
    step("a file URL with a host", () => {
      file.path = new URL("file://server/share/a.md")
    })
    step("an encoded slash", () => {
      file.path = new URL("file:///a%2Fb")
    })
    step("another scheme", () => {
      file.path = new URL("https://example.com/a.md")
    })
    step("history", () => file.history)
  }
  try {
    renderToStaticMarkup(React.createElement(Markdown, {children: "*a*", rehypePlugins: [probe]}))
  } catch (error) {
    seen.push(["render", `throws ${error.name}: ${error.message}`])
  }
  return seen
}

// A runtime's own process object, installed only while one render runs.
function withProcess(fake, run) {
  const saved = Object.getOwnPropertyDescriptor(globalThis, "process")
  Object.defineProperty(globalThis, "process", {value: fake, configurable: true, writable: true})
  try {
    return run()
  } finally {
    Object.defineProperty(globalThis, "process", saved)
  }
}

const processes = {
  "no process": undefined,
  "a process without cwd (React Native)": {env: {}},
  "a process whose cwd throws (Next.js edge)": {
    env: {},
    cwd() {
      throw new Error("A Node.js API is used (process.cwd) which is not supported in the Edge Runtime.")
    },
  },
  "a process whose cwd answers (workerd nodejs_compat)": {env: {}, cwd: () => "/bundle"},
}

test("the pipeline's file behaves as upstream's under each runtime's conditions", async (t) => {
  t.after(() => rmSync(scratch, {recursive: true, force: true}))
  const runtimes = {
    "cloudflare workers": ["workerd", "worker", "browser"],
    "next.js edge": ["edge-light", "browser", "module", "import"],
    "web worker bundles": ["worker", "browser"],
    "react-native": ["react-native", "browser"],
    browser: ["browser"],
    "no runtime conditions": ["import"],
    node: ["node", "import"],
    deno: ["deno", "node", "import"],
  }
  for (const [runtime, conditions] of Object.entries(runtimes)) {
    for (const development of [false, true]) {
      const active = development ? [...conditions, "development"] : conditions
      const tag = `${runtime}${development ? ", development" : ""}`.replaceAll(/\W+/g, "-")
      const upstream = await bundle(`upstream-${tag}`, "react-markdown", active)
      const port = await bundle(`port-${tag}`, "@itslil/react-markdown", active)
      const node = conditions.includes("node")
      const expected = fileOf(upstream)
      assert.deepEqual(expected[0], ["cwd", node ? process.cwd() : "/"], `${tag}: upstream's working directory`)
      assert.deepEqual(fileOf(port), expected, tag)
      // Under `node` both read node:process; elsewhere neither reads any process.
      for (const [label, fake] of Object.entries(processes)) {
        assert.deepEqual(withProcess(fake, () => fileOf(port)), withProcess(fake, () => fileOf(upstream)), `${tag}, ${label}`)
      }
    }
  }
})

// A child process removes structuredClone before either package loads, as a runtime without
// one (Hermes, Safari before 15.4) has none; the same script runs with it for the native path.
const cloneScript = (withoutNative) => `
${withoutNative ? "delete globalThis.structuredClone" : ""}
const React = (await import("react")).default
const {renderToStaticMarkup} = await import("react-dom/server")
const {isDeepStrictEqual} = await import("node:util")
const upstream = (await import("react-markdown")).default
const port = (await import(${JSON.stringify(pathToFileURL(resolve(root, "dist/react-markdown.esm.js")).href)})).default

function cloneThrough(Markdown, hProperties) {
  let properties
  const set = () => (tree) => {
    tree.children[0].data = {hProperties}
  }
  const take = () => (tree) => {
    properties = tree.children[0].properties
    tree.children = []
  }
  try {
    renderToStaticMarkup(React.createElement(Markdown, {children: "a", remarkPlugins: [set], rehypePlugins: [take]}))
  } catch (error) {
    return {error: error.constructor.name + " " + error.name + ": " + error.message}
  }
  return {properties}
}

const shared = {x: 1}
const buffer = new Uint8Array([3, 4]).buffer
const sparse = [1, , 3]
const cases = {
  plain: () => ({className: ["a", "b"], id: "x", dataCount: 3, hidden: true, nested: {deep: [1, "two", null, undefined, true]}}),
  exotic: () => ({
    date: new Date(0), invalidDate: new Date(Number.NaN), regex: /a+/giu, map: new Map([["k", {v: 1}], [shared, "object key"]]),
    set: new Set([1, "s", shared]), error: new TypeError("boom"), rangeError: new RangeError("r"), bigint: 10n,
    boxedBigint: Object(10n), boxedNumber: Object(1), boxedString: Object("s"), boxedBoolean: Object(false),
    typed: new Uint16Array([1, 2]), float: new Float64Array([0.5]), view: new DataView(new Uint8Array([4, 5]).buffer),
    buffer, bufferAgain: buffer, sparse, sharedA: shared, sharedB: shared,
  }),
  "negative zero": () => ({alone: -0, afterZero: [0, -0], beforeZero: [-0, 0], nested: {z: -0}}),
  "own __proto__ key": () => JSON.parse('{"__proto__": {"polluted": true}, "x": {"__proto__": [1]}}'),
  cycle: () => {
    const node = {name: "loop"}
    node.self = node
    return {node}
  },
  function: () => ({onClick() {}}),
  symbol: () => ({tag: Symbol("t")}),
  "error named after a guarded global": () => ({error: Object.assign(new Error("m"), {name: "setTimeout"})}),
}

// isDeepStrictEqual finds two invalid dates unequal (NaN time values), so they compare as text.
const comparable = (properties) =>
  Object.fromEntries(Object.entries(properties).map(([key, value]) => [key, value instanceof Date && Number.isNaN(value.getTime()) ? "Invalid Date" : value]))

const report = {}
for (const [name, make] of Object.entries(cases)) {
  const a = cloneThrough(upstream, make())
  const b = cloneThrough(port, make())
  const same = a.error || b.error ? a.error === b.error : isDeepStrictEqual(comparable(a.properties), comparable(b.properties))
  const aliases = (p) => p && [p.sharedA === p.sharedB, p.buffer === p.bufferAgain, p.node?.self === p.node, p.map && [...p.map.keys()][1] === [...p.set][2],
    Object.is(p.alone, -0), p.afterZero?.map((z) => Object.is(z, -0)), p.beforeZero?.map((z) => Object.is(z, -0)),
    Object.getPrototypeOf(p.x ?? {}) === Object.prototype, Object.hasOwn(p, "__proto__") || Object.hasOwn(p.x ?? {}, "__proto__")]
  report[name] = {same, upstream: a.error ?? "cloned", port: b.error ?? "cloned", aliases: isDeepStrictEqual(aliases(a.properties), aliases(b.properties))}
}
console.log(JSON.stringify({native: typeof globalThis.structuredClone, ungap: (await import("@ungap/structured-clone/package.json", {with: {type: "json"}})).default.version, report}))
`

for (const withoutNative of [true, false]) {
  test(`hProperties clone as upstream's, ${withoutNative ? "without a native structuredClone (the polyfill)" : "with the native structuredClone"}`, () => {
    const output = execFileSync(process.execPath, ["--input-type=module", "-e", cloneScript(withoutNative)], {cwd: root, encoding: "utf8"})
    const {native, ungap, report} = JSON.parse(output)
    assert.equal(native, withoutNative ? "undefined" : "function")
    assert.equal(ungap, "1.4.0")
    for (const [name, result] of Object.entries(report)) {
      assert.equal(result.port, result.upstream, name)
      assert.ok(result.same, `${name}: the port's clone differs from upstream's`)
      assert.ok(result.aliases, `${name}: shared references differ`)
    }
    if (withoutNative) {
      assert.equal(report.function.upstream, "TypeError TypeError: unable to serialize function")
      assert.equal(report["error named after a guarded global"].upstream, "TypeError TypeError: unable to deserialize setTimeout")
    }
  })
}
