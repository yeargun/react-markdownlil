// Delta-debugs fuzz mismatches (results/fuzz-node.json plus a fresh sample of
// whitespace-class mismatches) down to minimal inputs, and groups them.
import fs from 'node:fs'
import {createElement as h} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import Up from 'react-markdown'
import Lil from '@itslil/react-markdown'

const render = (Impl, md) => {
  try { return renderToStaticMarkup(h(Impl, {children: md})) } catch (e) { return 'ERROR ' + e.message }
}
const differs = (md) => render(Up, md) !== render(Lil, md)

// ddmin over code points
function minimize(md) {
  let chars = Array.from(md)
  let n = 2
  while (chars.length >= 2) {
    const size = Math.ceil(chars.length / n)
    let reduced = false
    for (let i = 0; i < chars.length; i += size) {
      const candidate = [...chars.slice(0, i), ...chars.slice(i + size)]
      if (candidate.length && differs(candidate.join(''))) {
        chars = candidate
        n = Math.max(n - 1, 2)
        reduced = true
        break
      }
    }
    if (!reduced) {
      if (n >= chars.length) break
      n = Math.min(chars.length, n * 2)
    }
  }
  // single-character pass
  for (let i = 0; i < chars.length; i++) {
    const candidate = [...chars.slice(0, i), ...chars.slice(i + 1)]
    if (candidate.length && differs(candidate.join(''))) { chars = candidate; i-- }
  }
  return chars.join('')
}
const esc = (s) => JSON.stringify(s).replace(/[\u0080-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))

const input = JSON.parse(fs.readFileSync(new URL('../results/fuzz-node.json', import.meta.url)))
const others = input.other.filter((o) => o.set === 'core').map((o) => o.md)
const groups = new Map()
for (const md of others) {
  const m = minimize(md)
  groups.set(m, (groups.get(m) || 0) + 1)
}
console.log('== non-whitespace class, minimal inputs (count):')
for (const [m, c] of groups) console.log(c, esc(m), '\n   up :', esc(render(Up, m)), '\n   lil:', esc(render(Lil, m)))

// whitespace class: sample from the browser fuzz and a fresh Unicode fuzz
const ws = JSON.parse(fs.readFileSync(new URL('../public/cases/fuzz.json', import.meta.url))).map((c) => c.md).filter(differs)
const wsGroups = new Map()
for (const md of ws.slice(0, 40)) {
  const m = minimize(md)
  wsGroups.set(m, (wsGroups.get(m) || 0) + 1)
}
console.log('\n== browser-fuzz mismatches (' + ws.length + '), minimal inputs (count):')
for (const [m, c] of wsGroups) console.log(c, esc(m), '\n   up :', esc(render(Up, m)), '\n   lil:', esc(render(Lil, m)))
