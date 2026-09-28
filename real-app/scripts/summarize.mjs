// Turns real-app/results/*.json into ../site/real-app.json (the Pages section) and the README
// section between <!-- real-app:start --> and <!-- real-app:end -->. Both come from this one
// summary, so the page and the README cannot disagree. Run after build, correctness, fuzz, edge,
// perf (npm run report).
import fs from 'node:fs'
import path from 'node:path'

const here = path.resolve(import.meta.dirname, '..')
const repo = path.resolve(here, '..')
const read = (file) => JSON.parse(fs.readFileSync(path.join(here, file), 'utf8'))
const exists = (file) => fs.existsSync(path.join(here, file))
const median = (xs) => { const s = xs.filter(Number.isFinite).sort((a, b) => a - b); const m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : NaN }
const int = new Intl.NumberFormat('en-US')
const ms = (x, digits) => `${x.toFixed(digits ?? (x < 10 ? 2 : x < 100 ? 1 : 0))} ms`
const pct = (ratio) => `${ratio < 1 ? '−' : '+'}${Math.abs((ratio - 1) * 100).toFixed(1)}%`
const signed = (x, unit = '') => `${x < 0 ? '−' : '+'}${int.format(Math.abs(Math.round(x)))}${unit}`
const state = (ratio, band = 0.02) => (ratio < 1 - band ? 'win' : ratio > 1 + band ? 'loss' : 'even')
const verdict = (ratio, text, band) => ({text: text ?? pct(ratio), state: state(ratio, band)})

const sizes = read('dist/sizes.json')
const chromium = read('results/perf-chromium.json')
const firefox = exists('results/perf-firefox.json') ? read('results/perf-firefox.json') : null
const stages = read('results/stages-chromium.json')
const correctness = read('results/correctness.json')
const fuzz = read('results/fuzz-node.json')
const classify = read('results/classify.json')
const edge = read('results/edge-conditions.json')
const treeshake = read('results/treeshake.json')
const entitiesNode = read('results/entities-node.json')
const app = JSON.parse(fs.readFileSync(path.join(here, 'package.json'), 'utf8'))
const installed = (name) => JSON.parse(fs.readFileSync(path.join(here, 'node_modules', name, 'package.json'), 'utf8')).version

const pairs = [
  {key: 'core', up: 'up', lil: 'lil', label: 'react-markdown alone'},
  {key: 'gfm', up: 'up-gfm', lil: 'lil-upgfm', label: '+ remark-gfm (npm), drop-in'},
  {key: 'gfm-lil', up: 'up-gfm', lil: 'lil-gfm', label: `+ @itslil/remark-gfm ${installed('@itslil/remark-gfm')}`},
  {key: 'full', up: 'up-full', lil: 'lil-upfull', label: '+ gfm, math, KaTeX (npm), drop-in'},
  {key: 'full-lil', up: 'up-full', lil: 'lil-full', label: '+ @itslil gfm, math, KaTeX (npm builds)'},
]
const docLabel = {small: 'short reply (307 B)', chat: 'chat answer (3.3 KB)', gfmreadme: "remark-gfm's README (15 KB)",
  readme: "react-markdown's README (26 KB)", unified: "unified's README (49 KB)", spec: 'CommonMark spec (205 KB)',
  math: 'math notes (2 KB, 20 formulas)', 'conversation(40)': 'chat history, 40 messages'}

// ---- paired helpers: variants measured in the same round ------------------------------------
function paired(rows, a, b, key, match = (x, y) => x.run === y.run) {
  const A = rows.filter((r) => r.variant === a), B = rows.filter((r) => r.variant === b)
  const ratios = [], diffs = []
  for (const x of A) {
    const y = B.find((r) => match(x, r))
    if (y && Number.isFinite(x[key]) && Number.isFinite(y[key])) { ratios.push(y[key] / x[key]); diffs.push(y[key] - x[key]) }
  }
  const up = median(A.map((r) => r[key])), lil = median(B.map((r) => r[key]))
  // Shown: the medians, their ratio and difference (so a row reads consistently), and in how many
  // rounds the port was faster.
  return {up, lil, ratio: lil / up, diff: lil - up, wins: diffs.filter((d) => d < 0).length, n: diffs.length}
}

