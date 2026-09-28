// What plugins see: the mdast after parsing and the hast after remark-rehype, serialized whole
// (positions, data, key order), for every corpus document, spec example and fuzz document.
import fs from 'node:fs'
import {createElement as h} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import Up from 'react-markdown'
import Lil from '@itslil/react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../public/${f}`, import.meta.url), 'utf8'))
const docs = [...read('cases/commonmark.json'), ...read('cases/gfm.json'), ...read('cases/entities.json'), ...read('cases/fuzz.json')].map((c) => c.md)
for (const n of ['small', 'chat', 'gfmreadme', 'readme', 'unified', 'spec', 'math']) docs.push(fs.readFileSync(new URL(`../public/corpus/${n}.md`, import.meta.url), 'utf8'))
function capture(Impl, md, plugins) {
  let mdast = '', hast = ''
  const takeMdast = () => (tree) => { mdast = JSON.stringify(tree) }
  const takeHast = () => (tree) => { hast = JSON.stringify(tree) }
  let html
  try { html = renderToStaticMarkup(h(Impl, {children: md, remarkPlugins: [...plugins, takeMdast], rehypePlugins: [takeHast]})) } catch (e) { html = 'ERROR ' + e.message }
  return {mdast, hast, html}
}
const sets = {core: [], 'gfm + math': [remarkGfm, remarkMath]}
const result = {}
for (const [name, plugins] of Object.entries(sets)) {
  let mdast = 0, hast = 0, html = 0
  const first = []
  for (const md of docs) {
    const a = capture(Up, md, plugins), b = capture(Lil, md, plugins)
    if (a.mdast !== b.mdast) { mdast++; if (first.length < 3) first.push({md, what: 'mdast'}) }
    if (a.hast !== b.hast) { hast++; if (first.length < 3) first.push({md, what: 'hast'}) }
    if (a.html !== b.html) html++
  }
  result[name] = {documents: docs.length, mdastDiffer: mdast, hastDiffer: hast, htmlDiffer: html}
  console.log(name.padEnd(12), JSON.stringify(result[name]), first.length ? JSON.stringify(first).slice(0, 300) : '')
}
fs.writeFileSync(new URL('../results/trees.json', import.meta.url), JSON.stringify(result, null, 1))
process.exit(0)
