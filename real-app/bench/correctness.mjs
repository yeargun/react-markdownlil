// Differential correctness in real browsers: every case is rendered by
// react-markdown@10.1.0 and by @itslil/react-markdown (the Vite production
// build of both, each with its plugin set) and the DOM they produce is compared.
import fs from 'node:fs'
import {chromium, firefox} from 'playwright'
import {serve} from '../scripts/serve.mjs'

const browsers = (process.env.BROWSERS || 'chromium,firefox').split(',')
const read = (f) => JSON.parse(fs.readFileSync(new URL(`../public/${f}`, import.meta.url)))
const docs = Object.keys(read('corpus/index.json')).map((n) => ({
  id: `doc-${n}`, md: fs.readFileSync(new URL(`../public/corpus/${n}.md`, import.meta.url), 'utf8'),
}))
const suites = [
  ['commonmark', read('cases/commonmark.json'), ['core', 'gfm', 'gfm-npm-on-port', 'full', 'raw', 'components', 'filter']],
  ['gfm-spec', read('cases/gfm.json'), ['gfm', 'gfm-npm-on-port', 'gfm-port-on-upstream', 'full', 'full-npm-on-port', 'raw']],
  ['entities', read('cases/entities.json'), ['core', 'gfm']],
  ['fuzz', read('cases/fuzz.json'), ['core', 'gfm', 'gfm-npm-on-port', 'full', 'raw']],
  ['documents', docs, ['core', 'gfm', 'gfm-npm-on-port', 'gfm-port-on-upstream', 'full', 'full-npm-on-port', 'raw', 'docsite', 'components', 'filter']],
]

const server = await serve(0)
const base = `http://localhost:${server.address().port}`
const report = {}
for (const name of browsers) {
  const type = {chromium, firefox}[name]
  const browser = await type.launch()
  const page = await browser.newPage()
  const consoleErrors = []
  page.on('pageerror', (e) => consoleErrors.push(String(e.message).slice(0, 200)))
  await page.goto(`${base}/v/compare/compare.html`)
  await page.waitForFunction(() => window.cmpReady)
  const rows = []
  for (const [suite, cases, sets] of suites) {
    for (const set of sets) {
      const t = Date.now()
      const agg = {total: 0, mismatches: 0, errors: 0, examples: []}
      for (let i = 0; i < cases.length; i += 150) {
        const r = await page.evaluate(([c, s]) => window.cmp.run(c, s), [cases.slice(i, i + 150), set])
        agg.total += r.total; agg.mismatches += r.mismatches; agg.errors += r.errors
        agg.examples.push(...r.examples)
      }
      const clip = (text) => (typeof text === 'string' && text.length > 2000 ? text.slice(0, 2000) + '…' : text)
      agg.examples = agg.examples.slice(0, 20).map((e) => ({...e, md: clip(e.md), up: clip(e.up), lil: clip(e.lil)}))
      rows.push({suite, set, total: agg.total, mismatches: agg.mismatches, bothOrOneErrored: agg.errors, ms: Date.now() - t, examples: agg.examples})
      console.log(`${name.padEnd(8)} ${suite.padEnd(11)} ${set.padEnd(22)} ${String(agg.total).padStart(5)} cases  ${String(agg.mismatches).padStart(4)} mismatches  ${String(agg.errors).padStart(4)} with errors  (${Date.now() - t} ms)`)
    }
  }
  const hooks = await page.evaluate(() => window.cmp.hooks())
  const urls = await page.evaluate(() => window.cmp.urls)
  console.log(`${name} MarkdownHooks`, JSON.stringify(hooks), 'urls', JSON.stringify(urls))
  report[name] = {version: browser.version(), rows, hooks, urls, pageErrors: consoleErrors.slice(0, 20)}
  await browser.close()
}
server.close()
fs.writeFileSync(new URL('../results/correctness.json', import.meta.url), JSON.stringify(report, null, 1))
