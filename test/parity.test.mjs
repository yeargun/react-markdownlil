import assert from "node:assert/strict"
import {execFileSync} from "node:child_process"
import test from "node:test"

import {toJsxRuntime as upstreamToJsxRuntime} from "hast-util-to-jsx-runtime"
import {html, svg} from "property-information"
import {Fragment, jsx, jsxs} from "react/jsx-runtime"
import {renderToStaticMarkup} from "react-dom/server"
import OfficialMarkdown from "react-markdown"
import {VFile as UpstreamVFile} from "vfile"
import rehypeKatex from "@itslil/rehype-katex"
import remarkBreaks from "@itslil/remark-breaks"
import remarkGfm from "@itslil/remark-gfm"
import remarkMath from "@itslil/remark-math"
import Markdown, {
  MarkdownAsync,
  defaultUrlTransform,
} from "../dist/react-markdown.development.js"

test("defaultUrlTransform preserves its string-only runtime contract", () => {
  assert.throws(() => defaultUrlTransform(1), TypeError)

  const value = new String("https://example.com")
  assert.equal(defaultUrlTransform(value), value)
  assert.equal(Object.hasOwn(defaultUrlTransform, "prototype"), true)
  assert.doesNotThrow(() => Reflect.construct(defaultUrlTransform, ["https://example.com"]))

  const stringLike = {
    indexOf(value) {
      return value === ":" ? 5 : -1
    },
    slice() {
      return {
        valueOf() {
          return "https"
        },
        toString() {
          return "other"
        },
      }
    },
  }
  assert.equal(defaultUrlTransform(stringLike), "")
})

test("development assertions preserve devlop error details", () => {
  assert.throws(
    () => Markdown({children: 1}),
    (error) =>
      error.name === "Assertion" &&
      error.code === "ERR_ASSERTION" &&
      error.message === "Unexpected value `1` for `children` prop, expected `string`",
  )
})

test("production assertions are no-ops", () => {
  const script = `
    import {createRequire} from "node:module";
    import Markdown from "./dist/react-markdown.esm.js";
    import {renderToStaticMarkup} from "react-dom/server";
    const require = createRequire(import.meta.url);
    const required = require("@itslil/react-markdown");
    const values = [
      renderToStaticMarkup(Markdown({children: 1})),
      renderToStaticMarkup(Markdown({source: "a"})),
      renderToStaticMarkup(Markdown({children: "# a", allowedElements: ["p"], disallowedElements: ["a"]})),
      renderToStaticMarkup(required.default({children: 1}))
    ];
    process.stdout.write(JSON.stringify(values));
  `
  const result = execFileSync(process.execPath, ["--input-type=module", "--eval", script], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  })
  assert.deepEqual(JSON.parse(result), ["", "", "", ""])
})

test("MarkdownAsync is async even when setup fails synchronously", async () => {
  assert.equal(Object.prototype.toString.call(MarkdownAsync), "[object AsyncFunction]")
  await assert.rejects(
    MarkdownAsync({children: 1}),
    /Unexpected value `1` for `children` prop, expected `string`/,
  )
})

test("plugins share one in-graph VFile identity", () => {
  const files = []

  renderToStaticMarkup(
    Markdown({
      children: "a",
      rehypePlugins: [function () {
        return function (_, givenFile) {
          files.push(givenFile)
        }
      }, function () {
        return function (_, givenFile) {
          files.push(givenFile)
        }
      }],
    }),
  )

  const file = files[0]
  assert.equal(files[1], file)
  assert.equal(file.constructor.name, "VFile")
  assert.equal(file instanceof file.constructor, true)
  assert.equal(file.cwd, process.cwd())
  assert.equal(typeof file.fail, "function")
  assert.equal(typeof file.info, "function")
  assert.equal(typeof file.message, "function")
  assert.equal(file.toString(), "a")
})

test("VFile metadata and diagnostics match the upstream contract", () => {
  let file

  renderToStaticMarkup(
    Markdown({
      children: "a",
      rehypePlugins: [function () {
        return function (_, givenFile) {
          file = givenFile
        }
      }],
    }),
  )

  assert.equal(file.cwd, process.cwd())
  file.path = "/tmp/readme.md"
  assert.equal(file.basename, "readme.md")
  assert.equal(file.stem, "readme")
  assert.equal(file.extname, ".md")
  assert.equal(file.dirname, "/tmp")
  const message = file.message("problem", {line: 2, column: 3})
  assert.equal(message.name, "/tmp/readme.md:2:3")
  assert.equal(message.file, "/tmp/readme.md")
  assert.equal(message.reason, "problem")
  assert.equal(message.fatal, false)
})

