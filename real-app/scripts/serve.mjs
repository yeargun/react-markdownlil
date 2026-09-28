// Static server for the built variants: /v/<variant>/ -> dist/<variant>/,
// /corpus and /cases -> public/. Serves Brotli (quality 11, cached) when the
// browser accepts it, as a CDN would.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const root = path.resolve(import.meta.dirname, '..')
const types = {'.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml'}
const cache = new Map()

export function serve(port = 0) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x')
    let file
    const m = url.pathname.match(/^\/v\/([^/]+)\/(.*)$/)
    if (m) file = path.join(root, 'dist', m[1], m[2] || 'index.html')
    else if (url.pathname.startsWith('/corpus/') || url.pathname.startsWith('/cases/')) file = path.join(root, 'public', url.pathname)
    else if (url.pathname === '/') file = path.join(root, 'dist', 'index.html')
    if (!file || !file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end('not found')
      return
    }
    const ext = path.extname(file)
    // Cross-origin isolation: performance.now() gets 5 us resolution instead of 100 us.
    const headers = {'content-type': types[ext] || 'application/octet-stream', 'cache-control': 'no-store',
      'cross-origin-opener-policy': 'same-origin', 'cross-origin-embedder-policy': 'require-corp', 'cross-origin-resource-policy': 'same-origin'}
    let body = fs.readFileSync(file)
    if (/\bbr\b/.test(req.headers['accept-encoding'] || '') && /\.(js|css|html|json|md|svg)$/.test(ext)) {
      const key = file + ':' + fs.statSync(file).mtimeMs
      if (!cache.has(key)) cache.set(key, zlib.brotliCompressSync(body, {params: {[zlib.constants.BROTLI_PARAM_QUALITY]: 11}}))
      body = cache.get(key)
      headers['content-encoding'] = 'br'
    }
    headers['content-length'] = body.length
    res.writeHead(200, headers).end(body)
  })
  return new Promise((resolve) => server.listen(port, '0.0.0.0', () => resolve(server)))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 4173)
  await serve(port)
  console.log(`serving on http://localhost:${port}/v/<variant>/  (variants in dist/)`)
}