// ---- sizes ---------------------------------------------------------------------------------------
const none = sizes.none
const sizeRow = (label, v, ref) => {
  const s = sizes[v]
  const adds = s.brotli - none.brotli
  if (!ref) return [label, int.format(s.raw), int.format(s.gzip), int.format(s.brotli), v === 'none' ? '—' : int.format(adds), '—']
  const refAdds = sizes[ref].brotli - none.brotli
  return [label, int.format(s.raw), int.format(s.gzip), int.format(s.brotli), int.format(adds),
    verdict(adds / refAdds, `${signed(s.brotli - sizes[ref].brotli, ' B')} (${pct(adds / refAdds)} of what markdown adds)`, 0.005)]
}
const sizeTable = {
  id: 'size', title: 'What the app ships',
  lead: `All JavaScript of the app, React ${installed('react')} included: Vite ${installed('vite')} production build (Rolldown + Oxc minifier), one chunk, Brotli-11. "Markdown adds" is the difference to the same app without a markdown library.`,
  columns: ['Stack', 'raw', 'gzip-9', 'Brotli-11', 'markdown adds', 'vs react-markdown'],
  rows: [
    sizeRow('App without markdown (baseline)', 'none'),
    sizeRow('react-markdown 10.1.0', 'up'),
    sizeRow('@itslil/react-markdown', 'lil', 'up'),
    sizeRow(`react-markdown + remark-gfm ${installed('remark-gfm')}`, 'up-gfm'),
    sizeRow('@itslil/react-markdown + remark-gfm (npm)', 'lil-upgfm', 'up-gfm'),
    sizeRow(`@itslil/react-markdown + @itslil/remark-gfm ${installed('@itslil/remark-gfm')}`, 'lil-gfm', 'up-gfm'),
    sizeRow('react-markdown + remark-gfm, remark-math, rehype-katex', 'up-full'),
    sizeRow('@itslil/react-markdown + the same npm plugins', 'lil-upfull', 'up-full'),
    sizeRow(`@itslil/react-markdown + @itslil/remark-gfm, remark-math, rehype-katex (${installed('@itslil/remark-gfm')}, ${installed('@itslil/remark-math')}, ${installed('@itslil/rehype-katex')})`, 'lil-full', 'up-full'),
  ],
}

// ---- page load --------------------------------------------------------------------------------------
const load = (condition) => chromium.load.filter((r) => r.condition === condition)
const loadRuns = median(['up', 'lil'].map((v) => load('desktop').filter((r) => r.variant === v).length))
const loadTable = {
  id: 'load', title: 'Time to markdown on screen (Chromium)',
  lead: `A fresh browser context per load; the app fetches react-markdown's README and renders it on start. Median of ${loadRuns} loads per variant, variants interleaved round by round; "faster in" counts the rounds the port won. Mobile is Lighthouse's preset: 4× CPU slowdown, 150 ms RTT, 1.6 Mbit/s. Differences under about 3% (desktop) and 2% (mobile) are within the run-to-run noise of this host.`,
  columns: ['Stack', 'desktop, upstream', 'desktop, @itslil', 'Δ', 'mobile, upstream', 'mobile, @itslil', 'Δ'],
  rows: [
    ['App without markdown', ms(median(load('desktop').filter((r) => r.variant === 'none').map((r) => r.committed)), 1), '—', '—',
      ms(median(load('mobile-slow4g').filter((r) => r.variant === 'none').map((r) => r.committed)), 0), '—', '—'],
    ...pairs.map((p) => {
      const d = paired(load('desktop'), p.up, p.lil, 'committed')
      const m = paired(load('mobile-slow4g'), p.up, p.lil, 'committed')
      return [p.label, ms(d.up, 1), ms(d.lil, 1), verdict(d.ratio, `${signed(d.diff, ' ms')} (faster in ${d.wins}/${d.n})`, 0.03),
        ms(m.up, 0), ms(m.lil, 0), verdict(m.ratio, `${signed(m.diff, ' ms')} (faster in ${m.wins}/${m.n})`, 0.02)]
    }),
  ],
}

