// Performance of the real app, per variant, driven by Playwright.
//
//   load    fresh browser context per run: navigation -> markdown committed,
//           script time and heap from the Chrome DevTools Protocol
//   render  in-page: first (cold) call, then warm medians of the component
//           body alone (`process`) and of a full React mount (`mount`)
//   stream  chat-style re-render of a growing message after every chunk
//
// Variants run round-robin inside each round so host drift (this is a
// burstable VM) spreads evenly over them. Results: results/perf-<tag>.json.
import fs from 'node:fs'
import {chromium, firefox} from 'playwright'
import {serve} from '../scripts/serve.mjs'

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || `=${d}`).split('=')[1]
const tag = arg('tag', 'run')
const browserName = arg('browser', 'chromium')
const phases = arg('phases', 'load,render,stream').split(',')
const loadRuns = Number(arg('load-runs', 12))
const renderRuns = Number(arg('render-runs', 5))
const throttles = arg('cpu', '1,4').split(',').map(Number)
const variantGroups = arg('groups', 'core,gfm,full').split(',')
const groups = {
  core: ['up', 'lil'],
  gfm: ['up-gfm', 'lil-upgfm', 'lil-gfm'],
  full: ['up-full', 'lil-upfull', 'lil-full'],
}
const loadVariants = ['none', ...variantGroups.flatMap((g) => groups[g])]
const docsFor = (v) => v.endsWith('full')
  ? ['small', 'chat', 'readme', 'math']
  : ['small', 'chat', 'gfmreadme', 'readme', 'unified', 'spec']
const iterations = {small: 200, chat: 80, gfmreadme: 30, readme: 20, unified: 12, spec: 4, math: 30}
const readmeText = fs.readFileSync(new URL('../public/corpus/readme.md', import.meta.url), 'utf8')
const chatText = fs.readFileSync(new URL('../public/corpus/chat.md', import.meta.url), 'utf8')
const streams = {chat: chatText, long: readmeText.slice(0, 10000)}

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }
const pct = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))] }
const round = (x) => Math.round(x * 1000) / 1000

const server = await serve(0)
const base = `http://localhost:${server.address().port}`
const type = {chromium, firefox}[browserName]
const browser = await type.launch()
const isChromium = browserName === 'chromium'
const results = {tag, browser: browserName, version: browser.version(), started: new Date().toISOString(), load: [], render: [], stream: []}
const save = () => fs.writeFileSync(new URL(`../results/perf-${tag}.json`, import.meta.url), JSON.stringify(results, null, 1))
console.log(`${browserName} ${browser.version()} phases=${phases} cpu=${throttles} groups=${variantGroups}`)

async function newPage(cpu, network) {
  const context = await browser.newContext()
  const page = await context.newPage()
  let cdp = null
  if (isChromium) {
    cdp = await context.newCDPSession(page)
    await cdp.send('Performance.enable')
    if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', {rate: cpu})
    if (network) {
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', network)
    }
  }
  return {context, page, cdp}
}

// ---- load ------------------------------------------------------------------
// Lighthouse's mobile preset: 4x CPU, 150 ms RTT, 1.6 Mbit/s down.
const slow4g = {offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8}
if (phases.includes('load')) {
  const conditions = [{name: 'desktop', cpu: 1, network: null}]
  if (isChromium) conditions.push({name: 'mobile-slow4g', cpu: 4, network: slow4g})
  for (const cond of conditions) {
    for (let run = 0; run < loadRuns; run++) {
      for (const variant of loadVariants) {
        const {context, page, cdp} = await newPage(cond.cpu, cond.network)
        await page.goto(`${base}/v/${variant}/?doc=readme`)
        await page.waitForFunction(() => window.__committed !== undefined, null, {timeout: 60000})
        const m = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0]
          const mark = (n) => performance.getEntriesByName(n)[0]?.startTime
          const scripts = performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'script' || r.name.endsWith('.js'))
          return {
            committed: window.__committed,
            appModuleStart: mark('app-module-start'),
            docFetched: mark('doc-fetched'),
            domContentLoaded: nav.domContentLoadedEventEnd,
            scriptTransfer: scripts.reduce((s, r) => s + r.transferSize, 0),
            scriptLoaded: Math.max(0, ...scripts.map((r) => r.responseEnd)),
          }
        })
        if (cdp) {
          const metrics = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]))
          m.scriptDuration = metrics.ScriptDuration * 1000
          m.taskDuration = metrics.TaskDuration * 1000
          await cdp.send('HeapProfiler.collectGarbage')
          m.heapUsed = (await cdp.send('Runtime.getHeapUsage')).usedSize
        }
        results.load.push({condition: cond.name, variant, run, ...m})
        await context.close()
      }
    }
    for (const variant of loadVariants) {
      const rows = results.load.filter((r) => r.condition === cond.name && r.variant === variant)
      const f = (k) => rows[0][k] === undefined ? '' : round(median(rows.map((r) => r[k])))
      console.log(`load ${cond.name.padEnd(13)} ${variant.padEnd(9)} committed ${f('committed')} ms  appStart ${f('appModuleStart')}  script ${f('scriptDuration')} ms  task ${f('taskDuration')} ms  heap ${f('heapUsed')}  transfer ${f('scriptTransfer')}`)
    }
    save()
  }
}

