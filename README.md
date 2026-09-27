# @itslil/react-markdown

[`react-markdown@10.1.0`](https://github.com/remarkjs/react-markdown) rewritten in LilScript. This is **not** the official package.

**Site:** [yeargun.github.io/react-markdownlil/](https://yeargun.github.io/react-markdownlil/)

```sh
npm install @itslil/react-markdown react
```

Plugins from the same stack:

```sh
npm install @itslil/remark-gfm @itslil/remark-breaks @itslil/remark-math @itslil/rehype-katex @itslil/katex
```

```js
import Markdown from "@itslil/react-markdown"
import remarkGfm from "@itslil/remark-gfm"
import remarkMath from "@itslil/remark-math"
import rehypeKatex from "@itslil/rehype-katex"

<Markdown
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {source}
</Markdown>
```

The processor uses the exact LilScript sources from `@itslil/unified@11.0.6`,
`@itslil/remark-parse@11.0.2`, and `@itslil/remark-rehype@11.1.4`. They are
hash-locked in `source-graph.lock.json` and compiled with this package as one
static LilScript graph, before code generation and optimization.
HAST-to-JSX conversion, property schemas, inline-style parsing, tree traversal,
VFile behavior, and development assertions are implemented in the shipped
LilScript source rather than delegated to their JavaScript packages.
The processor and renderer share one in-graph VFile constructor. Runtime plugin
functions remain dynamic unified boundaries. React and `react/jsx-runtime` are
the only runtime imports in the ESM and CJS artifacts.

## Builds and sizes

Every file in `dist/` is written by the LilScript compiler (`24968659`); the build
adds only a license banner, the React imports, the `development` flag and, for
CommonJS, `module.exports` in place of the export clause. No minifier runs after
the compiler.

| File | Condition | Brotli-11 | gzip-9 | raw |
|---|---|---:|---:|---:|
| `dist/react-markdown.browser.js` | `browser` | 27,250 | 30,919 | 95,307 |
| `dist/react-markdown.esm.js` | `import` (Node) | 35,953 | 41,885 | 115,843 |
| `dist/react-markdown.cjs` | `require` | 35,934 | 41,908 | 115,903 |
| `dist/react-markdown.closed.js` | `./closed` | 39,417 | 46,347 | 136,925 |

The browser build decodes named character references through the document, as
upstream's browser graph does (`decode-named-character-reference`'s
`index.dom.js`); the Node builds carry the 2,125-entry entity table, as
upstream's Node graph does. The bars are upstream's browser graph (esbuild,
React external) minified:

| Official browser graph | Brotli-11 | gzip-9 | raw |
|---|---:|---:|---:|
| Git source (`44d2e4a`) + Terser 5.51.2, passes 3 (strongest) | 30,950 | 34,789 | 117,068 |
| npm package + Terser 5.51.2 | 31,082 | 34,924 | 117,674 |
| npm package + Oxc (Vite 8.2.1) | 31,413 | 35,166 | 116,998 |
| npm package + esbuild 0.28.1 | 32,530 | 36,331 | 118,006 |

The browser build is 3,700 B (12.0%) smaller in Brotli-11 than the strongest bar,
3,870 B in gzip-9 and 21,691 B raw. The previous release's browser build was
27,312 B Brotli-11 (compiler `aa2052f0`, 2026-09-24). The three compiles of one
build take about 23.3 s on this Azure B8als_v2 host (shared, 1-minute load 8.5),
6.2 s of it for the browser build; the previous release took 5.34 s per build.
`npm run record:release` re-measures everything the site shows
(`site/results.json`).

## Source graph

`source-graph.lock.json` records sibling versions, Git revisions, upstream
filenames, and SHA-256 hashes for all 69 imported LilScript modules. The
materialized `src/graph/` files are checked before every compilation.

```sh
npm run graph:lock         # intentionally repin siblings and refresh snapshots
npm run graph:sync         # refresh snapshots from the existing lock
npm run check:graph
npm run build
npm run check:reproducible
npm run measure:graph
npm run record:release     # sizes, compile times, suite and throughput for the site
```
