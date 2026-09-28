// Turns results/*.json into results/REPORT.md (tables only; the prose lives
// in the conversation). Paired numbers compare variants measured in the same
// round, so host drift cancels.
import fs from 'node:fs'

const j = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null)
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : NaN }
const fmt = (x, d = 1) => (Number.isFinite(x) ? x.toLocaleString('en', {minimumFractionDigits: d, maximumFractionDigits: d}) : '–')
const pctd = (r) => (Number.isFinite(r) ? `${r < 1 ? '−' : '+'}${fmt(Math.abs(r - 1) * 100, 1)}%` : '–')
const out = []
const table = (head, rows) => {
  out.push('| ' + head.join(' | ') + ' |', '|' + head.map((_, i) => (i ? '---:' : '---')).join('|') + '|')
  for (const r of rows) out.push('| ' + r.join(' | ') + ' |')
  out.push('')
}
const pairs = [['up', 'lil'], ['up-gfm', 'lil-upgfm'], ['up-gfm', 'lil-gfm'], ['up-full', 'lil-upfull'], ['up-full', 'lil-full']]

// ---- sizes -------------------------------------------------------------------
const sizes = j('dist/sizes.json')
if (sizes) {
  out.push('## Shipped JavaScript (Vite 8.3.1 production build, whole app incl. React 19.2)', '')
  table(['variant', 'raw', 'gzip-9', 'Brotli-11', 'Brotli Δ vs no-markdown app'], Object.entries(sizes).map(([v, s]) =>
    [v, fmt(s.raw, 0), fmt(s.gzip, 0), fmt(s.brotli, 0), v === 'none' ? '–' : fmt(s.brotli - sizes.none.brotli, 0)]))
  table(['pair', 'upstream Brotli', 'port Brotli', 'port − upstream', 'markdown stack Δ'], pairs.filter(([a, b]) => sizes[a] && sizes[b]).map(([a, b]) => {
    const da = sizes[a].brotli - sizes.none.brotli, db = sizes[b].brotli - sizes.none.brotli
    return [`${a} → ${b}`, fmt(sizes[a].brotli, 0), fmt(sizes[b].brotli, 0), fmt(sizes[b].brotli - sizes[a].brotli, 0), pctd(db / da)]
  }))
}

// ---- performance ----------------------------------------------------------------
for (const browser of ['chromium', 'firefox']) {
  const p = j(`results/perf-${browser}.json`)
  if (!p) continue
  out.push(`## ${browser} ${p.version}`, '')
  const conds = [...new Set(p.load.map((r) => r.condition))]
  for (const cond of conds) {
    const L = p.load.filter((r) => r.condition === cond)
    const by = (v) => L.filter((r) => r.variant === v)
    const variants = [...new Set(L.map((r) => r.variant))]
    const none = median(by('none').map((r) => r.committed))
    out.push(`### Page load, ${cond} (${median(variants.map((v) => by(v).length))} fresh loads per variant; median)`, '')
    table(['variant', 'markdown on screen (ms)', 'Δ vs no-markdown app', 'JS execution (ms)', 'heap after GC (MB)', 'JS transferred (B)'], variants.map((v) => {
      const rows = by(v)
      return [v, fmt(median(rows.map((r) => r.committed))), v === 'none' ? '–' : fmt(median(rows.map((r) => r.committed)) - none),
        fmt(median(rows.map((r) => r.scriptDuration))), fmt(median(rows.map((r) => r.heapUsed)) / 1048576, 2), fmt(median(rows.map((r) => r.scriptTransfer)), 0)]
    }))
    table(['pair (same-round)', 'median Δ on-screen (ms)', 'port faster in', 'median Δ JS execution (ms)'], pairs.filter(([a, b]) => by(a).length && by(b).length).map(([a, b]) => {
      const d = [], s = []
      for (const ra of by(a)) {
        const rb = by(b).find((r) => r.run === ra.run)
        if (!rb) continue
        d.push(rb.committed - ra.committed)
        if (ra.scriptDuration !== undefined) s.push(rb.scriptDuration - ra.scriptDuration)
      }
      return [`${a} → ${b}`, fmt(median(d)), `${d.filter((x) => x < 0).length}/${d.length}`, s.length ? fmt(median(s)) : '–']
    }))
  }
  for (const cpu of [...new Set(p.render.map((r) => r.cpu))]) {
    const R = p.render.filter((r) => r.cpu === cpu)
    out.push(`### Rendering, CPU ${cpu}× (${median([...new Set(R.map((r) => r.variant))].map((v) => new Set(R.filter((r) => r.variant === v).map((r) => r.run)).size))} fresh pages per variant; ms, median of per-page medians)`, '')
    const rows = []
    for (const [a, b] of pairs) {
      const docs = [...new Set(R.filter((r) => r.variant === a).map((r) => r.doc))]
      for (const doc of docs) {
        const A = R.filter((r) => r.variant === a && r.doc === doc), B = R.filter((r) => r.variant === b && r.doc === doc)
        if (!A.length || !B.length) continue
        const ratio = (k) => median(A.map((ra) => { const rb = B.find((r) => r.run === ra.run); return rb ? rb[k] / ra[k] : NaN }).filter(Number.isFinite))
        rows.push([`${a} → ${b}`, doc, fmt(median(A.map((r) => r.cold)), 2), fmt(median(B.map((r) => r.cold)), 2),
          fmt(median(A.map((r) => r.processMedian)), 3), fmt(median(B.map((r) => r.processMedian)), 3), pctd(ratio('processMedian')),
          fmt(median(A.map((r) => r.mountMedian)), 3), fmt(median(B.map((r) => r.mountMedian)), 3), pctd(ratio('mountMedian'))])
      }
    }
    table(['pair', 'document', 'first call up', 'first call port', 'pipeline up', 'pipeline port', 'Δ', 'React mount up', 'React mount port', 'Δ'], rows)
  }
  if (p.stream.length) {
    out.push('### Streaming (re-render the growing message every 12 characters; ms)', '')
    const rows = []
    for (const cpu of [...new Set(p.stream.map((r) => r.cpu))]) {
      for (const name of [...new Set(p.stream.filter((r) => r.cpu === cpu).map((r) => r.stream))]) {
        for (const [a, b] of pairs) {
          const A = p.stream.filter((r) => r.cpu === cpu && r.stream === name && r.variant === a)
          const B = p.stream.filter((r) => r.cpu === cpu && r.stream === name && r.variant === b)
          if (!A.length || !B.length) continue
          if (name.includes('realtime')) {
            rows.push([`${cpu}×`, name, `${a} → ${b}`, `frames>33ms ${median(A.map((r) => r.framesOver33))} / ${median(B.map((r) => r.framesOver33))}`, `p95 frame ${fmt(median(A.map((r) => r.frameP95)))} / ${fmt(median(B.map((r) => r.frameP95)))}`, `max frame ${fmt(median(A.map((r) => r.frameMax)))} / ${fmt(median(B.map((r) => r.frameMax)))}`, ''])
          } else {
            const ratio = median(A.map((ra) => { const rb = B.find((r) => r.run === ra.run); return rb ? rb.total / ra.total : NaN }).filter(Number.isFinite))
            rows.push([`${cpu}×`, `${name} (${A[0].updates} updates)`, `${a} → ${b}`, `total ${fmt(median(A.map((r) => r.total)), 0)} / ${fmt(median(B.map((r) => r.total)), 0)} (${pctd(ratio)})`,
              `p95 ${fmt(median(A.map((r) => r.p95)), 2)} / ${fmt(median(B.map((r) => r.p95)), 2)}`, `last ${fmt(median(A.map((r) => r.last)), 2)} / ${fmt(median(B.map((r) => r.last)), 2)}`,
              `>16.7ms ${median(A.map((r) => r.over16))} / ${median(B.map((r) => r.over16))}`])
          }
        }
      }
    }
    table(['CPU', 'stream', 'pair', 'upstream / port', '', '', ''], rows)
  }
}

