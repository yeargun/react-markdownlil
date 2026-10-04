// Merges bench/results/*.json into site/performance.json for the Pages speed section.
import {readdirSync, readFileSync, writeFileSync} from 'node:fs'
import {createHash} from 'node:crypto'

const dir = new URL('results/', import.meta.url)
const order = name => (name.startsWith('node') ? 0 : name.startsWith('chromium') ? 1 : 2) + name
const files = readdirSync(dir).filter(f => f.endsWith('.json')).sort((a, b) => order(a).localeCompare(order(b)))
const sha = path => createHash('sha256').update(readFileSync(new URL(path, import.meta.url))).digest('hex').slice(0, 16)

const runtimes = files.map(file => {
  const r = JSON.parse(readFileSync(new URL(file, dir), 'utf8'))
  const pairs = {}
  for (const [lane, meta] of Object.entries(r.lanes)) {
    if (meta.side !== 'lilscript') continue
    const original = Object.keys(r.lanes).find(o => r.lanes[o].side === 'original' && r.lanes[o].pair === meta.pair)
    pairs[meta.pair] = {
      original, lilscript: lane,
      docs: Object.fromEntries(Object.keys(r.docs).map(d => {
        const o = r.steady[original][d], l = r.steady[lane][d]
        return [d, {originalMs: o.median, lilscriptMs: l.median, ratio: l.median / o.median, originalRange: [o.min, o.max], lilscriptRange: [l.min, l.max]}]
      })),
      cold: Object.fromEntries(['importMs', 'firstRenderMs'].map(k => [k, {originalMs: r.cold[original][k].median, lilscriptMs: r.cold[lane][k].median, ratio: r.cold[lane][k].median / r.cold[original][k].median}])),
    }
  }
  const reference = Object.keys(r.lanes).find(l => r.lanes[l].pair === 'reference')
  return {id: file.replace(/\.json$/, ''), runtime: r.runtime, measuredAt: r.measuredAt, machine: r.machine, method: r.method, lanes: r.lanes, docs: r.docs, pairs,
    reference: reference && {lane: reference, steady: Object.fromEntries(Object.entries(r.steady[reference]).map(([d, s]) => [d, s.median])), cold: {importMs: r.cold[reference].importMs.median, firstRenderMs: r.cold[reference].firstRenderMs.median}}}
})

const ratios = runtimes.flatMap(rt => Object.values(rt.pairs).flatMap(p => Object.values(p.docs).map(d => d.ratio)))
const geomean = Math.exp(ratios.reduce((s, x) => s + Math.log(x), 0) / ratios.length)
const corpus = Object.fromEntries(['chat', 'readme', 'large', 'gfm', 'math'].map(d => [d, {bytes: readFileSync(new URL(`corpus/${d}.md`, import.meta.url)).length, sha256: sha(`corpus/${d}.md`)}]))
const artifacts = Object.fromEntries(['original-browser', 'lil-browser', 'original-portable', 'lil-portable'].map(n => [n, sha(`../site/perf/${n}.mjs`)]))
const out = {schemaVersion: 1, generatedAt: new Date().toISOString(), summary: {geomeanRatio: geomean, slowestRatio: Math.max(...ratios), fastestRatio: Math.min(...ratios), cells: ratios.length}, corpus, artifacts, runtimes}
writeFileSync(new URL('../site/performance.json', import.meta.url), JSON.stringify(out, null, 2) + '\n')
console.log(`site/performance.json: ${runtimes.map(r => r.runtime).join(', ')}; geomean ${geomean.toFixed(3)}x, worst ${Math.max(...ratios).toFixed(3)}x over ${ratios.length} cells`)
for (const rt of runtimes) for (const [pair, p] of Object.entries(rt.pairs)) {
  console.log(`  ${rt.runtime.padEnd(28)} ${pair.padEnd(9)} ${Object.entries(p.docs).map(([d, v]) => `${d} ${v.ratio.toFixed(3)}`).join('  ')}  | load ${p.cold.importMs.ratio.toFixed(3)} first ${p.cold.firstRenderMs.ratio.toFixed(3)}`)
}
