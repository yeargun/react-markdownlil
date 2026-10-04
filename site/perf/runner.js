// Render-speed benchmark for the browser. Used by the page's "run on this device"
// button and, one lane per fresh page, by bench/browser.mjs under Playwright.
import {createElement, renderToString} from './vendor.mjs'

export const LANES = {
  'original-browser': {side: 'original', pair: 'browser', module: './original-browser.mjs', plugins: './plugins-original.mjs'},
  'lil-browser': {side: 'lilscript', pair: 'browser', module: './lil-browser.mjs', plugins: './plugins-lil.mjs'},
  'original-portable': {side: 'original', pair: 'portable', module: './original-portable.mjs', plugins: './plugins-original.mjs'},
  'lil-portable': {side: 'lilscript', pair: 'portable', module: './lil-portable.mjs', plugins: './plugins-lil.mjs'},
}

// Plugins each corpus document renders with (gfm = remark-gfm, math = remark-math,
// katex = rehype-katex). Originals use the npm plugins, LilScript the @itslil ones.
export const DOCS = {chat: [], readme: [], large: [], gfm: ['gfm'], math: ['gfm', 'math', 'katex']}

const here = new URL('.', import.meta.url)
const corpusCache = {}
export async function corpus(doc) {
  return (corpusCache[doc] ??= fetch(new URL(`corpus/${doc}.md`, here)).then(r => {
    if (!r.ok) throw new Error(`corpus ${doc}: ${r.status}`)
    return r.text()
  }))
}

export async function load(lane, bust = '') {
  const spec = LANES[lane]
  const [core, plugins] = await Promise.all([
    import(new URL(spec.module + bust, here).href),
    import(new URL(spec.plugins, here).href),
  ])
  return {Markdown: core.default, plugins}
}

function element(Markdown, plugins, doc, source) {
  const use = DOCS[doc]
  return createElement(Markdown, {
    remarkPlugins: use.filter(k => k !== 'katex').map(k => plugins[k]),
    rehypePlugins: use.includes('katex') ? [plugins.katex] : [],
  }, source)
}

export async function html(lane) {
  const {Markdown, plugins} = await load(lane)
  const out = {}
  for (const doc of Object.keys(DOCS)) out[doc] = renderToString(element(Markdown, plugins, doc, await corpus(doc)))
  return out
}

const pause = () => new Promise(resolve => setTimeout(resolve, 0))
const median = a => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }

// Steady-state ms per render for one document: warm up, size batches to ~25 ms,
// report the median batch. Yields between batches so the page stays responsive.
async function steadyDoc(el, budget) {
  let t0 = performance.now(), n = 0
  while (performance.now() - t0 < budget / 3) { renderToString(el); n++; if (n % 4 === 0) await pause() }
  const batch = Math.max(1, Math.round(n * 25 / (performance.now() - t0)))
  const samples = []
  t0 = performance.now()
  while (performance.now() - t0 < budget || samples.length < 3) {
    const s = performance.now()
    for (let i = 0; i < batch; i++) renderToString(el)
    samples.push((performance.now() - s) / batch)
    await pause()
  }
  return median(samples)
}

export async function steady(lane, {budget = 1000, docs = Object.keys(DOCS)} = {}) {
  const {Markdown, plugins} = await load(lane)
  const out = {}
  for (const doc of docs) out[doc] = await steadyDoc(element(Markdown, plugins, doc, await corpus(doc)), budget)
  return out
}

// Package load (fetch excluded: the source is fetched first) plus the first render
// of the chat document, without plugins. `bust` defeats the module map on reruns.
export async function cold(lane, bust = `?cold=${Math.random()}`) {
  const url = new URL(LANES[lane].module + bust, here).href
  await fetch(url).then(r => r.text())
  const source = await corpus('chat')
  const t0 = performance.now()
  const Markdown = (await import(url)).default
  const t1 = performance.now()
  renderToString(createElement(Markdown, null, source))
  const t2 = performance.now()
  return {importMs: t1 - t0, firstRenderMs: t2 - t1}
}

// Everything in one page, lanes interleaved: the visitor's "run on this device".
export async function runHere({lanes = ['original-browser', 'lil-browser'], rounds = 3, budget = 400, onProgress = () => {}} = {}) {
  const reference = await html(lanes[0])
  for (const lane of lanes.slice(1)) {
    const out = await html(lane)
    for (const doc of Object.keys(DOCS)) if (out[doc] !== reference[doc]) throw new Error(`${lane} renders ${doc} differently`)
  }
  const docs = Object.keys(DOCS)
  const results = Object.fromEntries(lanes.map(l => [l, Object.fromEntries(docs.map(d => [d, []]))]))
  const loaded = Object.fromEntries(await Promise.all(lanes.map(async l => [l, await load(l)])))
  const total = rounds * docs.length * lanes.length
  let done = 0
  for (let r = 0; r < rounds; r++) {
    for (const doc of docs) {
      const source = await corpus(doc)
      const order = r % 2 ? [...lanes].reverse() : lanes
      for (const lane of order) {
        const {Markdown, plugins} = loaded[lane]
        results[lane][doc].push(await steadyDoc(element(Markdown, plugins, doc, source), budget))
        onProgress(++done / total, {lane, doc})
      }
    }
  }
  return Object.fromEntries(lanes.map(l => [l, Object.fromEntries(docs.map(d => [d, median(results[l][d])]))]))
}