// ---- render ---------------------------------------------------------------------------------------------
const renderRows = (browser, cpu) => browser.render.filter((r) => r.cpu === cpu)
const renderPages = median(['up', 'lil'].map((v) => new Set(chromium.render.filter((r) => r.variant === v && r.cpu === 1).map((r) => r.run)).size))
function renderTable(id, title, lead, browser, cpu, pair, docs, withMount) {
  const R = renderRows(browser, cpu)
  const rows = []
  for (const doc of docs) {
    const X = R.filter((r) => r.doc === doc)
    const mt = paired(X, pair.up, pair.lil, 'mountMedian')
    if (doc.startsWith('conversation')) {
      if (withMount) rows.push([docLabel[doc], '—', '—', '—', ms(mt.up), ms(mt.lil), verdict(mt.ratio)])
      continue
    }
    const pl = paired(X, pair.up, pair.lil, 'processMedian')
    if (!Number.isFinite(pl.up)) continue
    rows.push(withMount
      ? [docLabel[doc], ms(pl.up), ms(pl.lil), verdict(pl.ratio), ms(mt.up), ms(mt.lil), verdict(mt.ratio)]
      : [docLabel[doc], ms(pl.up), ms(pl.lil), verdict(pl.ratio)])
  }
  return {id, title, lead, columns: withMount ? ['Document', 'pipeline, upstream', 'pipeline, @itslil', 'Δ', 'mount, upstream', 'mount, @itslil', 'Δ'] : ['Document', 'upstream', '@itslil', 'Δ'], rows}
}
const coreDocs = ['small', 'chat', 'gfmreadme', 'readme', 'unified', 'spec', 'conversation(40)']
const renderLead = `Warm medians on ${renderPages} fresh pages per variant, variants interleaved round by round. Pipeline is the component body (parse, plugins, hast, React elements); mount adds React's render and the DOM commit.`
const renderCore = renderTable('render', 'Rendering, react-markdown alone (Chromium)', renderLead, chromium, 1, pairs[0], coreDocs, true)
const renderCore4 = renderTable('render-4x', 'Rendering at 4× CPU slowdown (Chromium)', 'The same, with the CPU slowed four times (a mid-range phone).', chromium, 4, pairs[0], coreDocs, true)
const renderPlugins = {
  id: 'render-plugins', title: 'Rendering with plugins (Chromium)',
  lead: 'Pipeline only, warm medians. The npm plugins on both sides, then the @itslil plugin builds on npm.',
  columns: ['Stack', 'document', 'upstream', '@itslil', 'Δ'],
  rows: pairs.slice(1).flatMap((p) => {
    const R = renderRows(chromium, 1)
    return ['chat', 'readme', ...(p.key.startsWith('full') ? ['math'] : ['spec'])].map((doc) => {
      const pl = paired(R.filter((r) => r.doc === doc), p.up, p.lil, 'processMedian')
      return [p.label, docLabel[doc], ms(pl.up), ms(pl.lil), verdict(pl.ratio)]
    })
  }),
}

// ---- streaming -------------------------------------------------------------------------------------------
function streamRow(browser, cpu, stream, pair, label) {
  const S = browser.stream.filter((r) => r.cpu === cpu && r.stream === stream)
  const t = paired(S, pair.up, pair.lil, 'total')
  const p95 = paired(S, pair.up, pair.lil, 'p95')
  const updates = S.find((r) => r.variant === pair.up)?.updates
  return [label ?? pair.label, `${stream === 'chat' ? 'chat answer, 3.3 KB' : 'long answer, 10 KB'} · ${updates} updates${cpu > 1 ? ` · ${cpu}× CPU` : ''}`,
    ms(t.up, 0), ms(t.lil, 0), verdict(t.ratio), `${p95.up.toFixed(2)} / ${p95.lil.toFixed(2)} ms`]
}
const streamTable = {
  id: 'stream', title: 'Streaming an answer, as a chat UI does (Chromium)',
  lead: 'The growing message is re-rendered after every 12 characters (flushSync, so each update is measured whole). Total main-thread time for the whole answer; p95 is per update.',
  columns: ['Stack', 'stream', 'upstream, total', '@itslil, total', 'Δ', 'p95 per update (upstream / @itslil)'],
  rows: [
    streamRow(chromium, 1, 'chat', pairs[0]),
    streamRow(chromium, 1, 'long', pairs[0]),
    streamRow(chromium, 4, 'chat', pairs[0]),
    streamRow(chromium, 1, 'long', pairs[1]),
    streamRow(chromium, 1, 'long', pairs[2]),
    streamRow(chromium, 1, 'long', pairs[3]),
  ],
}

