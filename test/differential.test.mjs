import assert from "node:assert/strict"
import test from "node:test"

import {renderToStaticMarkup} from "react-dom/server"
import OfficialMarkdown, {MarkdownAsync as OfficialMarkdownAsync} from "react-markdown"
import Markdown, {MarkdownAsync} from "../dist/react-markdown.development.js"

const documents = [
  "",
  "plain text",
  "# heading",
  "*em* and **strong** and `code`",
  "> quote\n>\n> continued",
  "1. one\n2. two\n\n- a\n- b",
  "[link](https://example.com \"title\")",
  "![image](/image.png \"title\")",
  "```js\nconsole.log(1)\n```",
  "a\\\nb",
  "<i>raw</i>",
  "a[^note]\n\n[^note]: footnote",
]

test("matches react-markdown@10.1.0 across the core markdown corpus", () => {
  for (const children of documents) {
    assert.equal(
      renderToStaticMarkup(Markdown({children})),
      renderToStaticMarkup(OfficialMarkdown({children})),
      JSON.stringify(children),
    )
  }
})

test("matches react-markdown@10.1.0 for filtering and transformed properties", () => {
  const cases = [
    {children: "# *a*", allowedElements: ["h1"], unwrapDisallowed: true},
    {children: "# *a*", disallowedElements: ["em"]},
    {children: "[x](javascript:alert(1))"},
    {children: "<b>x</b>", skipHtml: true},
    {children: "a", rehypePlugins: [propertiesPlugin]},
  ]

  for (const options of cases) {
    assert.equal(
      renderToStaticMarkup(Markdown(options)),
      renderToStaticMarkup(OfficialMarkdown(options)),
    )
  }
})

test("matches dynamic plugin identity, option merging, order, and VFile sharing", () => {
  assert.deepEqual(pluginTrace(Markdown), pluginTrace(OfficialMarkdown))
})

test("matches option getter evaluation order", () => {
  assert.deepEqual(getterTrace(Markdown), getterTrace(OfficialMarkdown))
})

test("matches async plugin boundaries", async () => {
  assert.equal(
    renderToStaticMarkup(await MarkdownAsync({children: "a", rehypePlugins: [asyncPlugin]})),
    renderToStaticMarkup(await OfficialMarkdownAsync({children: "a", rehypePlugins: [asyncPlugin]})),
  )
})

test("matches passed-through MDX and development error details", () => {
  const mdxPlugin = () => () => ({
    type: "root",
    children: [{
      type: "mdxJsxFlowElement",
      name: "i",
      attributes: [{type: "mdxJsxAttribute", name: "title", value: "x"}],
      children: [{type: "text", value: "a"}],
    }],
  })
  assert.equal(
    renderToStaticMarkup(Markdown({children: "", rehypePlugins: [mdxPlugin]})),
    renderToStaticMarkup(OfficialMarkdown({children: "", rehypePlugins: [mdxPlugin]})),
  )
  assert.deepEqual(
    errorShape(() => Markdown({children: 1})),
    errorShape(() => OfficialMarkdown({children: 1})),
  )
})

function propertiesPlugin() {
  return function (tree) {
    tree.children.unshift({
      type: "element",
      tagName: "svg",
      properties: {
        ariaDescribedBy: "description",
        className: ["a", "b"],
        dataExampleValue: "x",
        strokeMiterLimit: 2,
        style: "color:red;/* comment */font-weight:bold",
        viewBox: "0 0 10 10",
      },
      children: [],
    })
  }
}

function pluginTrace(Implementation) {
  const trace = []
  const files = []
  function repeated(options) {
    trace.push(["attach", options])
    return function (tree, file) {
      trace.push(["transform", tree.type, file.value])
      files.push(file)
    }
  }
  function second() {
    trace.push(["attach-second"])
    return function (_, file) {
      trace.push(["transform-second", file.value])
      files.push(file)
    }
  }
  const html = renderToStaticMarkup(Implementation({
    children: "a",
    remarkPlugins: [
      [repeated, {first: true}],
      [repeated, {second: true}],
      second,
    ],
  }))
  return {html, sameFile: files[0] === files[1], trace}
}

function getterTrace(Implementation) {
  const trace = []
  const values = {children: "a"}
  const options = new Proxy(values, {
    get(target, key, receiver) {
      trace.push(String(key))
      return Reflect.get(target, key, receiver)
    },
  })
  renderToStaticMarkup(Implementation(options))
  return trace
}

function asyncPlugin() {
  return async function (tree) {
    await Promise.resolve()
    tree.children.push({type: "element", tagName: "i", properties: {}, children: []})
  }
}

function errorShape(callback) {
  try {
    callback()
  } catch (error) {
    return {
      code: error.code,
      message: error.message,
      name: error.name,
    }
  }
  assert.fail("expected an error")
}