// ---- render ------------------------------------------------------------------
if (phases.includes('render') || phases.includes('stream')) {
  const renderVariants = variantGroups.flatMap((g) => groups[g])
  for (const cpu of throttles) {
    for (let run = 0; run < renderRuns; run++) {
      for (const variant of renderVariants) {
        const {context, page} = await newPage(cpu, null)
        await page.goto(`${base}/v/${variant}/?doc=small`)
        await page.waitForFunction(() => window.__committed !== undefined)
        const docs = docsFor(variant)
        await page.evaluate((d) => window.bench.load(d), docs)
        if (phases.includes('render')) {
          // cold: the very first call on a fresh page, per document
          const cold = await page.evaluate((d) => d.map((n) => window.bench.process(window.bench.doc(n), 1)[0]), docs)
          for (const [i, doc] of docs.entries()) {
            const k = Math.max(3, Math.round(iterations[doc] / (cpu > 1 ? 3 : 1)))
            const r = await page.evaluate(([n, k]) => {
              const text = window.bench.doc(n)
              window.bench.process(text, Math.min(k, 5))
              const process = window.bench.process(text, k)
              const mount = []
              for (let i = 0; i < Math.max(3, k >> 1); i++) mount.push(window.bench.mount(text))
              window.bench.clear()
              return {process, mount}
            }, [doc, k])
            results.render.push({cpu, variant, run, doc, cold: cold[i], processMedian: median(r.process), processP90: pct(r.process, 0.9), mountMedian: median(r.mount)})
          }
          const conv = JSON.parse(fs.readFileSync(new URL('../public/corpus/conversation.json', import.meta.url), 'utf8'))
          const convTimes = await page.evaluate((c) => [0, 1, 2, 3, 4].map(() => window.bench.conversation(c)), conv)
          results.render.push({cpu, variant, run, doc: 'conversation(40)', cold: convTimes[0], mountMedian: median(convTimes.slice(1))})
        }
        if (phases.includes('stream')) {
          for (const [name, text] of Object.entries(streams)) {
            if (cpu > 1 && name === 'long') continue
            const times = await page.evaluate(([t]) => window.bench.stream(t, 12), [text])
            results.stream.push({cpu, variant, run, stream: name, updates: times.length, total: times.reduce((a, b) => a + b, 0), median: median(times), p95: pct(times, 0.95), max: Math.max(...times), last: times[times.length - 1], over16: times.filter((t) => t > 16.7).length, over50: times.filter((t) => t > 50).length})
          }
          if (cpu === 1) {
            const rt = await page.evaluate(([t]) => window.bench.streamRealtime(t, 12, 30), [chatText])
            const frames = rt.frames.slice(1)
            results.stream.push({cpu, variant, run, stream: 'chat-realtime-30ms', wall: rt.wall, frames: frames.length, frameP95: pct(frames, 0.95), frameMax: Math.max(...frames), framesOver33: frames.filter((f) => f > 33.4).length})
          }
        }
        await context.close()
      }
      console.log(`cpu ${cpu}x round ${run + 1}/${renderRuns} done`)
      save()
    }
  }
}
results.finished = new Date().toISOString()
save()
await browser.close()
server.close()
