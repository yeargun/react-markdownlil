// property-information@7.2.0's html and svg schemas as the row groups that src/property-information/lib/find.lil
// loads (writes src/property-information/lib/schema-data.lil).
//
// Every property of the two merged schemas is one row of one group. A group is a space-separated list of
// names; the property is the group's prefix + the name, and its attribute follows the group's rule unless the
// row spells it out as `name|attribute`. Rules: 0 the property itself, 1 its lowercase, 2 its dash-case,
// 3 `aria-` + the lowercased name. Groups also fix the info's `space` (truthy for every property of a
// schema module that has a space, i.e. all but aria's) and `commaSeparated`, and which schema(s) they
// define into (rows identical in both schemas are defined into both).
import {writeFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {html, svg} from 'property-information'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const rows = (schema) => Object.values(schema.property).map((i) => ({p: i.property, a: i.attribute, s: Boolean(i.space), c: Boolean(i.commaSeparated)}))
const key = (r) => [r.p, r.a, r.s, r.c].join('\0')
const h = rows(html), s = rows(svg)
const inSvg = new Set(s.map(key)), inHtml = new Set(h.map(key))
const both = h.filter((r) => inSvg.has(key(r)))
const htmlOnly = h.filter((r) => !inSvg.has(key(r)))
const svgOnly = s.filter((r) => !inHtml.has(key(r)))
const dash = (p) => p.replace(/[A-Z]/g, (l) => '-' + l.toLowerCase())
const isOn = (r) => /^on[A-Z]/.test(r.p)
const isAria = (r) => !r.s && r.p.startsWith('aria') && r.a === 'aria-' + r.p.slice(4).toLowerCase()

// [export name, rows, prefix, rule, space, comma, target]
const groups = [
  ['ariaRows', both.filter(isAria), 'aria', 3, false, false, 'both'],
  ['noSpaceRows', both.filter((r) => !r.s && !isAria(r)), '', 0, false, false, 'both'],
  ['commonRows', both.filter((r) => r.s && !r.c && !isOn(r)), '', 1, true, false, 'both'],
  ['commonOnRows', both.filter((r) => r.s && !r.c && isOn(r)), 'on', 1, true, false, 'both'],
  ['htmlRows', htmlOnly.filter((r) => !r.c && !isOn(r)), '', 1, true, false, 'html'],
  ['htmlOnRows', htmlOnly.filter((r) => !r.c && isOn(r)), 'on', 1, true, false, 'html'],
  ['htmlCommaRows', htmlOnly.filter((r) => r.c), '', 1, true, true, 'html'],
  ['svgRows', svgOnly.filter((r) => !r.c && (r.a === r.p || (r.a !== dash(r.p) && r.a !== r.p.toLowerCase()))), '', 0, true, false, 'svg'],
  ['svgDashRows', svgOnly.filter((r) => !r.c && r.a !== r.p && r.a === dash(r.p)), '', 2, true, false, 'svg'],
  ['svgLowerRows', svgOnly.filter((r) => !r.c && r.a !== r.p && r.a !== dash(r.p) && r.a === r.p.toLowerCase() && !isOn(r)), '', 1, true, false, 'svg'],
  ['svgOnRows', svgOnly.filter((r) => !r.c && r.a !== r.p && r.a !== dash(r.p) && r.a === r.p.toLowerCase() && isOn(r)), 'on', 1, true, false, 'svg'],
  ['svgCommaRows', svgOnly.filter((r) => r.c), '', 0, true, true, 'svg'],
]
const seen = new Set()
for (const [, list] of groups) for (const r of list) seen.add(key(r))
for (const r of [...both, ...htmlOnly, ...svgOnly]) if (!seen.has(key(r))) throw new Error('unassigned row ' + r.p)
for (const r of both) if (r.s !== !isAria(r) && r.p !== 'role') throw new Error('unexpected space ' + r.p)

function attribute(rule, prefix, name) {
  const p = prefix + name
  return rule === 0 ? p : rule === 1 ? p.toLowerCase() : rule === 2 ? dash(p) : 'aria-' + name.toLowerCase()
}
const lines = [
  '// Generated from property-information@7.2.0 by scripts/generate-schema.mjs: every property of the merged',
  '// `html` and `svg` schemas, as the row groups that find.lil loads (see there).',
]
for (const [name, list, prefix, rule] of groups) {
  const text = list.map((r) => {
    const n = r.p.slice(prefix.length)
    if (!r.p.startsWith(prefix) || n.includes(' ') || n.includes('|') || r.a.includes(' ')) throw new Error('bad row ' + r.p)
    return r.a === attribute(rule, prefix, n) ? n : n + '|' + r.a
  }).join(' ')
  lines.push(`export string ${name} = ${JSON.stringify(text)};`)
}
writeFileSync(resolve(root, 'src/property-information/lib/schema-data.lil'), lines.join('\n') + '\n')
