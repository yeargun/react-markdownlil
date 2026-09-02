import type {Element, Parents} from "hast"
import rehypeKatex from "@itslil/rehype-katex"
import remarkBreaks from "@itslil/remark-breaks"
import remarkGfm from "@itslil/remark-gfm"
import remarkMath from "@itslil/remark-math"
import type {Deprecation, HooksOptionsOnly} from "../lib/index.js"
import Markdown, {
  MarkdownAsync,
  MarkdownHooks,
  defaultUrlTransform,
  type AllowElement,
  type Components,
  type ExtraProps,
  type HooksOptions,
  type Options,
  type UrlTransform,
} from "../index.js"

const allowElement: AllowElement = (element, index, parent) => {
  const checkedElement: Readonly<Element> = element
  const checkedIndex: number = index
  const checkedParent: Readonly<Parents> | undefined = parent
  return Boolean(checkedElement && checkedIndex >= 0 && checkedParent)
}

const transform: UrlTransform = (url, key, node) =>
  node.tagName === "a" && key === "href" ? url : undefined

const components: Components = {
  a(props) {
    const node: Element | undefined = props.node
    return node ? props.children : null
  },
  h1: "h2",
}

const options: Options = {
  allowElement,
  children: "# hi",
  components,
  rehypePlugins: [[rehypeKatex, {errorColor: "#c00"}]],
  remarkPlugins: [remarkGfm, remarkBreaks, [remarkMath, {singleDollarTextMath: false}]],
  urlTransform: transform,
}
const hooksOptions: HooksOptions = {...options, fallback: "Loading"}
const extra: ExtraProps = {}
const deprecation: Deprecation = {from: "source", id: "change-source", to: "children"}
const hooksOnly: HooksOptionsOnly = {fallback: "Loading"}

void Markdown(options)
void MarkdownAsync(options)
void MarkdownHooks(hooksOptions)
void defaultUrlTransform("https://example.com")
void extra
void deprecation
void hooksOnly

// @ts-expect-error: children only accepts markdown strings.
Markdown({children: 1})
// @ts-expect-error: component values must be valid React element types.
Markdown({components: {h1: 123}})