test("local GFM, breaks, math, and KaTeX plugins compose", () => {
  const result = renderToStaticMarkup(
    Markdown({
      children:
        "~~old~~\nnew\n\n| expression | done |\n| - | - |\n| $x^2$ | yes |\n\n$$\n\\frac{a}{b}\n$$",
      rehypePlugins: [rehypeKatex],
      remarkPlugins: [remarkGfm, remarkBreaks, remarkMath],
    }),
  )

  assert.match(result, /<del>old<\/del><br\/>\nnew/)
  assert.match(result, /<table>/)
  assert.match(result, /class="katex"/)
  assert.match(result, /class="katex-display"/)
  assert.match(result, /<mfrac>/)
})

test("remarkRehypeOptions uses object-spread coercion", () => {
  for (const remarkRehypeOptions of [1, "x", true, Symbol("x")]) {
    assert.equal(
      renderToStaticMarkup(Markdown({children: "a", remarkRehypeOptions})),
      "<p>a</p>",
    )
  }

  let reads = 0
  const options = {children: "a"}
  Object.defineProperty(options, "remarkRehypeOptions", {
    get() {
      reads++
      return {}
    },
  })
  Markdown(options)
  assert.equal(reads, 2)
})

test("does not repair malformed element properties", () => {
  function plugin() {
    return function () {
      return {
        type: "root",
        children: [{type: "element", tagName: "i", children: []}],
      }
    }
  }

  assert.throws(
    () => Markdown({children: "a", rehypePlugins: [plugin]}),
    TypeError,
  )
})

test("preserves failures and nonmatches for malformed tree nodes", () => {
  function withChild(child) {
    return function () {
      return function () {
        return {type: "root", children: [child]}
      }
    }
  }

  assert.equal(
    renderToStaticMarkup(
      Markdown({
        children: "a",
        rehypePlugins: [
          withChild({
            type: Symbol("element"),
            tagName: "i",
            properties: {},
            children: [],
          }),
        ],
      }),
    ),
    "",
  )
  assert.throws(
    () => Markdown({children: "a", rehypePlugins: [withChild(1)]}),
    TypeError,
  )
})

test("raw nodes are replaced with indexed assignment", () => {
  const writes = []
  const children = new Proxy([{type: "raw", value: "a"}], {
    set(target, key, value, receiver) {
      writes.push(String(key))
      return Reflect.set(target, key, value, receiver)
    },
  })

  function plugin() {
    return function () {
      return {type: "root", children}
    }
  }

  assert.equal(
    renderToStaticMarkup(Markdown({children: "a", rehypePlugins: [plugin]})),
    "a",
  )
  assert.deepEqual(writes, ["0"])
})

test("URL properties use String coercion", () => {
  let actual
  const value = {
    valueOf() {
      return "https:value-of.example"
    },
    toString() {
      return "https://to-string.example"
    },
  }

  function plugin() {
    return function () {
      return {
        type: "root",
        children: [
          {
            type: "element",
            tagName: "a",
            properties: {href: value},
            children: [],
          },
        ],
      }
    }
  }

  Markdown({
    children: "a",
    rehypePlugins: [plugin],
    urlTransform(url) {
      actual = url
      return url
    },
  })
  assert.equal(actual, "https://to-string.example")
})

test("URL processing preserves properties getter access", () => {
  let reads = 0
  const properties = {href: "https://example.com"}
  const node = {type: "element", tagName: "a", children: []}
  Object.defineProperty(node, "properties", {
    get() {
      reads++
      return properties
    },
  })

  function plugin() {
    return function () {
      return {type: "root", children: [node]}
    }
  }

  Markdown({children: "a", rehypePlugins: [plugin]})
  assert.equal(reads, 16)
})

test("supports valid complex styles and ignores an entirely invalid style", () => {
  assert.equal(
    renderWithStyle("color:red;/* note */font-weight:bold"),
    '<i style="color:red;font-weight:bold"></i><p>a</p>',
  )
  assert.equal(
    renderWithStyle("--x: a;b;color:blue"),
    "<i></i><p>a</p>",
  )
})

test("supports passed-through MDX JSX element attributes", () => {
  function plugin() {
    return function () {
      return {
        type: "root",
        children: [
          {
            type: "mdxJsxFlowElement",
            name: "i",
            attributes: [
              {type: "mdxJsxAttribute", name: "title", value: "x"},
            ],
            children: [{type: "text", value: "a"}],
          },
        ],
      }
    }
  }

  assert.equal(
    renderToStaticMarkup(Markdown({children: "a", rehypePlugins: [plugin]})),
    '<i title="x">a</i>',
  )
})