// ---- stages ------------------------------------------------------------------------------------------------
const stageRow = (v, label, doc) => {
  const R = stages.filter((r) => r.variant === v)
  const m = (k) => median(R.map((r) => r[doc][k]))
  return [label, docLabel[doc], ms(m('parse')), ms(m('hast')), ms(m('jsx')),
    doc === 'readme' ? `${(median(R.map((r) => r.allocPerReadme)) / 1048576).toFixed(1)} MB` : '']
}
const stageTable = {
  id: 'stages', title: 'Where the time goes (Chromium)',
  lead: 'Timing plugins at both ends of the unified pipeline split one render: parse (micromark + mdast-util-from-markdown), mdast → hast (remark-rehype, mdast-util-to-hast and any plugins), and hast → React elements (hast-util-to-jsx-runtime). Allocation is sampled by V8, collected objects included.',
  columns: ['Stack', 'document', 'parse', 'mdast → hast', 'hast → React', 'allocated per render'],
  rows: [
    stageRow('up', 'react-markdown', 'readme'), stageRow('lil', '@itslil/react-markdown', 'readme'),
    stageRow('up', 'react-markdown', 'spec'), stageRow('lil', '@itslil/react-markdown', 'spec'),
    stageRow('up-gfm', 'react-markdown + remark-gfm', 'readme'), stageRow('lil-upgfm', '@itslil/react-markdown + remark-gfm', 'readme'),
  ],
}

// ---- firefox -------------------------------------------------------------------------------------------------
let firefoxTable = null
if (firefox) {
  const d = paired(firefox.load.filter((r) => r.condition === 'desktop'), 'up', 'lil', 'committed')
  const R = renderRows(firefox, 1)
  const pl = (doc, p = pairs[0]) => paired(R.filter((r) => r.doc === doc), p.up, p.lil, 'processMedian')
  const st = paired(firefox.stream.filter((r) => r.stream === 'long'), 'up', 'lil', 'total')
  const stg = paired(firefox.stream.filter((r) => r.stream === 'long'), 'up-gfm', 'lil-upgfm', 'total')
  firefoxTable = {
    id: 'firefox', title: `Firefox ${firefox.version}`,
    lead: 'The same app and harness in Firefox (no CPU throttling; Firefox has no DevTools protocol for it).',
    columns: ['Measure', 'upstream', '@itslil', 'Δ'],
    rows: [
      ['Markdown on screen, desktop load', ms(d.up, 1), ms(d.lil, 1), verdict(d.ratio, `${signed(d.diff, ' ms')} (faster in ${d.wins}/${d.n})`, 0.03)],
      ...['chat', 'readme', 'spec'].map((doc) => { const x = pl(doc); return [`Pipeline, ${docLabel[doc]}`, ms(x.up), ms(x.lil), verdict(x.ratio)] }),
      (() => { const x = pl('readme', pairs[1]); return ['Pipeline + remark-gfm, ' + docLabel.readme, ms(x.up), ms(x.lil), verdict(x.ratio)] })(),
      ['Streaming the 10 KB answer, total', ms(st.up, 0), ms(st.lil, 0), verdict(st.ratio)],
      ['Streaming with remark-gfm, total', ms(stg.up, 0), ms(stg.lil, 0), verdict(stg.ratio)],
    ],
  }
}

