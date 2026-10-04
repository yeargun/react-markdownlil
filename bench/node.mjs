// Runs every lane in fresh, interleaved Node processes and writes results/node-<major>.json.
//   node bench/node.mjs [--rounds 5] [--cold 15] [--budget 1000]
import {execFileSync} from 'node:child_process'
import {mkdirSync, writeFileSync} from 'node:fs'
import os from 'node:os'
import {lanes, docs} from './lanes.mjs'

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i < 0 ? fallback : Number(process.argv[i + 1]) }
const rounds = arg('rounds', 5), coldRounds = arg('cold', 15), budget = arg('budget', 1000)
const here = new URL('.', import.meta.url).pathname
const run = (lane, mode, extra = []) => JSON.parse(execFileSync(process.execPath, [`${here}child.mjs`, lane, mode, ...extra], {maxBuffer: 1 << 26}))
const names = Object.keys(lanes)
const median = a => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }
const rotate = (a, r) => a.map((_, i) => a[(i + r) % a.length])

// 1. Same input, same HTML, or the timing means nothing.
const html = Object.fromEntries(names.map(n => [n, run(n, 'html')]))
for (const d of Object.keys(docs)) for (const n of names) {
  if (html[n][d] !== html[names[0]][d]) throw new Error(`${n} renders ${d} differently from ${names[0]}`)
}
console.log('identical HTML across lanes for', Object.keys(docs).join(', '))

// 2. Steady-state render time, one process per lane per round, lane order rotated.
const steady = Object.fromEntries(names.map(n => [n, Object.fromEntries(Object.keys(docs).map(d => [d, []]))]))
for (let r = 0; r < rounds; r++) {
  for (const n of rotate(names, r)) {
    const res = run(n, 'throughput', [String(budget)])
    for (const [d, ms] of Object.entries(res)) steady[n][d].push(ms)
  }
  console.log(`round ${r + 1}/${rounds}`)
}

// 3. Cold start: module evaluation and first render in a fresh process.
const cold = Object.fromEntries(names.map(n => [n, {importMs: [], firstRenderMs: []}]))
for (let r = 0; r < coldRounds; r++) for (const n of rotate(names, r)) {
  const res = run(n, 'cold')
  cold[n].importMs.push(res.importMs); cold[n].firstRenderMs.push(res.firstRenderMs)
}

const summary = a => ({median: median(a), min: Math.min(...a), max: Math.max(...a), runs: a.length})
const result = {
  schemaVersion: 1,
  runtime: `Node ${process.version}`,
  measuredAt: new Date().toISOString(),
  machine: {cpu: os.cpus()[0].model, logicalCpus: os.cpus().length},
  method: `Each lane runs in its own fresh Node process; lanes are interleaved and the order rotates every round (${rounds} rounds, ${budget} ms of samples per document). A sample is a batch of renderToString calls sized to about 25 ms; a round reports the median sample. Cold start is ${coldRounds} fresh processes per lane: importing the package alone (React is already loaded) and rendering the chat document once. Every lane must produce byte-identical HTML for every document before anything is timed.`,
  lanes: Object.fromEntries(names.map(n => [n, {side: lanes[n].side, pair: lanes[n].pair, label: lanes[n].label}])),
  docs: Object.fromEntries(Object.entries(docs).map(([d, p]) => [d, {plugins: p}])),
  steady: Object.fromEntries(names.map(n => [n, Object.fromEntries(Object.entries(steady[n]).map(([d, a]) => [d, summary(a)]))])),
  cold: Object.fromEntries(names.map(n => [n, {importMs: summary(cold[n].importMs), firstRenderMs: summary(cold[n].firstRenderMs)}])),
}
mkdirSync(`${here}results`, {recursive: true})
writeFileSync(`${here}results/node-${process.versions.node.split(".")[0]}.json`, JSON.stringify(result, null, 2) + '\n')

const base = names.find(n => lanes[n].side === 'original')
for (const d of Object.keys(docs)) {
  console.log(`\n${d}`)
  for (const n of names) { const m = result.steady[n][d].median; console.log(`  ${n.padEnd(16)} ${m.toFixed(3).padStart(9)} ms  ${(m / result.steady[base][d].median).toFixed(3)}x`) }
}
console.log('\ncold start (import / first render)')
for (const n of names) console.log(`  ${n.padEnd(16)} ${result.cold[n].importMs.median.toFixed(1).padStart(7)} ms / ${result.cold[n].firstRenderMs.median.toFixed(1)} ms`)
