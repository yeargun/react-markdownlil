// Differential fuzz in Node (the package's Node builds, react-dom/server):
// many more documents than the browser run, and every mismatch is classified by
// whether it disappears when Unicode (non-ASCII) whitespace is replaced.
import fs from 'node:fs'
import {createElement as h} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import Up from 'react-markdown'
import Lil from '@itslil/react-markdown'
import upGfm from 'remark-gfm'
import lilGfm from '@itslil/remark-gfm'
import upMath from 'remark-math'
import lilMath from '@itslil/remark-math'

const N = Number(process.env.N || 20000)
const sets = {
  core: [{}, {}],
  'npm remark-gfm + remark-math on both': [{remarkPlugins: [upGfm, upMath]}, {remarkPlugins: [upGfm, upMath]}],
  '@itslil/remark-gfm + remark-math (npm)': [{remarkPlugins: [upGfm, upMath]}, {remarkPlugins: [lilGfm, lilMath]}],
}
function prng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
// JS \s beyond ASCII, plus other characters parsers treat specially.
const unicodeSpaces = [0xa0, 0x1680, 0x2000, 0x2003, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff, 0x0b, 0x0c, 0x85, 0x200b].map((c) => String.fromCodePoint(c))
const inline = ['a', 'b', 'foo', 'bar baz', ' ', ' ', ' ', '*', '**', '_', '__', '***', '`', '``', '~', '~~',
  '[', ']', '(', ')', '![', '](', '<', '>', '&', '&amp;', '&copy;', '&#35;', '&#x1F600;', '&notin', '\\', '\\*',
  '"', "'", ':', 'http://x.co/a_b', 'www.example.com', 'a@b.co', '<http://a.b>', '<b>', '</b>', '<span a="1">',
  '$', '$$', 'x^2', '|', ' | ', '[^1]', '[x]', '[ ]', 'é', 'ß', '😀', '\t', '<!-- c -->', '[ref]', '[ref][]',
  '*a*b*', '_a_b_', '1.', '#', 'İ', 'ẞ', 'ſ', 'K', ...unicodeSpaces, ...unicodeSpaces]
const starts = ['', '', '', '# ', '## ', '###### ', '- ', '* ', '+ ', '1. ', '2) ', '> ', '    ', '\t', '```', '~~~',
  '```js', '---', '***', '===', '| a | b |', '|---|:-:|', '- [ ] ', '- [x] ', '[^1]: ', '[ref]: /url "t"', '[REF]: /u',
  '[İ]: /i', '<div>', '$$', '   - ', '10. ', ...unicodeSpaces]
function doc(r) {
  const lines = []
  const n = 1 + Math.floor(r() * 12)
  for (let i = 0; i < n; i++) {
    let line = starts[Math.floor(r() * starts.length)]
    const k = Math.floor(r() * 9)
    for (let j = 0; j < k; j++) line += inline[Math.floor(r() * inline.length)]
    lines.push(line)
    if (r() < 0.25) lines.push('')
  }
  return lines.join('\n')
}
const render = (Impl, props, md) => {
  try { return renderToStaticMarkup(h(Impl, {...props, children: md})) } catch (e) { return 'ERROR ' + e.message }
}
const unicodeWs = new RegExp('[' + unicodeSpaces.join('') + ']', 'g')
const asciiOnly = (s) => s.replace(unicodeWs, 'Z')
const r = prng(Number(process.env.SEED || 7))
const docs = Array.from({length: N}, () => doc(r))
const summary = {}
const other = []
for (const [name, [up, lil]] of Object.entries(sets)) {
  let mismatch = 0, wsOnly = 0
  const t = Date.now()
  for (const md of docs) {
    const a = render(Up, up, md), b = render(Lil, lil, md)
    if (a === b) continue
    mismatch++
    const md2 = asciiOnly(md)
    if (render(Up, up, md2) === render(Lil, lil, md2)) wsOnly++
    else if (other.length < 30) other.push({set: name, md, up: a, lil: b})
  }
  summary[name] = {docs: N, mismatch, goneWithAsciiWhitespace: wsOnly, other: mismatch - wsOnly, seconds: (Date.now() - t) / 1000}
  console.log(name, JSON.stringify(summary[name]))
}
fs.writeFileSync(new URL('../results/fuzz-node.json', import.meta.url), JSON.stringify({summary, other}, null, 1))
