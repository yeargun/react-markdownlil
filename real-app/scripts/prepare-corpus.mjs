// Writes public/corpus/*.md (performance documents) and public/cases/*.json
// (differential correctness cases). Deterministic: same inputs, same files.
import fs from 'node:fs'
import path from 'node:path'
import {characterEntities} from 'character-entities'
import {characterEntitiesLegacy} from 'character-entities-legacy'

const root = path.resolve(import.meta.dirname, '..')
const nm = (p) => path.join(root, 'node_modules', p)
const out = (p) => path.join(root, 'public', p)
fs.mkdirSync(out('corpus'), {recursive: true})
fs.mkdirSync(out('cases'), {recursive: true})

const read = (p) => fs.readFileSync(p, 'utf8')

// The GFM spec and extension examples, pinned (CC-BY-SA 4.0, so fetched, not vendored).
const cmarkGfm = 'https://raw.githubusercontent.com/github/cmark-gfm/0.29.0.gfm.13/test/'
for (const [remote, local] of [['spec.txt', 'gfm-spec.txt'], ['extensions.txt', 'gfm-extensions.txt']]) {
  const file = path.join(root, 'corpus-src', local)
  if (!fs.existsSync(file)) {
    const response = await fetch(cmarkGfm + remote)
    if (!response.ok) throw new Error(`${remote}: ${response.status}`)
    fs.writeFileSync(file, await response.text())
  }
}
const chat = read(path.join(root, 'corpus-src/chat-answer.md'))

// ---- performance documents -------------------------------------------------
const docs = {
  small: 'Sure — use `Array.prototype.flatMap`:\n\n```js\nconst words = lines.flatMap((line) => line.split(" "))\n```\n\nIt maps **and** flattens one level, so it is equivalent to `lines.map(f).flat()` but allocates once. See [MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap).\n',
  chat,
  gfmreadme: read(nm('remark-gfm/readme.md')),
  readme: read(nm('react-markdown/readme.md')),
  unified: read(nm('unified/readme.md')),
  spec: read(nm('commonmark-spec/spec.txt')).replace(/→/g, '\t'),
  math: read(path.join(root, 'corpus-src/math.md')),
}
// A 40-message conversation: alternating short questions and answers cut from
// the chat answer and the small message, the shape of a chat history page.
const sections = chat.split(/\n(?=### )/)
const convo = []
for (let i = 0; i < 40; i++) {
  convo.push(i % 2 === 0
    ? `How do I handle case ${i / 2 + 1}? I tried \`useEffect\` but it runs **twice**.`
    : (i % 4 === 1 ? docs.small : sections[(i >> 1) % sections.length]))
}
fs.writeFileSync(out('corpus/conversation.json'), JSON.stringify(convo))
for (const [name, text] of Object.entries(docs)) fs.writeFileSync(out(`corpus/${name}.md`), text)
fs.writeFileSync(out('corpus/index.json'), JSON.stringify(Object.fromEntries(
  Object.entries(docs).map(([k, v]) => [k, v.length]))))

// ---- spec examples ------------------------------------------------------------
function examples(text, prefix) {
  const list = []
  const re = /^`{32} example[^\n]*\n([\s\S]*?)^\.\n([\s\S]*?)^`{32}$/gm
  let m
  while ((m = re.exec(text))) list.push({id: `${prefix}-${list.length + 1}`, md: m[1].replace(/→/g, '\t')})
  return list
}
const commonmark = examples(read(nm('commonmark-spec/spec.txt')), 'cm')
const gfm = [
  ...examples(read(path.join(root, 'corpus-src/gfm-spec.txt')), 'gfm'),
  ...examples(read(path.join(root, 'corpus-src/gfm-extensions.txt')), 'gfmx'),
]
fs.writeFileSync(out('cases/commonmark.json'), JSON.stringify(commonmark))
fs.writeFileSync(out('cases/gfm.json'), JSON.stringify(gfm))

// ---- named character references -----------------------------------------------
// Every name in text, in a link destination and title, and inside code (which
// must not decode); legacy names also without the semicolon, where HTML still
// decodes some of them but CommonMark does not.
const names = Object.keys(characterEntities)
const entities = []
for (let i = 0; i < names.length; i += 25) {
  const chunk = names.slice(i, i + 25)
  entities.push({
    id: `ent-${i}`,
    md: chunk.map((n) => `&${n}; [l](/u?q=&${n};&x "t&${n};") \`&${n};\``).join('\n\n'),
  })
}
const legacy = Object.keys(characterEntitiesLegacy)
for (let i = 0; i < legacy.length; i += 25) {
  entities.push({id: `ent-legacy-${i}`, md: legacy.slice(i, i + 25).map((n) => `a&${n}b &${n}= &${n}`).join('\n\n')})
}
entities.push({id: 'ent-edge', md: '&amp &AMP; &notit; &notin &not; &#0; &#x110000; &#xD800; &#65; &#X41; &#1234567; &foo; &;&#; &#x; &ThisIsNotDefined; &nbsp&nbsp;'})
fs.writeFileSync(out('cases/entities.json'), JSON.stringify(entities))

// ---- seeded fuzz ---------------------------------------------------------------
function prng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const inline = ['a', 'b', 'foo', 'bar baz', ' ', ' ', ' ', '*', '**', '_', '__', '***', '`', '``', '~', '~~',
  '[', ']', '(', ')', '![', '](', '<', '>', '&', '&amp;', '&copy;', '&#35;', '&#x1F600;', '&notin', '\\', '\\*',
  '"', "'", ':', 'http://x.co/a_b', 'www.example.com', 'a@b.co', '<http://a.b>', '<b>', '</b>', '<span a="1">',
  '$', '$$', 'x^2', '|', ' | ', '[^1]', '[x]', '[ ]', 'é', 'ß', '😀', ' ', '\t', '<!-- c -->', '<?php x ?>',
  'javascript:alert(1)', '[ref]', '[ref][]', '*a*b*', '_a_b_', '1.', '#']
const starts = ['', '', '', '# ', '## ', '###### ', '####### ', '- ', '* ', '+ ', '1. ', '2) ', '> ', '> > ', '    ',
  '\t', '```', '~~~', '```js', '---', '***', '___', '===', '| a | b |', '|---|:-:|', '- [ ] ', '- [x] ', '[^1]: ',
  '[ref]: /url "t"', '<div>', '</div>', '$$', '  ', '   - ', '10. ', '<pre>', '<table>']
function fuzzDoc(r) {
  const lines = []
  const n = 1 + Math.floor(r() * 14)
  for (let i = 0; i < n; i++) {
    let line = starts[Math.floor(r() * starts.length)]
    const k = Math.floor(r() * 9)
    for (let j = 0; j < k; j++) line += inline[Math.floor(r() * inline.length)]
    lines.push(line)
    if (r() < 0.25) lines.push('')
  }
  return lines.join('\n')
}
const r = prng(20260927)
const fuzz = Array.from({length: 3000}, (_, i) => ({id: `fz-${i}`, md: fuzzDoc(r)}))
fs.writeFileSync(out('cases/fuzz.json'), JSON.stringify(fuzz))
export {fuzzDoc, prng}

console.log(JSON.stringify({
  docs: Object.fromEntries(Object.entries(docs).map(([k, v]) => [k, v.length])),
  conversation: convo.length,
  commonmark: commonmark.length, gfm: gfm.length, entities: entities.length, entityNames: names.length,
  fuzz: fuzz.length,
}))
