// dist/index.html: links to every variant of the app (docs and chat views) and
// to the side-by-side comparison, with each build's shipped JS size.
import fs from 'node:fs'

const sizes = JSON.parse(fs.readFileSync('dist/sizes.json', 'utf8'))
const docs = ['readme', 'chat', 'gfmreadme', 'unified', 'spec', 'math']
const label = {
  none: 'no markdown library (React + app shell)', up: 'react-markdown 10.1.0', lil: '@itslil/react-markdown',
  'up-gfm': 'react-markdown + remark-gfm', 'lil-gfm': '@itslil/react-markdown + @itslil/remark-gfm (npm)',
  'lil-upgfm': '@itslil/react-markdown + npm remark-gfm', 'up-full': 'react-markdown + gfm + math + katex',
  'lil-upfull': '@itslil/react-markdown + npm gfm + math + katex', 'lil-full': '@itslil/react-markdown + @itslil/remark-gfm, remark-math, rehype-katex (npm)',
}
const rows = Object.entries(sizes).map(([v, s]) => `<tr><td><code>${v}</code></td><td>${label[v] || ''}</td>
  <td class=n>${s.brotli.toLocaleString('en')}</td><td class=n>${s.raw.toLocaleString('en')}</td>
  <td>${docs.map((d) => `<a href="/v/${v}/?doc=${d}">${d}</a>`).join(' · ')} · <a href="/v/${v}/?view=chat">chat</a></td></tr>`).join('\n')
fs.writeFileSync('dist/index.html', `<!doctype html><meta charset=utf-8><title>react-markdown real-app test</title>
<style>body{font:15px system-ui;margin:24px;max-width:1100px}td,th{padding:4px 10px;border-bottom:1px solid #ddd;text-align:left}.n{text-align:right;font-variant-numeric:tabular-nums}</style>
<h1>react-markdown vs @itslil/react-markdown — the same Vite 8 app, built per variant</h1>
<p>Open a variant and use DevTools (Performance / Network) on it. Every page exposes <code>window.bench</code>
(<code>process</code>, <code>mount</code>, <code>stream</code>, <code>html</code>). <a href="/v/compare/compare.html">compare.html</a> loads both implementations for DOM diffs (<code>window.cmp</code>).</p>
<table><tr><th>variant</th><th>stack</th><th class=n>app JS Brotli-11</th><th class=n>raw</th><th>documents</th></tr>
${rows}</table>`)
console.log('wrote dist/index.html')
