import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const variant = process.env.VARIANT || 'up'
const entry = process.env.ENTRY || 'index.html'

// Records every module that ends up in the bundle with its rendered size, so a
// build can be attributed (e.g. which micromark copies an app carries).
function moduleReport() {
  return {
    name: 'module-report',
    generateBundle(_, bundle) {
      const chunks = []
      for (const [file, item] of Object.entries(bundle)) {
        if (item.type !== 'chunk') continue
        chunks.push({
          file,
          size: item.code.length,
          modules: Object.entries(item.modules)
            .map(([id, m]) => ({id: id.replace(process.cwd() + '/', ''), rendered: m.renderedLength}))
            .sort((a, b) => b.rendered - a.rendered),
        })
      }
      fs.mkdirSync(path.resolve('dist', variant), {recursive: true})
      fs.writeFileSync(path.resolve('dist', variant, 'modules.json'), JSON.stringify(chunks, null, 1))
    },
  }
}

export default defineConfig({
  base: `/v/${variant}/`,
  publicDir: false,
  plugins: [react(), moduleReport()],
  resolve: {alias: {'@variant': path.resolve('src/variants', variant + '.js')}},
  build: {
    outDir: `dist/${variant}`,
    emptyOutDir: false,
    rollupOptions: {input: path.resolve(entry)},
    reportCompressedSize: false,
  },
})