test("matches upstream JSX conversion for styles and property schemas", () => {
  const trees = [
    elementTree("i", {
      accept: ["a", "b"],
      ariaDescribedBy: "description",
      className: ["alpha", "beta"],
      dataWhatever: "value",
      style: "color:red; background:url('data:image/svg+xml;a'); font-weight:bold",
    }),
    elementTree("svg", {viewBox: "0 0 10 10", strokeMiterLimit: 2}),
    elementTree("i", {style: "--x: a;b;color:blue"}),
  ]

  for (const tree of trees) {
    assert.equal(renderLocalTree(tree), renderUpstreamTree(tree))
  }
})

test("matches every upstream HTML and SVG property record", () => {
  for (const [tagName, schema] of [["i", html], ["svg", svg]]) {
    const properties = {}
    for (const info of Object.values(schema.property)) {
      if (info.property === "children") continue
      properties[info.property] = info.property === "style"
        ? "color:red"
        : info.commaSeparated || info.spaceSeparated
          ? ["a", "b"]
          : "x"
    }
    const tree = elementTree(tagName, properties)
    assert.deepEqual(
      captureProperties(Markdown, tree, tagName),
      captureProperties(OfficialMarkdown, tree, tagName),
      tagName,
    )
  }
})

test("matches upstream MDX attributes and missing-evaluater errors", () => {
  const plain = {
    type: "root",
    children: [{
      type: "mdxJsxFlowElement",
      name: "i",
      attributes: [{type: "mdxJsxAttribute", name: "title", value: "x"}],
      children: [{type: "text", value: "a"}],
    }],
  }
  assert.equal(renderLocalTree(plain), renderUpstreamTree(plain))

  const absentValue = {
    type: "root",
    children: [{
      type: "mdxJsxFlowElement",
      name: "i",
      attributes: [{type: "mdxJsxAttribute", name: "hidden"}],
      children: [],
    }],
  }
  assert.equal(renderLocalTree(absentValue), renderUpstreamTree(absentValue))

  const member = {
    type: "root",
    children: [{
      type: "mdxJsxFlowElement",
      name: "Components.Em",
      attributes: [],
      children: [],
      position: {start: {line: 2, column: 3}, end: {line: 2, column: 16}},
    }],
  }
  assert.deepEqual(captureRenderError(() => renderLocalTree(member)), captureRenderError(() => renderUpstreamTree(member)))

  const expressionAttribute = {
    type: "root",
    children: [{
      type: "mdxJsxFlowElement",
      name: "i",
      attributes: [{type: "mdxJsxAttribute", name: "title", value: {type: "mdxJsxAttributeValueExpression", value: "x"}}],
      children: [],
      position: {start: {line: 4, column: 5}, end: {line: 4, column: 20}},
    }],
  }
  assert.deepEqual(
    captureRenderError(() => renderLocalTree(expressionAttribute)),
    captureRenderError(() => renderUpstreamTree(expressionAttribute)),
  )
})

function elementTree(tagName, properties) {
  return {type: "root", children: [{type: "element", tagName, properties, children: []}]}
}

function renderLocalTree(tree) {
  function plugin() {
    return function () {
      return structuredClone(tree)
    }
  }

  return renderToStaticMarkup(Markdown({children: "", rehypePlugins: [plugin]}))
}

function renderUpstreamTree(tree) {
  return renderToStaticMarkup(
    upstreamToJsxRuntime(structuredClone(tree), {
      Fragment,
      ignoreInvalidStyle: true,
      jsx,
      jsxs,
      passKeys: true,
      passNode: true,
    }),
  )
}

function captureProperties(Implementation, tree, tagName) {
  let captured
  function plugin() {
    return function () {
      return structuredClone(tree)
    }
  }
  function component({children: _, node: _node, ...properties}) {
    captured = properties
    return null
  }
  renderToStaticMarkup(Implementation({
    children: "",
    components: {[tagName]: component},
    rehypePlugins: [plugin],
  }))
  return captured
}

function captureRenderError(callback) {
  try {
    callback()
  } catch (error) {
    return {
      column: error.column,
      file: error.file,
      line: error.line,
      message: error.message,
      name: error.name,
      ruleId: error.ruleId,
      source: error.source,
      url: error.url,
    }
  }
  assert.fail("expected rendering to throw")
}

function renderWithStyle(style) {
  function plugin() {
    return function (tree) {
      tree.children.unshift({
        type: "element",
        tagName: "i",
        properties: {style},
        children: [],
      })
    }
  }

  return renderToStaticMarkup(
    Markdown({children: "a", rehypePlugins: [plugin]}),
  )
}
