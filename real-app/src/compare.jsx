// Both implementations and every plugin set in one page: Playwright renders a
// case with each and compares the DOM they produce.
import {flushSync} from 'react-dom'
import {createRoot} from 'react-dom/client'
import {createElement as h} from 'react'
import Up, {MarkdownHooks as UpHooks, defaultUrlTransform as upUrl} from 'react-markdown'
import Lil, {MarkdownHooks as LilHooks, defaultUrlTransform as lilUrl} from '@itslil/react-markdown'
import upGfm from 'remark-gfm'
import upMath from 'remark-math'
import upKatex from 'rehype-katex'
import lilGfm from '@itslil/remark-gfm'
import lilMath from '@itslil/remark-math'
import lilKatex from '@itslil/rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import remarkToc from 'remark-toc'

// set name -> [upstream props, port props]
const sets = {
  core: [{}, {}],
  gfm: [{remarkPlugins: [upGfm]}, {remarkPlugins: [lilGfm]}],
  // interop: the port with the npm plugins, and upstream with the port's plugin
  'gfm-npm-on-port': [{remarkPlugins: [upGfm]}, {remarkPlugins: [upGfm]}],
  'gfm-port-on-upstream': [{remarkPlugins: [upGfm]}, {remarkPlugins: [lilGfm]}, 'swap'],
  full: [{remarkPlugins: [upGfm, upMath], rehypePlugins: [upKatex]}, {remarkPlugins: [lilGfm, lilMath], rehypePlugins: [lilKatex]}],
  'full-npm-on-port': [{remarkPlugins: [upGfm, upMath], rehypePlugins: [upKatex]}, {remarkPlugins: [upGfm, upMath], rehypePlugins: [upKatex]}],
  raw: [{remarkPlugins: [upGfm], rehypePlugins: [rehypeRaw]}, {remarkPlugins: [upGfm], rehypePlugins: [rehypeRaw]}],
  docsite: [
    {remarkPlugins: [upGfm, [remarkToc, {heading: 'contents|toc'}]], rehypePlugins: [rehypeSlug, rehypeHighlight]},
    {remarkPlugins: [upGfm, [remarkToc, {heading: 'contents|toc'}]], rehypePlugins: [rehypeSlug, rehypeHighlight]},
  ],
  components: [
    {components: {a: (p) => h('a', {...p, 'data-x': 1, target: '_blank'}), code: ({node, ...p}) => h('code', {...p, 'data-line': node?.position?.start.line})}},
    {components: {a: (p) => h('a', {...p, 'data-x': 1, target: '_blank'}), code: ({node, ...p}) => h('code', {...p, 'data-line': node?.position?.start.line})}},
  ],
  filter: [
    {allowedElements: ['p', 'em', 'strong', 'a', 'code'], unwrapDisallowed: true, skipHtml: true, urlTransform: (u) => (u.startsWith('http') ? u : '#blocked')},
    {allowedElements: ['p', 'em', 'strong', 'a', 'code'], unwrapDisallowed: true, skipHtml: true, urlTransform: (u) => (u.startsWith('http') ? u : '#blocked')},
  ],
}

// React 19 reports render errors instead of throwing them from flushSync.
let lastError = null
const onUncaughtError = (error) => { lastError = error }
const a = createRoot(document.getElementById('a'), {onUncaughtError})
const b = createRoot(document.getElementById('b'), {onUncaughtError})
const ea = document.getElementById('a')
const eb = document.getElementById('b')

function renderInto(root, element, Impl, props, md) {
  try {
    lastError = null
    flushSync(() => root.render(h(Impl, {...props, children: md})))
    if (lastError) throw lastError
    return {html: element.innerHTML}
  } catch (error) {
    flushSync(() => root.render(null))
    return {error: String(error && error.message || error).slice(0, 300)}
  }
}

window.cmp = {
  sets: Object.keys(sets),
  run(cases, setName) {
    const [upProps, lilProps, mode] = sets[setName]
    const mismatches = []
    let errors = 0
    for (const c of cases) {
      const x = renderInto(a, ea, Up, upProps, c.md)
      const y = mode === 'swap'
        ? renderInto(b, eb, Up, lilProps, c.md)
        : renderInto(b, eb, Lil, lilProps, c.md)
      if (x.error || y.error) errors++
      const same = x.error ? y.error !== undefined : x.html === y.html
      if (!same) mismatches.push({id: c.id, md: c.md, up: x.html ?? 'ERROR ' + x.error, lil: y.html ?? 'ERROR ' + y.error})
    }
    return {total: cases.length, mismatches: mismatches.length, errors, examples: mismatches.slice(0, 12)}
  },
  urls: [upUrl('javascript:x'), lilUrl('javascript:x'), upUrl('https://a.b/c?d#e'), lilUrl('https://a.b/c?d#e')],
  // MarkdownHooks: async plugin resolved in an effect, in both.
  async hooks() {
    const slow = () => async (tree) => {
      await new Promise((r) => setTimeout(r, 20))
      tree.children.push({type: 'element', tagName: 'hr', properties: {}, children: []})
    }
    const run = (Impl, root, el) => new Promise((resolve) => {
      flushSync(() => root.render(h(Impl, {children: '# hi *there*', rehypePlugins: [slow], fallback: h('i', null, 'loading')})))
      const before = el.innerHTML
      setTimeout(() => resolve({before, after: el.innerHTML}), 200)
    })
    return {up: await run(UpHooks, a, ea), lil: await run(LilHooks, b, eb)}
  },
}
window.cmpReady = true
