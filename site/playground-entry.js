import { createElement, useMemo, useState } from "react"
import { createRoot } from "react-dom/client"
import Markdown from "@itslil/react-markdown"
import remarkGfm from "@itslil/remark-gfm"
import remarkBreaks from "@itslil/remark-breaks"
import remarkMath from "@itslil/remark-math"
import rehypeKatex from "@itslil/rehype-katex"

const sample = `# React markdown lab

Tables, tasks, math, and breaks from \`@itslil/*\`.

| a | b |
| --- | --- |
| 1 | 2 |

- [x] gfm task
- item

A paragraph
with a soft break.

Inline $E=mc^2$ and display:

$$
\\int_0^1 x^2 \\, dx
$$

[safe](https://yeargun.github.io/) [blocked](javascript:alert(1))
`

function App() {
  const [source, setSource] = useState(sample)
  const [gfm, setGfm] = useState(true)
  const [math, setMath] = useState(true)
  const [breaks, setBreaks] = useState(false)
  const remarkPlugins = useMemo(() => {
    const list = []
    if (gfm) list.push(remarkGfm)
    if (math) list.push(remarkMath)
    if (breaks) list.push(remarkBreaks)
    return list
  }, [gfm, math, breaks])
  const rehypePlugins = useMemo(() => (math ? [rehypeKatex] : []), [math])
  return createElement(
    "div",
    { className: "play-grid" },
    createElement("textarea", {
      id: "source",
      spellCheck: false,
      "aria-label": "Markdown source",
      value: source,
      onChange: (event) => setSource(event.target.value),
    }),
    createElement(
      "div",
      { className: "preview-wrap" },
      createElement(
        "div",
        { className: "play-toolbar inner" },
        createElement("label", null, createElement("input", { type: "checkbox", checked: gfm, onChange: (e) => setGfm(e.target.checked) }), " remark-gfm"),
        createElement("label", null, createElement("input", { type: "checkbox", checked: math, onChange: (e) => setMath(e.target.checked) }), " remark-math + rehype-katex"),
        createElement("label", null, createElement("input", { type: "checkbox", checked: breaks, onChange: (e) => setBreaks(e.target.checked) }), " remark-breaks"),
      ),
      createElement("div", { className: "md-preview", id: "preview" }, createElement(Markdown, { remarkPlugins, rehypePlugins }, source)),
    ),
  )
}

const root = document.querySelector("#playground-root")
if (root) createRoot(root).render(createElement(App))