// ---- correctness --------------------------------------------------------------
const c = j('results/correctness.json')
if (c) {
  out.push('## Differential correctness in the browser (DOM of the production builds)', '')
  const rows = []
  for (const [browser, r] of Object.entries(c)) {
    for (const x of r.rows) rows.push([browser, x.suite, x.set, x.total, x.mismatches])
  }
  table(['browser', 'suite', 'plugin set', 'cases', 'mismatches'], rows)
}
const fz = j('results/fuzz-node.json')
if (fz) {
  out.push('## Node differential fuzz (Unicode-heavy)', '')
  table(['set', 'documents', 'mismatches', 'gone when non-ASCII whitespace is replaced', 'other'], Object.entries(fz.summary).map(([k, v]) => [k, v.docs, v.mismatch, v.goneWithAsciiWhitespace, v.other]))
}
const edge = j('results/edge-conditions.json')
if (edge) {
  out.push('## Export conditions without a DOM', '')
  table(['runtime conditions', 'package', 'result', 'resolved'], edge.map((r) => [r.runtime, r.who, r.result.replace(/\|/g, '\\|'), r.resolved]))
}
fs.writeFileSync('results/REPORT.md', out.join('\n'))
console.log(out.join('\n'))

// ---- stages, allocation (appended) -----------------------------------------------
const st = j('results/stages-chromium.json')
if (st) {
  const lines = ['', '## Where the time goes (Chromium, warm, median of 5 fresh pages; ms)', '',
    '| variant | document | parse (micromark + mdast) | mdast → hast | hast → React elements | GC share | allocated per README render |',
    '|---|---|---:|---:|---:|---:|---:|']
  for (const v of [...new Set(st.map((r) => r.variant))]) {
    const R = st.filter((r) => r.variant === v)
    for (const d of ['chat', 'readme', 'spec']) {
      lines.push(`| ${v} | ${d} | ${fmt(median(R.map((r) => r[d].parse)), 2)} | ${fmt(median(R.map((r) => r[d].hast)), 2)} | ${fmt(median(R.map((r) => r[d].jsx)), 2)} | ${d === 'readme' ? fmt(median(R.map((r) => r.gcShare)) * 100, 1) + '%' : ''} | ${d === 'readme' ? fmt(median(R.map((r) => r.allocPerReadme)) / 1048576, 2) + ' MB' : ''} |`)
    }
  }
  fs.appendFileSync('results/REPORT.md', lines.join('\n') + '\n')
  console.log(lines.join('\n'))
}