// ---- correctness ---------------------------------------------------------------------------------------------
const browsers = Object.keys(correctness)
const rowsFor = (suite, sets) => browsers.flatMap((b) => correctness[b].rows.filter((r) => r.suite === suite && sets.includes(r.set)))
const sum = (rows, k) => rows.reduce((s, r) => s + r[k], 0)
const portSets = ['core', 'gfm-npm-on-port', 'full-npm-on-port', 'raw', 'docsite', 'components', 'filter']
const correctnessRow = (label, suite, sets, casesText) => {
  const rows = rowsFor(suite, sets)
  if (!rows.length) return null
  const differing = sum(rows, 'mismatches')
  const setsUsed = [...new Set(rows.map((r) => r.set))]
  return [label, casesText, `${setsUsed.length} × ${browsers.length} browsers`, {text: differing === 0 ? '0 differ' : `${int.format(differing)} differ`, state: differing === 0 ? 'win' : 'loss'}]
}
const fzBrowser = rowsFor('fuzz', ['core'])
const coreFuzz = fuzz.summary.core
const nodeClass = classify['node fuzz (20,000)']
const browserClass = classify['browser fuzz (3,000)']
const lilGfmSpec = sum(rowsFor('gfm-spec', ['gfm']), 'mismatches')
const differed = (count) => ({text: count === 0 ? '0 differ' : `${int.format(count)} differ, listed below`, state: count === 0 ? 'win' : 'loss'})
const correctnessTable = {
  id: 'correctness', title: 'Same output',
  lead: `Each case is rendered by react-markdown and by @itslil/react-markdown in the same page (the production builds) and the DOM is compared. Plugin setups: none, npm remark-gfm, npm gfm + math + KaTeX, rehype-raw, a docs setup (remark-toc, rehype-slug, rehype-highlight), custom components, and allowedElements/urlTransform/skipHtml.`,
  columns: ['Suite', 'cases', 'setups', 'result'],
  rows: [
    correctnessRow('CommonMark 0.31.2 spec', 'commonmark', portSets, '652 examples'),
    correctnessRow('GFM spec + extensions (cmark-gfm 0.29.0.gfm.13)', 'gfm-spec', ['gfm-npm-on-port', 'full-npm-on-port', 'raw'], '702 examples'),
    correctnessRow('Named character references', 'entities', ['core'], '2,125 names in text, links, titles and code'),
    correctnessRow('Real documents (READMEs, CommonMark spec, chat, math)', 'documents', portSets, '7 documents'),
    ['Named references through the Node builds (SSR, then hydration)', '2,125 names', 'Node', {text: entitiesNode.mismatches === 0 ? '0 differ' : `${entitiesNode.mismatches} differ`, state: entitiesNode.mismatches === 0 ? 'win' : 'loss'}],
    ['Seeded fuzz, browser', `${int.format(fzBrowser[0]?.total ?? 3000)} documents`, `${browsers.length} browsers`, differed(browserClass.mismatch)],
    ['Seeded fuzz with Unicode spaces, Node', `${int.format(coreFuzz.docs)} documents`, 'Node', differed(nodeClass.mismatch)],
    ['MarkdownHooks with an async plugin', 'fallback, then the result', `${browsers.length} browsers`,
      {text: browsers.every((b) => JSON.stringify(correctness[b].hooks.up) === JSON.stringify(correctness[b].hooks.lil)) ? 'same' : 'differs', state: 'win'}],
    ['@itslil/remark-gfm ' + installed('@itslil/remark-gfm') + ' (npm), under either component', '702 examples', `${browsers.length} browsers`, differed(lilGfmSpec)],
  ].filter(Boolean),
}

// ---- runtimes -------------------------------------------------------------------------------------------------
const runtimeLabel = {'node (import)': 'Node (node, import)', 'cloudflare workers (wrangler)': 'Cloudflare Workers (workerd, worker, browser)',
  'next.js / vercel edge': 'Next.js and Vercel edge (edge-light, browser), with the edge process', deno: 'Deno (deno, node)', 'react-native (metro)': 'React Native (Metro)'}
