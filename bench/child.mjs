// One lane in one fresh process. Modes: `throughput` (steady-state ms per render
// for each document) and `cold` (module evaluation + first render).
import {readFileSync} from 'node:fs'
import {createElement as h} from 'react'
import {renderToString} from 'react-dom/server'
import {lanes, docs, loadLane, propsFor} from './lanes.mjs'

const [lane, mode, budgetArg] = process.argv.slice(2)
const corpus = Object.fromEntries(Object.keys(docs).map(d => [d, readFileSync(new URL(`corpus/${d}.md`, import.meta.url), 'utf8')]))

if (mode === 'cold') {
  // The package alone (no plugins): what every app pays before its first render.
  const t0 = performance.now()
  const Markdown = (await import(lanes[lane].module)).default
  const t1 = performance.now()
  renderToString(h(Markdown, null, corpus.chat))
  const t2 = performance.now()
  process.stdout.write(JSON.stringify({importMs: t1 - t0, firstRenderMs: t2 - t1}))
} else if (mode === 'html') {
  const {Markdown, plugins} = await loadLane(lane)
  const out = {}
  for (const d of Object.keys(docs)) out[d] = renderToString(h(Markdown, propsFor(d, plugins), corpus[d]))
  process.stdout.write(JSON.stringify(out))
} else {
  const budget = Number(budgetArg || 1000)
  const {Markdown, plugins} = await loadLane(lane)
  const out = {}
  for (const d of Object.keys(docs)) {
    const el = h(Markdown, propsFor(d, plugins), corpus[d])
    // Warm up, then size batches to ~25 ms so timer resolution never matters.
    let t0 = performance.now(), n = 0
    while (performance.now() - t0 < budget / 3) { renderToString(el); n++ }
    const batch = Math.max(1, Math.round(n * 25 / (performance.now() - t0)))
    const samples = []
    t0 = performance.now()
    while (performance.now() - t0 < budget) {
      const s = performance.now()
      for (let i = 0; i < batch; i++) renderToString(el)
      samples.push((performance.now() - s) / batch)
    }
    samples.sort((a, b) => a - b)
    out[d] = samples[samples.length >> 1]
  }
  process.stdout.write(JSON.stringify(out))
}
