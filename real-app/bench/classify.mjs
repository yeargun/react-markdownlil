// Accounts for every fuzz mismatch (run bench/fuzz-node.mjs first; writes results/classify.json): does it disappear with non-ASCII whitespace
// replaced (the firstLang bug), or does the port equal upstream on
// micromark-core-commonmark 2.0.3 (the 2026-09-26 attention drift)?
import fs from 'node:fs'
import {createRequire} from 'node:module'
import {createElement as h} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import Up from 'react-markdown'
import Lil from '@itslil/react-markdown'
const old = createRequire(new URL('../upstream-203/package.json', import.meta.url))
const Up203 = (await import(old.resolve('react-markdown'))).default
const r = (I, md) => { try { return renderToStaticMarkup(h(I, {children: md})) } catch (e) { return 'ERR ' + e.message } }
const ws = new RegExp('[' + [0xa0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff, 0x0b, 0x0c, 0x85, 0x200b].map((c) => String.fromCodePoint(c)).join('') + ']', 'g')
function prng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const browserFuzz = JSON.parse(fs.readFileSync('public/cases/fuzz.json', 'utf8')).map((c) => c.md)
const corpora = {'browser fuzz (3,000)': browserFuzz}
// the Node fuzz corpus, regenerated from its seed
const src = fs.readFileSync('bench/fuzz-node.mjs', 'utf8')
const gen = new Function('prng', 'String', src.slice(src.indexOf('const unicodeSpaces'), src.indexOf('const render')) + '; return doc')(prng, String)
const rr = prng(7)
corpora['node fuzz (20,000)'] = Array.from({length: 20000}, () => gen(rr))
const summary = {}
for (const [name, docs] of Object.entries(corpora)) {
  const c = {mismatch: 0, whitespace: 0, onlyLanguageClass: 0, drift: 0, both: 0, unexplained: 0}
  const left = []
  for (const md of docs) {
    const up = r(Up, md), lil = r(Lil, md)
    if (up === lil) continue
    c.mismatch++
    const byWs = r(Up, md.replace(ws, 'Z')) === r(Lil, md.replace(ws, 'Z'))
    const byDrift = r(Up203, md) === lil
    // both causes in one document: 2.0.3 upstream with whitespace replaced
    const byBoth = !byWs && !byDrift && r(Up203, md.replace(ws, 'Z')) === r(Lil, md.replace(ws, 'Z'))
    const strip = (x) => x.replace(/ class="language-[^"]*"/g, '')
    if (byWs && strip(up) === strip(lil)) c.onlyLanguageClass++
    if (byWs) c.whitespace++
    else if (byDrift) c.drift++
    else if (byBoth) c.both++
    else { c.unexplained++; if (left.length < 5) left.push(md) }
  }
  console.log(name.padEnd(22), JSON.stringify(c))
  summary[name] = c
  for (const md of left) console.log('   unexplained:', JSON.stringify(md).slice(0, 200))
}
fs.writeFileSync(new URL('../results/classify.json', import.meta.url), JSON.stringify(summary, null, 1))
process.exit(0)
