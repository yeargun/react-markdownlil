// Where the time goes, per implementation (Chromium, CDP):
//   stages   parse / mdast->hast / hast->React, via timing plugins at both
//            ends of the unified pipeline (warm medians)
//   gc       share of CPU-profile samples in the garbage collector while
//            rendering the README 40 times
//   alloc    bytes allocated per README render (sampling heap profiler,
//            collected objects included)
import fs from 'node:fs'
import {chromium} from 'playwright'
import {serve} from '../scripts/serve.mjs'

const rounds = Number(process.env.ROUNDS || 5)
const variants = (process.env.VARIANTS || 'up,lil,up-gfm,lil-upgfm,lil-gfm,up-full,lil-upfull,lil-full').split(',')
const docs = ['chat', 'readme', 'spec']
const iters = {chat: 60, readme: 20, spec: 4}
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }

const server = await serve(0)
const base = `http://localhost:${server.address().port}`
const browser = await chromium.launch()
const rows = []
for (let round = 0; round < rounds; round++) {
  for (const variant of variants) {
    const context = await browser.newContext()
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await page.goto(`${base}/v/${variant}/?doc=small`)
    await page.waitForFunction(() => window.__committed !== undefined)
    await page.evaluate((d) => window.bench.load(d), docs)
    const row = {round, variant}
    for (const doc of docs) {
      const r = await page.evaluate(([n, k]) => {
        const text = window.bench.doc(n)
        window.bench.stages(text, Math.min(5, k))
        return window.bench.stages(text, k)
      }, [doc, iters[doc]])
      row[doc] = {parse: median(r.map((x) => x[0])), hast: median(r.map((x) => x[1])), jsx: median(r.map((x) => x[2]))}
    }
    // GC share while rendering the README
    await cdp.send('Profiler.enable')
    await cdp.send('Profiler.setSamplingInterval', {interval: 100})
    await cdp.send('Profiler.start')
    await page.evaluate(() => window.bench.process(window.bench.doc('readme'), 40))
    const {profile} = await cdp.send('Profiler.stop')
    const hits = (name) => profile.nodes.filter((n) => n.callFrame.functionName === name).reduce((s, n) => s + (n.hitCount || 0), 0)
    const total = profile.nodes.reduce((s, n) => s + (n.hitCount || 0), 0)
    row.gcShare = hits('(garbage collector)') / (total - hits('(idle)'))
    // allocation per README render
    await cdp.send('HeapProfiler.enable')
    await cdp.send('HeapProfiler.collectGarbage')
    await cdp.send('HeapProfiler.startSampling', {samplingInterval: 4096, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true})
    await page.evaluate(() => window.bench.process(window.bench.doc('readme'), 10))
    const {profile: heap} = await cdp.send('HeapProfiler.stopSampling')
    const walk = (n) => n.selfSize + (n.children || []).reduce((s, c) => s + walk(c), 0)
    row.allocPerReadme = walk(heap.head) / 10
    rows.push(row)
    await context.close()
  }
  console.log(`round ${round + 1}/${rounds}`)
}
await browser.close()
server.close()
fs.writeFileSync('results/stages-chromium.json', JSON.stringify(rows, null, 1))

const fmt = (x, d = 2) => x.toFixed(d)
for (const v of variants) {
  const R = rows.filter((r) => r.variant === v)
  const cells = docs.map((d) => ['parse', 'hast', 'jsx'].map((k) => fmt(median(R.map((r) => r[d][k])))).join(' / '))
  console.log(`${v.padEnd(9)} ${docs.map((d, i) => `${d}: ${cells[i]}`).join('   ')}   GC ${fmt(median(R.map((r) => r.gcShare)) * 100, 1)}%   alloc/readme ${fmt(median(R.map((r) => r.allocPerReadme)) / 1048576, 2)} MB`)
}
process.exit(0)
