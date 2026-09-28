// Builds every variant as its own production app (Vite 8: Rolldown + Oxc
// minifier, the defaults), then the comparison page. One build at a time.
import {execFileSync} from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

export const variants = ['none', 'up', 'lil', 'up-gfm', 'lil-upgfm', 'lil-gfm', 'up-full', 'lil-upfull', 'lil-full']
const only = process.argv.slice(2)
// A filtered build (node scripts/build-all.mjs lil up) replaces only those variants.
for (const v of [...variants, 'compare'].filter((v) => !only.length || only.includes(v))) {
  fs.rmSync(path.join('dist', v), {recursive: true, force: true})
}
const vite = path.resolve('node_modules/vite/bin/vite.js')
for (const v of [...variants, 'compare'].filter((v) => !only.length || only.includes(v))) {
  const t = Date.now()
  execFileSync(process.execPath, [vite, 'build', '--logLevel', 'warn'], {
    env: {...process.env, VARIANT: v, ENTRY: v === 'compare' ? 'compare.html' : 'index.html'},
    stdio: 'inherit',
  })
  console.log(`built ${v} in ${Date.now() - t} ms`)
}

// Sizes of what each app ships: all JS chunks, raw / gzip-9 / Brotli-11.
const br = (b) => zlib.brotliCompressSync(b, {params: {[zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_LGWIN]: 22}}).length
const gz = (b) => zlib.gzipSync(b, {level: 9}).length
const sizes = {}
for (const v of variants) {
  const dir = path.join('dist', v, 'assets')
  if (!fs.existsSync(dir)) continue
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'))
  const all = Buffer.concat(files.map((f) => fs.readFileSync(path.join(dir, f))))
  sizes[v] = {files, raw: all.length, gzip: gz(all), brotli: br(all)}
}
fs.writeFileSync('dist/sizes.json', JSON.stringify(sizes, null, 1))
console.table(Object.fromEntries(Object.entries(sizes).map(([k, s]) => [k, {raw: s.raw, gzip: s.gzip, brotli: s.brotli, chunks: s.files.length}])))