const runtimeTable = {
  id: 'runtimes', title: 'Where it runs without a DOM',
  lead: "Each package bundled with the export conditions of the runtime, then run where there is no document; the edge row renders under a process whose cwd throws, as Next.js's edge sandbox has. Upstream resolves decode-named-character-reference's table and vfile's shims in worker and edge runtimes and node:path, node:process and node:url under node; the port resolves the build made of the same pair.",
  columns: ['Runtime (conditions)', 'react-markdown', '@itslil/react-markdown', 'file resolved'],
  rows: Object.keys(runtimeLabel).map((runtime) => {
    const up = edge.find((r) => r.runtime === runtime && r.who === 'upstream')
    const lil = edge.find((r) => r.runtime === runtime && r.who === 'port')
    const ok = (r) => ({text: r.result.startsWith('OK') ? 'renders' : r.result, state: r.result.startsWith('OK') ? 'win' : 'loss'})
    return [runtimeLabel[runtime], ok(up), ok(lil), lil.resolved.replace('@itslil/react-markdown/', '')]
  }),
}

// ---- cards and lists ---------------------------------------------------------------------------------------------
const coreSize = sizes.lil.brotli - sizes.up.brotli
const specRows = [...rowsFor('commonmark', portSets), ...rowsFor('gfm-spec', ['gfm-npm-on-port', 'full-npm-on-port', 'raw']), ...rowsFor('entities', ['core'])]
const specDiffs = sum(specRows, 'mismatches')
const specCases = 652 + 702
const readme = paired(renderRows(chromium, 1).filter((r) => r.doc === 'readme'), 'up', 'lil', 'processMedian')
const longStream = paired(chromium.stream.filter((r) => r.cpu === 1 && r.stream === 'long'), 'up', 'lil', 'total')
const cards = [
  {value: `${coreSize < 0 ? '−' : '+'}${(Math.abs(coreSize) / 1000).toFixed(1)} KB`, label: 'JavaScript the app ships, Brotli-11 (react-markdown alone)', state: coreSize < 0 ? 'win' : 'loss'},
  {value: pct(readme.ratio), label: "render time, react-markdown's README, warm (Chromium)", state: state(readme.ratio)},
  {value: pct(longStream.ratio), label: 'main-thread time streaming a 10 KB answer (Chromium)', state: state(longStream.ratio)},
  {value: String(specDiffs), label: `differences in ${int.format(specCases)} CommonMark and GFM spec examples and 2,125 named references, Chromium and Firefox`, state: 'ink'},
]
const fuzzDiffs = nodeClass.mismatch + browserClass.mismatch
const fuzzDocs = coreFuzz.docs + (fzBrowser[0]?.total ?? 3000)
const runtimeDiffs = Object.keys(runtimeLabel).filter((runtime) => {
  const up = edge.find((r) => r.runtime === runtime && r.who === 'upstream')
  const lil = edge.find((r) => r.runtime === runtime && r.who === 'port')
  return up.result !== lil.result
})
const behaviorDiffs = specDiffs + fuzzDiffs + entitiesNode.mismatches + lilGfmSpec + runtimeDiffs.length
const lists = [
  {
    title: 'Known differences',
    lead: behaviorDiffs === 0
      ? `None in behavior: every case above renders the same (${int.format(specCases)} spec examples, ${int.format(fuzzDocs)} fuzz documents, 2,125 named references twice, ${Object.keys(runtimeLabel).length} runtimes). What differs is below.`
      : `${int.format(behaviorDiffs)} of the cases above differ; each is listed below.`,
    items: [
      ...(fuzzDiffs ? [{title: 'Fuzz documents that render differently.', text: `${int.format(fuzzDiffs)} of ${int.format(fuzzDocs)} (results/classify.json).`}] : []),
      ...(runtimeDiffs.length ? [{title: 'Runtimes where the two packages differ.', text: runtimeDiffs.map((runtime) => runtimeLabel[runtime]).join(', ') + ' (results/edge-conditions.json).'}] : []),
      ...(lilGfmSpec ? [{title: `@itslil/remark-gfm ${installed('@itslil/remark-gfm')}.`, text: `${lilGfmSpec / browsers.length} GFM spec example renders differently from npm remark-gfm under either component.`}] : []),
      {title: 'Size, not behavior: one module, not tree-shakeable.', text: `An app that imports only defaultUrlTransform ships ${int.format(treeshake['lil-url'].brotli)} B Brotli with the port and ${int.format(treeshake['up-url'].brotli)} B with upstream.`},
      {title: 'Size, not behavior: KaTeX stacks ship a little more.', text: `With npm rehype-katex the app is ${signed(sizes['lil-upfull'].brotli - sizes['up-full'].brotli, ' B')} Brotli: rehype-katex's hastscript brings property-information, which the port also carries compiled in.`},
      {title: 'Not measured: Safari/WebKit.', text: 'Playwright\'s WebKit needs system libraries the measuring host does not have.'},
    ],
  },
]

