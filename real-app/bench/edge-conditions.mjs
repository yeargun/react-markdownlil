// How each package resolves under the export conditions real runtimes use,
// and whether the result runs where there is no DOM (edge/worker runtimes).
// Each bundle renders named character references with react-dom/server.
import fs from 'node:fs'
import {build} from 'esbuild'

// Next.js's edge sandbox has a `process` whose Node APIs throw; the edge row renders under one.
const edgeProcess = {
  env: {},
  cwd() {
    throw new Error('A Node.js API is used (process.cwd) which is not supported in the Edge Runtime.')
  },
}
const runtimes = {
  'node (import)': {conditions: [], platform: 'node'},
  'cloudflare workers (wrangler)': {conditions: ['workerd', 'worker', 'browser'], platform: 'neutral'},
  'next.js / vercel edge': {conditions: ['edge-light', 'browser', 'module', 'import'], platform: 'neutral', process: edgeProcess},
  'deno': {conditions: ['deno', 'node'], platform: 'neutral'},
  'react-native (metro)': {conditions: ['react-native'], platform: 'neutral'},
  'browser bundle (vite/webpack prod)': {conditions: ['browser', 'production'], platform: 'browser'},
}
const pkgs = {upstream: 'react-markdown', port: '@itslil/react-markdown'}
fs.mkdirSync('results/edge', {recursive: true})
const rows = []
for (const [runtime, opts] of Object.entries(runtimes)) {
  for (const [who, pkg] of Object.entries(pkgs)) {
    const file = `results/edge/${who}-${runtime.replace(/[^a-z]+/g, '-')}.mjs`
    const entry = `import Markdown from '${pkg}'\nimport {createElement} from 'react'\nimport {renderToString} from 'react-dom/server.browser'\nexport default () => renderToString(createElement(Markdown, {children: '&copy; &AElig; &notin; &amp;'}))\n`
    let resolved = ''
    try {
      const out = await build({
        stdin: {contents: entry, resolveDir: process.cwd(), loader: 'js'},
        bundle: true, format: 'esm', write: true, outfile: file, metafile: true, logLevel: 'silent',
        conditions: opts.conditions, platform: opts.platform, mainFields: ['module', 'main'],
        external: ['react', 'react-dom', 'react-dom/*', 'react/*', 'node:*'],
      })
      resolved = Object.keys(out.metafile.inputs).filter((p) => /react-markdown|decode-named-character-reference/.test(p)).map((p) => p.replace(/^.*node_modules\//, '')).join(', ')
    } catch (e) {
      rows.push({runtime, who, resolved: 'BUILD FAILED', result: String(e.message).slice(0, 120)})
      continue
    }
    let result
    try {
      // Node has no `document`, like a worker or edge runtime.
      const mod = await import(new URL('../' + file, import.meta.url).href + '?' + Date.now())
      const saved = Object.getOwnPropertyDescriptor(globalThis, 'process')
      if (opts.process) Object.defineProperty(globalThis, 'process', {value: opts.process, configurable: true, writable: true})
      try {
        result = 'OK ' + mod.default()
      } finally {
        Object.defineProperty(globalThis, 'process', saved)
      }
    } catch (e) {
      result = 'CRASH ' + String(e.message).slice(0, 80)
    }
    rows.push({runtime, who, resolved, result})
  }
}
for (const r of rows) console.log(`${r.runtime.padEnd(34)} ${r.who.padEnd(8)} ${r.result.padEnd(44)} ${r.resolved}`)
fs.writeFileSync('results/edge-conditions.json', JSON.stringify(rows, null, 1))
process.exit(0)
