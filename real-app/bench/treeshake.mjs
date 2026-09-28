// What an app ships when it imports one export only.
import {build} from 'vite'
import fs from 'node:fs'
import zlib from 'node:zlib'
const br = (b) => zlib.brotliCompressSync(b, {params: {[zlib.constants.BROTLI_PARAM_QUALITY]: 11}}).length
const rows = {}
for (const name of ['up-url', 'lil-url']) {
  const out = await build({
    configFile: false, logLevel: 'silent',
    build: {write: false, lib: {entry: `src/treeshake/${name}.js`, formats: ['es'], fileName: name}, rollupOptions: {external: ['react', 'react/jsx-runtime', 'react-dom']}, minify: true},
  })
  const code = Buffer.from(out[0].output[0].code)
  rows[name] = {raw: code.length, brotli: br(code)}
  console.log(name.padEnd(10), 'raw', String(code.length).padStart(7), 'brotli', String(br(code)).padStart(6))
}
fs.writeFileSync('results/treeshake.json', JSON.stringify(rows, null, 1))