const measuredAt = chromium.started.slice(0, 10)
const method = `Measured ${measuredAt} on an Azure Standard_B8als_v2 (8 vCPU, burstable) with Playwright ${installed('playwright')}: Chromium ${chromium.version}${firefox ? `, Firefox ${firefox.version}` : ''}; React ${installed('react')}, Vite ${installed('vite')}; react-markdown ${installed('react-markdown')} against @itslil/react-markdown packed from this repository, plugins from npm. Reproduce: cd real-app && npm run setup && npm run build && npm run correctness && npm run fuzz && npm run edge && npm run perf && npm run report.`

const summary = {
  measuredAt, chromium: `Chromium ${chromium.version}`, firefox: firefox ? `Firefox ${firefox.version}` : null,
  cards,
  tables: [sizeTable, loadTable, renderCore, renderCore4, renderPlugins, streamTable, stageTable, ...(firefoxTable ? [firefoxTable] : []), correctnessTable, runtimeTable],
  lists, method,
  render: coreDocs.filter((d) => !d.startsWith('conversation')).map((doc) => {
    const x = paired(renderRows(chromium, 1).filter((r) => r.doc === doc), 'up', 'lil', 'processMedian')
    return {pair: 'core', doc, up: x.up, lil: x.lil}
  }),
}
fs.writeFileSync(path.join(repo, 'site', 'real-app.json'), JSON.stringify(summary, null, 2) + '\n')

// ---- README section -------------------------------------------------------------------------------------------------
const mdCell = (v) => String(v && typeof v === 'object' ? v.text : v).replace(/\|/g, '\\|')
const mdTable = (t) => [`### ${t.title}`, '', t.lead, '', `| ${t.columns.join(' | ')} |`, `|${t.columns.map((_, i) => (i ? '---:' : '---')).join('|')}|`,
  ...t.rows.map((r) => `| ${r.map(mdCell).join(' | ')} |`), ''].join('\n')
const md = [
  '<!-- real-app:start -->',
  '<!-- Written by real-app/scripts/summarize.mjs from real-app/results; do not edit by hand. -->',
  '## In a real app',
  '',
  'The same React app, built with Vite once per markdown stack and driven by Playwright ([`real-app/`](real-app/)).',
  '',
  ...cards.map((c) => `- **${c.value}** ${c.label}`),
  '',
  ...summary.tables.map(mdTable),
  ...lists.flatMap((l) => [`### ${l.title}`, '', l.lead, '', ...l.items.map((i) => `- **${i.title}** ${i.text.replace(/</g, '&lt;')}`), '']),
  method,
  '<!-- real-app:end -->',
].join('\n')
const readmePath = path.join(repo, 'README.md')
const readmeText = fs.readFileSync(readmePath, 'utf8')
if (!/<!-- real-app:start -->[\s\S]*<!-- real-app:end -->/.test(readmeText)) throw new Error('README.md has no real-app markers')
fs.writeFileSync(readmePath, readmeText.replace(/<!-- real-app:start -->[\s\S]*<!-- real-app:end -->/, md))
console.log(`wrote site/real-app.json and the README section (${summary.tables.length} tables)`)
