// Runs site/perf/runner.js in real browsers and writes results/<browser>.json.
//   node bench/browser.mjs [chromium|firefox ...] [--rounds 5] [--cold 15] [--budget 1000]
// Each lane runs in a fresh browser context (no shared JIT, heap, module map or
// HTTP cache); lanes are interleaved and the order rotates every round.
import {createServer} from 'node:http'
import {readFile, mkdir, writeFile} from 'node:fs/promises'
import {extname, join, normalize} from 'node:path'
import os from 'node:os'
import * as playwright from 'playwright-core'

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i < 0 ? fallback : Number(process.argv[i + 1]) }
const rounds = arg('rounds', 5), coldRounds = arg('cold', 15), budget = arg('budget', 1000)
const flag = name => { const i = process.argv.indexOf(`--${name}`); return i < 0 ? undefined : process.argv[i + 1] }
const onlyLanes = flag('lanes')?.split(','), outSuffix = flag('out') ?? ''
const browsers = process.argv.slice(2).filter(a => /^[a-z]+$/.test(a) && playwright[a])
if (!browsers.length) browsers.push('chromium', 'firefox')

const site = new URL('../site/', import.meta.url).pathname
const types = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.md': 'text/markdown', '.json': 'application/json'}
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
  try {
    const body = await readFile(join(site, path))
    res.writeHead(200, {'content-type': types[extname(path)] ?? 'application/octet-stream', 'cache-control': 'no-store'})
    res.end(body)
  } catch { res.writeHead(404); res.end() }
}).listen(0)
const origin = `http://127.0.0.1:${server.address().port}`

const median = a => { const s = [...a].sort((x, y) => x - y); return s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2 }
const summary = a => ({median: median(a), min: Math.min(...a), max: Math.max(...a), runs: a.length})
const rotate = (a, r) => a.map((_, i) => a[(i + r) % a.length])

async function inFreshPage(browser, fn, arg) {
  const context = await browser.newContext()
  const page = await context.newPage()
  try {
    await page.goto(`${origin}/perf/bench.html`)
    await page.waitForFunction(() => window.perfReady)
    return await page.evaluate(fn, arg)
  } finally { await context.close() }
}

for (const name of browsers) {
  const browser = await playwright[name].launch()
  const meta = await inFreshPage(browser, () => ({lanes: window.perf.LANES, docs: window.perf.DOCS}))
  const lanes = Object.keys(meta.lanes).filter(l => !onlyLanes || onlyLanes.includes(l)), docs = Object.keys(meta.docs)

  // Same input, same HTML, or the timing means nothing.
  const reference = await inFreshPage(browser, lane => window.perf.html(lane), lanes[0])
  for (const lane of lanes.slice(1)) {
    const out = await inFreshPage(browser, lane => window.perf.html(lane), lane)
    for (const doc of docs) if (out[doc] !== reference[doc]) throw new Error(`${name}: ${lane} renders ${doc} differently from ${lanes[0]}`)
  }
  console.log(`${name}: identical HTML across ${lanes.length} lanes`)

  const steady = Object.fromEntries(lanes.map(l => [l, Object.fromEntries(docs.map(d => [d, []]))]))
  for (let r = 0; r < rounds; r++) {
    for (const lane of rotate(lanes, r)) {
      const res = await inFreshPage(browser, ([lane, budget]) => window.perf.steady(lane, {budget}), [lane, budget])
      for (const [d, ms] of Object.entries(res)) steady[lane][d].push(ms)
    }
    console.log(`${name}: round ${r + 1}/${rounds}`)
  }
  const cold = Object.fromEntries(lanes.map(l => [l, {importMs: [], firstRenderMs: []}]))
  for (let r = 0; r < coldRounds; r++) for (const lane of rotate(lanes, r)) {
    const res = await inFreshPage(browser, lane => window.perf.cold(lane), lane)
    cold[lane].importMs.push(res.importMs); cold[lane].firstRenderMs.push(res.firstRenderMs)
  }

  const result = {
    schemaVersion: 1,
    runtime: `${name[0].toUpperCase()}${name.slice(1)} ${browser.version()} (headless)`,
    measuredAt: new Date().toISOString(),
    machine: {cpu: os.cpus()[0].model, logicalCpus: os.cpus().length},
    method: `Each lane runs in its own fresh browser context; lanes are interleaved and the order rotates every round (${rounds} rounds, ${budget} ms of samples per document). A sample is a batch of renderToString calls sized to about 25 ms; a round reports the median sample. Cold start is ${coldRounds} fresh contexts per lane: evaluating the already-downloaded package and rendering the chat document once. Every lane must produce byte-identical HTML for every document before anything is timed.`,
    lanes: meta.lanes,
    docs: Object.fromEntries(Object.entries(meta.docs).map(([d, p]) => [d, {plugins: p}])),
    steady: Object.fromEntries(lanes.map(l => [l, Object.fromEntries(docs.map(d => [d, summary(steady[l][d])]))])),
    cold: Object.fromEntries(lanes.map(l => [l, {importMs: summary(cold[l].importMs), firstRenderMs: summary(cold[l].firstRenderMs)}])),
  }
  await browser.close()
  await mkdir(new URL(outSuffix ? ".tmp/" : "results/", import.meta.url), {recursive: true})
  await writeFile(new URL(outSuffix ? `.tmp/${name}${outSuffix}.json` : `results/${name}.json`, import.meta.url), JSON.stringify(result, null, 2) + '\n')

  for (const pair of ['browser', 'portable'].filter(p => lanes.includes(`lil-${p}`))) {
    const [o, l] = [`original-${pair}`, `lil-${pair}`]
    console.log(`\n${name} ${pair}`)
    for (const d of docs) {
      const a = result.steady[o][d].median, b = result.steady[l][d].median
      console.log(`  ${d.padEnd(8)} ${a.toFixed(3).padStart(9)} → ${b.toFixed(3).padStart(9)} ms  ${(b / a).toFixed(3)}x`)
    }
    console.log(`  load    ${result.cold[o].importMs.median.toFixed(1)} → ${result.cold[l].importMs.median.toFixed(1)} ms; first render ${result.cold[o].firstRenderMs.median.toFixed(1)} → ${result.cold[l].firstRenderMs.median.toFixed(1)} ms`)
  }
}
server.close()
