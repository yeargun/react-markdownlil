// All named character references through the Node builds (the table), which
// is what SSR renders before the browser build (the DOM) hydrates.
import fs from 'node:fs'
import {createElement as h} from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import Up from 'react-markdown'
import Lil from '@itslil/react-markdown'
const cases = JSON.parse(fs.readFileSync('public/cases/entities.json', 'utf8'))
let bad = 0
for (const c of cases) if (renderToStaticMarkup(h(Up, {children: c.md})) !== renderToStaticMarkup(h(Lil, {children: c.md}))) { bad++; console.log('mismatch', c.id) }
fs.writeFileSync('results/entities-node.json', JSON.stringify({documents: cases.length, mismatches: bad}))
console.log(`${cases.length} entity documents (2,125 names in text, link destinations, titles, code; legacy names without ';'; edge cases): ${bad} mismatches`)
process.exit(0)
