// Builds the speed-comparison inputs: site/perf/* (what the browser benchmark loads,
// on Pages and under Playwright) and bench/artifacts/* (Node-only original bundles).
//
// Every lane is the exact shipped file. The only edit is the import specifier:
// "react" and "react/jsx-runtime" point at one vendored production React so both
// sides render through the same copy.
import {build} from 'esbuild'
import {minify} from 'terser'
import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {dirname, join, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const perf = join(root, 'site/perf')
const nodeArtifacts = join(root, 'bench/artifacts')
// site/perf also holds the hand-written harness (runner.js, bench.html): replace
// only what this script generates.
for (const file of ['vendor.mjs', 'plugins-original.mjs', 'plugins-lil.mjs', 'original-browser.mjs', 'lil-browser.mjs', 'original-portable.mjs', 'lil-portable.mjs']) {
  await rm(join(perf, file), {force: true})
}
await rm(join(perf, 'corpus'), {recursive: true, force: true})
await mkdir(join(perf, 'corpus'), {recursive: true})
await mkdir(nodeArtifacts, {recursive: true})

const production = {'process.env.NODE_ENV': '"production"'}
const external = ['react', 'react/jsx-runtime']

// The original, bundled the way the size comparison bundles it (esbuild + the
// same Terser options), but for a given set of package conditions.
async function original(platform, conditions) {
  const result = await build({
    entryPoints: [join(root, 'node_modules/react-markdown/index.js')],
    bundle: true, write: false, format: 'esm', target: 'es2020',
    platform, conditions, external, define: production, logLevel: 'warning',
  })
  const source = result.outputFiles[0].text
  return (await minify(source, {module: true, compress: {passes: 3}, mangle: {toplevel: true}, format: {comments: false}})).code
}

const specifiers = /(\bfrom\s*)(["'])(react|react\/jsx-runtime)\2/g
const imported = new Set()
function toVendor(code) {
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']react(?:\/jsx-runtime)?["']/g)) {
    for (const part of m[1].split(',')) imported.add(part.trim().split(/\s+as\s+/)[0])
  }
  return code.replace(specifiers, '$1"./vendor.mjs"')
}

const lanes = {
  'original-portable': await readFile(join(root, 'site/comparison-artifacts/original-terser.mjs'), 'utf8'),
  'lil-portable': await readFile(join(root, 'site/comparison-artifacts/lilscript-brotli.mjs'), 'utf8'),
  'original-browser': await original('browser', ['browser', 'production']),
  'lil-browser': await readFile(join(root, 'dist/react-markdown.browser.js'), 'utf8'),
}
for (const [name, code] of Object.entries(lanes)) await writeFile(join(perf, `${name}.mjs`), toVendor(code))
await writeFile(join(nodeArtifacts, 'original-node.mjs'), await original('node', ['node', 'production']))

// Plugins are bundled, not minified, for both sides: they are not what this page
// measures, so they ship as their packages ship.
async function plugins(file, names) {
  const entry = `export {default as gfm} from '${names.gfm}'\nexport {default as math} from '${names.math}'\nexport {default as katex} from '${names.katex}'\n`
  await build({
    stdin: {contents: entry, resolveDir: root, loader: 'js'},
    bundle: true, format: 'esm', target: 'es2020', platform: 'browser',
    conditions: ['browser', 'production'], define: production, logLevel: 'warning',
    outfile: join(perf, file),
  })
}
await plugins('plugins-original.mjs', {gfm: 'remark-gfm', math: 'remark-math', katex: 'rehype-katex'})
await plugins('plugins-lil.mjs', {gfm: '@itslil/remark-gfm', math: '@itslil/remark-math', katex: '@itslil/rehype-katex'})

// One production React for every lane, exporting exactly what the lanes import.
const runtime = new Set(['Fragment', 'jsx', 'jsxs'])
const fromReact = [...imported].filter(name => !runtime.has(name)).sort()
const fromRuntime = [...imported].filter(name => runtime.has(name)).sort()
await build({
  stdin: {
    contents: [
      `export {${[...fromReact, 'createElement'].join(', ')}} from 'react'`,
      `export {${fromRuntime.join(', ')}} from 'react/jsx-runtime'`,
      `export {renderToString} from 'react-dom/server.browser'`,
    ].join('\n'),
    resolveDir: root, loader: 'js',
  },
  bundle: true, format: 'esm', target: 'es2020', platform: 'browser', minify: true,
  define: production, logLevel: 'warning', outfile: join(perf, 'vendor.mjs'),
})

await cp(join(root, 'bench/corpus'), join(perf, 'corpus'), {recursive: true})
console.log(`perf inputs: ${Object.keys(lanes).join(', ')}; vendor exports ${[...fromReact, ...fromRuntime].join(', ')}`)
