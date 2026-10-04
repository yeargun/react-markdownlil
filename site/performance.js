// Speed section: committed measurements from site/performance.json plus an
// in-page run of the same harness on the visitor's device.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]))
const ms = value => `${value < 10 ? value.toFixed(2) : value < 100 ? value.toFixed(1) : value.toFixed(0)} ms`
const pct = ratio => Math.abs(1 - ratio).toLocaleString('en-US', {style: 'percent', maximumFractionDigits: 1})
const verdict = ratio => {
  if (Math.abs(1 - ratio) < 0.005) return `<span class="speed-even">same</span>`
  return ratio < 1 ? `<span class="speed-win">${pct(ratio)} faster</span>` : `<span class="speed-loss">${pct(ratio)} slower</span>`
}

const DOC_LABELS = {
  chat: 'Chat reply',
  readme: 'react-markdown README',
  large: 'Six package READMEs',
  gfm: 'remark-gfm README',
  math: 'Math notes',
}
const PLUGIN_LABELS = {gfm: 'remark-gfm', math: 'remark-math', katex: 'rehype-katex'}
const PAIR_LABELS = {
  node: ['Node entry', 'What <code>import</code> resolves to in Node: <code>dist/react-markdown.esm.js</code> versus the original bundled with Node conditions and Terser.'],
  browser: ['Browser entry', 'What a bundler picks for the browser: <code>dist/react-markdown.browser.js</code> versus the original bundled with browser conditions and Terser. Both decode named character references through the DOM.'],
  portable: ['Portable bundle', 'The exact files from the size comparison above: the Brotli-objective LilScript build versus the Terser-minified original.'],
}
const kb = bytes => `${(bytes / 1024).toFixed(1)} KB`

function docCell(doc, data, runtime) {
  const plugins = runtime.docs[doc]?.plugins ?? []
  const size = data.corpus?.[doc]?.bytes
  return `<th scope="row">${escape(DOC_LABELS[doc] ?? doc)}<small>${size ? kb(size) : ''}${plugins.length ? ` · ${plugins.map(p => PLUGIN_LABELS[p]).join(', ')}` : ''}</small></th>`
}

function runtimeTable(data, runtime) {
  const pairs = Object.entries(runtime.pairs)
  const docs = Object.keys(runtime.docs)
  const head = pairs.map(([pair]) => `<th colspan="3" scope="colgroup">${PAIR_LABELS[pair]?.[0] ?? pair}</th>`).join('')
  const sub = pairs.map(() => '<th scope="col">Original</th><th scope="col">LilScript</th><th scope="col">Difference</th>').join('')
  const row = (label, pick) => `<tr>${label}${pairs.map(([, p]) => { const c = pick(p); return `<td>${ms(c.originalMs)}</td><td>${ms(c.lilscriptMs)}</td><td>${verdict(c.ratio)}</td>` }).join('')}</tr>`
  return `<div class="table-wrap objective-table speed-table"><table>
    <caption>${escape(runtime.runtime)} · median time per render, lower is better</caption>
    <thead><tr><th rowspan="2" scope="col">Document</th>${head}</tr><tr>${sub}</tr></thead>
    <tbody>${docs.map(doc => row(docCell(doc, data, runtime), p => p.docs[doc])).join('')}
    <tr class="speed-split">${'<td></td>'.repeat(1 + 3 * pairs.length)}</tr>
    ${row('<th scope="row">Load the package<small>evaluate, no plugins</small></th>', p => p.cold.importMs)}
    ${row('<th scope="row">First render<small>chat reply, cold JIT</small></th>', p => p.cold.firstRenderMs)}
    ${row('<th scope="row">Load + first render<small>time until the first message shows</small></th>', p => { const o = p.cold.importMs.originalMs + p.cold.firstRenderMs.originalMs, l = p.cold.importMs.lilscriptMs + p.cold.firstRenderMs.lilscriptMs; return {originalMs: o, lilscriptMs: l, ratio: l / o} })}</tbody></table></div>
    ${runtime.reference ? `<p class="objective-note">For reference, <code>react-markdown</code> as installed from npm (unbundled, dozens of modules) takes ${ms(runtime.reference.cold.importMs)} to load in ${escape(runtime.runtime)}.</p>` : ''}`
}

function runtimeSummary(runtime) {
  const ratios = Object.values(runtime.pairs).flatMap(p => Object.values(p.docs).map(d => d.ratio))
  const geomean = Math.exp(ratios.reduce((s, x) => s + Math.log(x), 0) / ratios.length)
  return {geomean, worst: Math.max(...ratios)}
}

