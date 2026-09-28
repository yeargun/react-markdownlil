// The Vite dev server resolves the `development` condition with `browser`, so in
// dev the app gets react-markdown.browser.development.js (the browser program with
// devlop assertions on), as upstream's graph resolves. Check it runs in a real page.
import fs from 'node:fs'
import path from 'node:path'
import {createServer} from 'vite'
import {chromium} from 'playwright'

const browser = await chromium.launch()
const results = []
for (const variant of ['up', 'lil', 'lil-gfm', 'lil-full']) {
  process.env.VARIANT = variant
  fs.rmSync('node_modules/.vite', {recursive: true, force: true})
  const server = await createServer({configFile: path.resolve('vite.config.js'), logLevel: 'silent', publicDir: path.resolve('public'), server: {port: 0, host: '127.0.0.1'}})
  await server.listen()
  const url = server.resolvedUrls.local[0]
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })
  await page.goto(url + '?doc=chat')
  await page.waitForFunction(() => window.__committed !== undefined, null, {timeout: 60000})
  const html = await page.evaluate(() => window.bench.html('&copy; *a* `b` ~~c~~ $x$\n\n| a | b |\n|---|---|\n| 1 | 2 |'))
  let resolved = ''
  try {
    const meta = JSON.parse(fs.readFileSync('node_modules/.vite/deps/_metadata.json', 'utf8'))
    resolved = Object.entries(meta.optimized).filter(([k]) => /markdown/.test(k)).map(([k, v]) => `${k} <- ${v.src.replace(/^.*node_modules\//, '')}`).join('; ')
  } catch {}
  let assertion = null
  try {
    assertion = await page.evaluate(() => { try { window.bench.html(1); return 'no throw' } catch (e) { return `${e.name}: ${e.message}` } })
  } catch (e) { assertion = String(e.message).slice(0, 120) }
  results.push({variant, html, errors, resolved, assertion})
  console.log(variant.padEnd(9), errors.length ? 'ERRORS ' + JSON.stringify(errors).slice(0, 200) : 'ok', '|', resolved, '|', html.replace(/\n/g, '').slice(0, 150))
  await page.close()
  await server.close()
}
await browser.close()
fs.writeFileSync('results/devmode.json', JSON.stringify(results, null, 1))
process.exit(0)