export function renderPerformance(data) {
  const root = document.querySelector('#speed-comparison')
  if (!root || !data?.runtimes?.some(rt => !rt.id.startsWith('node'))) return
  const browsers = data.runtimes.filter(rt => !rt.id.startsWith('node'))
  const servers = data.runtimes.filter(rt => rt.id.startsWith('node'))
  const cards = browsers.map(rt => {
    const {geomean, worst} = runtimeSummary(rt)
    return `<button class="objective-card speed-card" type="button" data-runtime="${escape(rt.id)}" aria-pressed="false"><span>${escape(rt.runtime.replace(' (headless)', ''))}</span><strong>${geomean <= 1 ? pct(geomean) + ' faster' : pct(geomean) + ' slower'}</strong><p>${worst <= 1.005 ? 'faster or equal on every document' : `slowest cell ${pct(worst)} slower`}</p><small>geometric mean over ${Object.keys(rt.pairs).length * Object.keys(rt.docs).length} renders</small></button>`
  }).join('')
  root.innerHTML = `<div class="objective-cards speed-cards">${cards}</div>
    <div id="speed-runtime"></div>
    <div class="speed-pairs">${Object.entries(PAIR_LABELS).filter(([pair]) => browsers.some(rt => rt.pairs[pair])).map(([, [name, text]]) => `<p><strong>${name}.</strong> ${text}</p>`).join('')}</div>
    <div class="speed-here" id="speed-here">
      <div><h3>Run it on this device</h3><p>Downloads both browser builds and both plugin sets (about 1.8 MB), checks that they render identical HTML, then times them in this tab. Takes 30–60 seconds; the page stays usable.</p></div>
      <button class="button primary" id="speed-run" type="button">Run the benchmark</button>
      <div class="speed-progress" hidden><span></span></div>
      <div id="speed-here-result"></div>
    </div>
    ${servers.length ? `<details class="objective-details"><summary>Server-side rendering in Node (${servers.map(rt => escape(rt.runtime)).join(', ')})</summary>${servers.map(rt => runtimeTable(data, rt)).join('')}<p class="objective-note"><strong>${PAIR_LABELS.node[0]}.</strong> ${PAIR_LABELS.node[1]} ${escape(servers[0].method)}</p></details>` : ''}
    <p class="objective-note">${escape(browsers[0]?.method ?? data.runtimes[0].method)}</p>
    <p class="objective-note">Same input, same output: every lane must produce byte-identical HTML for every document before it is timed. Originals render with <code>remark-gfm@4.0.1</code>, <code>remark-math@6.0.0</code> and <code>rehype-katex@7.0.1</code>; LilScript renders with the <code>@itslil</code> plugins. Rendering is <code>react-dom/server</code> <code>renderToString</code> with one shared production React, so the time is react-markdown's: parsing, transforming and building elements. ${escape(data.runtimes[0].machine.cpu)}, ${data.runtimes[0].machine.logicalCpus} logical CPUs, measured ${escape(data.generatedAt.slice(0, 10))}. Safari/WebKit is not measured on this host; use the button above.</p>
    <p class="objective-note"><a href="./performance.json">Every measurement, range and hash ↗</a> · <a href="https://github.com/yeargun/react-markdownlil/tree/main/bench">Benchmark source ↗</a> · <a href="./perf/bench.html">Harness page ↗</a></p>`

  const show = id => {
    const rt = browsers.find(r => r.id === id) ?? browsers[0]
    root.querySelectorAll('.speed-card').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.runtime === rt.id)))
    root.querySelector('#speed-runtime').innerHTML = runtimeTable(data, rt)
  }
  root.querySelectorAll('.speed-card').forEach(b => b.addEventListener('click', () => show(b.dataset.runtime)))
  if (browsers.length) show((browsers.find(r => r.id.startsWith('chromium')) ?? browsers[0]).id)

  const all = browsers.flatMap(rt => Object.values(rt.pairs).flatMap(p => Object.values(p.docs).map(d => d.ratio)))
  const geomean = Math.exp(all.reduce((s, x) => s + Math.log(x), 0) / all.length)
  const hero = document.getElementById('hero-speed')
  if (hero) hero.innerHTML = `<strong>${geomean <= 1 ? pct(geomean) + ' faster' : pct(geomean) + ' slower'}</strong> rendering than the original, geometric mean over ${all.length} measurements in ${browsers.map(r => escape(r.runtime.replace(' (headless)', ''))).join(', ')}. <a href="#speed">Speed ↓</a>`

  bindRunHere(data)
}

function bindRunHere(data) {
  const button = document.getElementById('speed-run')
  const bar = document.querySelector('#speed-here .speed-progress')
  const out = document.getElementById('speed-here-result')
  button?.addEventListener('click', async () => {
    button.disabled = true
    button.textContent = 'Running…'
    bar.hidden = false
    out.innerHTML = ''
    try {
      const runner = await import('./perf/runner.js')
      const lanes = ['original-browser', 'lil-browser', 'original-portable', 'lil-portable']
      const res = await runner.runHere({lanes, onProgress: f => { bar.firstElementChild.style.width = `${(f * 100).toFixed(1)}%` }})
      const docs = Object.keys(runner.DOCS)
      const pairs = [['browser', 'original-browser', 'lil-browser'], ['portable', 'original-portable', 'lil-portable']]
      out.innerHTML = `<div class="table-wrap objective-table speed-table"><table><caption>This device · ${escape(navigator.userAgent.match(/(Firefox|Edg|OPR|Chrome|Version)\/[\d.]+/g)?.pop()?.replace('Version', 'Safari') ?? 'this browser')} · median ms per render</caption>
        <thead><tr><th rowspan="2">Document</th>${pairs.map(([p]) => `<th colspan="3">${PAIR_LABELS[p][0]}</th>`).join('')}</tr><tr>${pairs.map(() => '<th>Original</th><th>LilScript</th><th>Difference</th>').join('')}</tr></thead>
        <tbody>${docs.map(doc => `<tr><th scope="row">${escape(DOC_LABELS[doc])}</th>${pairs.map(([, o, l]) => `<td>${ms(res[o][doc])}</td><td>${ms(res[l][doc])}</td><td>${verdict(res[l][doc] / res[o][doc])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <p class="objective-note">Identical HTML was verified in this browser before timing. One tab, lanes interleaved, three rounds; other tabs and battery saving can move these numbers, so run it twice before reading much into a few percent.</p>`
      button.textContent = 'Run again'
    } catch (error) {
      out.innerHTML = `<p class="objective-note speed-loss">The benchmark stopped: ${escape(error.message)}</p>`
      button.textContent = 'Try again'
    } finally {
      button.disabled = false
      bar.hidden = true
    }
  })
}
