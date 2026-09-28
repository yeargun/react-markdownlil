# @itslil/react-markdown

[`react-markdown@10.1.0`](https://github.com/remarkjs/react-markdown) rewritten in LilScript. This is **not** the official package.

**Site:** [yeargun.github.io/react-markdownlil/](https://yeargun.github.io/react-markdownlil/): every library of the stack against its original, the real-app measurements below, and a playground.

```sh
npm install @itslil/react-markdown react
```

It is a drop-in replacement: change the import and keep the remark and rehype
plugins you already install from npm. Or keep every import as it is and install
it under react-markdown's name:

```sh
npm install react-markdown@npm:@itslil/react-markdown
```

Checked that way (2026-09-28): react-markdown 10.1.0's own test suite,
`test.jsx` unmodified, gives the same result against this package as against
react-markdown itself (86 pass, and the one that fails for both asserts an older
React error message). The public API is the same: `Markdown` (default),
`MarkdownAsync`, `MarkdownHooks` and `defaultUrlTransform`, and the TypeScript
types `Options`, `Components`, `ExtraProps`, `UrlTransform`, `AllowElement` and
`HooksOptions` are identical to upstream's, not only compatible.

```js
import Markdown from "@itslil/react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

<Markdown
  remarkPlugins={[remarkGfm, remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {source}
</Markdown>
```

`remark-gfm`, `remark-math`, `rehype-katex`, `rehype-raw`, `rehype-highlight`,
`rehype-slug` and `remark-toc` from npm are checked against upstream in the
real-app test below. LilScript ports of the plugins exist too
(`@itslil/remark-gfm`, `@itslil/remark-math`, `@itslil/rehype-katex`,
`@itslil/remark-breaks`): use `@itslil/remark-gfm` 4.0.3, `@itslil/remark-math`
6.0.2 and `@itslil/rehype-katex` 7.0.3 or later, which match upstream; the
earlier 4.0.2 and 7.0.2 builds have the differences listed under *Known
differences*.

The processor uses the exact LilScript sources from `@itslil/unified@11.0.7`,
`@itslil/remark-parse@11.0.3`, and `@itslil/remark-rehype@11.1.6`. They are
hash-locked in `source-graph.lock.json` and compiled with this package as one
static LilScript graph, before code generation and optimization.
HAST-to-JSX conversion, property schemas, inline-style parsing, tree traversal,
VFile behavior, @ungap/structured-clone (with its fallback for runtimes that have
no `structuredClone`), and development assertions are implemented in the shipped
LilScript source rather than delegated to their JavaScript packages.
The processor and renderer share one in-graph VFile constructor. Runtime plugin
functions remain dynamic unified boundaries. React and `react/jsx-runtime` are
the only runtime imports of the browser and worker builds; the Node build also
imports `node:path`, `node:process` and `node:url`, as upstream's vfile does under
the `node` condition.

<!-- real-app:start -->
<!-- Written by real-app/scripts/summarize.mjs from real-app/results; do not edit by hand. -->
## In a real app

The same React app, built with Vite once per markdown stack and driven by Playwright ([`real-app/`](real-app/)).

- **−3.1 KB** JavaScript the app ships, Brotli-11 (react-markdown alone)
- **−12.4%** render time, react-markdown's README, warm (Chromium)
- **−7.5%** main-thread time streaming a 10 KB answer (Chromium)
- **0** differences in 1,354 CommonMark and GFM spec examples and 2,125 named references, Chromium and Firefox

### What the app ships

All JavaScript of the app, React 19.2.0 included: Vite 8.3.1 production build (Rolldown + Oxc minifier), one chunk, Brotli-11. "Markdown adds" is the difference to the same app without a markdown library.

| Stack | raw | gzip-9 | Brotli-11 | markdown adds | vs react-markdown |
|---|---:|---:|---:|---:|---:|
| App without markdown (baseline) | 193,483 | 60,172 | 51,950 | — | — |
| react-markdown 10.1.0 | 310,588 | 94,972 | 82,134 | 30,184 | — |
| @itslil/react-markdown | 285,625 | 91,318 | 79,001 | 27,051 | −3,133 B (−10.4% of what markdown adds) |
| react-markdown + remark-gfm 4.0.1 | 348,442 | 105,566 | 90,991 | 39,041 | — |
| @itslil/react-markdown + remark-gfm (npm) | 327,385 | 103,204 | 89,252 | 37,302 | −1,739 B (−4.5% of what markdown adds) |
| @itslil/react-markdown + @itslil/remark-gfm 4.0.3 | 317,909 | 101,777 | 88,171 | 36,221 | −2,820 B (−7.2% of what markdown adds) |
| react-markdown + remark-gfm, remark-math, rehype-katex | 627,629 | 187,225 | 157,237 | 105,287 | — |
| @itslil/react-markdown + the same npm plugins | 624,659 | 190,652 | 159,620 | 107,670 | +2,383 B (+2.3% of what markdown adds) |
| @itslil/react-markdown + @itslil/remark-gfm, remark-math, rehype-katex (4.0.3, 6.0.2, 7.0.3) | 617,612 | 190,385 | 159,757 | 107,807 | +2,520 B (+2.4% of what markdown adds) |

### Time to markdown on screen (Chromium)

A fresh browser context per load; the app fetches react-markdown's README and renders it on start. Median of 12 loads per variant, variants interleaved round by round; "faster in" counts the rounds the port won. Mobile is Lighthouse's preset: 4× CPU slowdown, 150 ms RTT, 1.6 Mbit/s. Differences under about 3% (desktop) and 2% (mobile) are within the run-to-run noise of this host.

| Stack | desktop, upstream | desktop, @itslil | Δ | mobile, upstream | mobile, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| App without markdown | 64.7 ms | — | — | 884 ms | — | — |
| react-markdown alone | 149.8 ms | 151.6 ms | +2 ms (faster in 8/12) | 1341 ms | 1330 ms | −11 ms (faster in 7/12) |
| + remark-gfm (npm), drop-in | 164.2 ms | 164.8 ms | +1 ms (faster in 6/12) | 1436 ms | 1432 ms | −4 ms (faster in 6/12) |
| + @itslil/remark-gfm 4.0.3 | 164.2 ms | 169.1 ms | +5 ms (faster in 6/12) | 1436 ms | 1439 ms | +3 ms (faster in 5/12) |
| + gfm, math, KaTeX (npm), drop-in | 191.4 ms | 204.3 ms | +13 ms (faster in 3/12) | 1877 ms | 1890 ms | +14 ms (faster in 5/12) |
| + @itslil gfm, math, KaTeX (npm builds) | 191.4 ms | 214.4 ms | +23 ms (faster in 2/12) | 1877 ms | 1902 ms | +25 ms (faster in 5/12) |

### Rendering, react-markdown alone (Chromium)

Warm medians on 5 fresh pages per variant, variants interleaved round by round. Pipeline is the component body (parse, plugins, hast, React elements); mount adds React's render and the DOM commit.

| Document | pipeline, upstream | pipeline, @itslil | Δ | mount, upstream | mount, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| short reply (307 B) | 0.30 ms | 0.29 ms | −3.3% | 0.40 ms | 0.38 ms | −6.8% |
| chat answer (3.3 KB) | 1.52 ms | 1.44 ms | −5.6% | 1.71 ms | 1.69 ms | −1.0% |
| remark-gfm's README (15 KB) | 10.7 ms | 9.59 ms | −10.2% | 11.0 ms | 9.94 ms | −9.6% |
| react-markdown's README (26 KB) | 16.9 ms | 14.8 ms | −12.4% | 18.6 ms | 17.0 ms | −8.8% |
| unified's README (49 KB) | 32.3 ms | 29.3 ms | −9.1% | 34.1 ms | 31.3 ms | −8.4% |
| CommonMark spec (205 KB) | 110 ms | 100.0 ms | −8.7% | 110 ms | 103 ms | −6.4% |
| chat history, 40 messages | — | — | — | 7.48 ms | 7.80 ms | +4.3% |

### Rendering at 4× CPU slowdown (Chromium)

The same, with the CPU slowed four times (a mid-range phone).

| Document | pipeline, upstream | pipeline, @itslil | Δ | mount, upstream | mount, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| short reply (307 B) | 1.61 ms | 1.44 ms | −10.9% | 1.76 ms | 2.14 ms | +21.6% |
| chat answer (3.3 KB) | 10.3 ms | 9.40 ms | −8.5% | 8.59 ms | 8.04 ms | −6.3% |
| remark-gfm's README (15 KB) | 48.5 ms | 45.0 ms | −7.4% | 54.6 ms | 52.3 ms | −4.1% |
| react-markdown's README (26 KB) | 78.9 ms | 74.2 ms | −6.0% | 83.7 ms | 81.3 ms | −2.9% |
| unified's README (49 KB) | 162 ms | 158 ms | −2.1% | 171 ms | 176 ms | +2.6% |
| CommonMark spec (205 KB) | 497 ms | 450 ms | −9.4% | 508 ms | 474 ms | −6.6% |
| chat history, 40 messages | — | — | — | 39.6 ms | 40.4 ms | +2.1% |

### Rendering with plugins (Chromium)

Pipeline only, warm medians. The npm plugins on both sides, then the @itslil plugin builds on npm.

| Stack | document | upstream | @itslil | Δ |
|---|---:|---:|---:|---:|
| + remark-gfm (npm), drop-in | chat answer (3.3 KB) | 2.76 ms | 2.87 ms | +4.0% |
| + remark-gfm (npm), drop-in | react-markdown's README (26 KB) | 23.7 ms | 22.1 ms | −6.8% |
| + remark-gfm (npm), drop-in | CommonMark spec (205 KB) | 154 ms | 151 ms | −2.4% |
| + @itslil/remark-gfm 4.0.3 | chat answer (3.3 KB) | 2.76 ms | 2.57 ms | −7.0% |
| + @itslil/remark-gfm 4.0.3 | react-markdown's README (26 KB) | 23.7 ms | 20.9 ms | −11.7% |
| + @itslil/remark-gfm 4.0.3 | CommonMark spec (205 KB) | 154 ms | 150 ms | −2.5% |
| + gfm, math, KaTeX (npm), drop-in | chat answer (3.3 KB) | 3.00 ms | 2.79 ms | −7.0% |
| + gfm, math, KaTeX (npm), drop-in | react-markdown's README (26 KB) | 26.1 ms | 23.2 ms | −10.9% |
| + gfm, math, KaTeX (npm), drop-in | math notes (2 KB, 20 formulas) | 23.0 ms | 16.8 ms | −26.7% |
| + @itslil gfm, math, KaTeX (npm builds) | chat answer (3.3 KB) | 3.00 ms | 2.55 ms | −14.9% |
| + @itslil gfm, math, KaTeX (npm builds) | react-markdown's README (26 KB) | 26.1 ms | 21.3 ms | −18.5% |
| + @itslil gfm, math, KaTeX (npm builds) | math notes (2 KB, 20 formulas) | 23.0 ms | 16.8 ms | −26.8% |

### Streaming an answer, as a chat UI does (Chromium)

The growing message is re-rendered after every 12 characters (flushSync, so each update is measured whole). Total main-thread time for the whole answer; p95 is per update.

| Stack | stream | upstream, total | @itslil, total | Δ | p95 per update (upstream / @itslil) |
|---|---:|---:|---:|---:|---:|
| react-markdown alone | chat answer, 3.3 KB · 277 updates | 226 ms | 224 ms | −1.1% | 1.58 / 1.47 ms |
| react-markdown alone | long answer, 10 KB · 834 updates | 3613 ms | 3343 ms | −7.5% | 7.58 / 7.21 ms |
| react-markdown alone | chat answer, 3.3 KB · 277 updates · 4× CPU | 1124 ms | 1034 ms | −7.9% | 7.94 / 7.08 ms |
| + remark-gfm (npm), drop-in | long answer, 10 KB · 834 updates | 5544 ms | 5228 ms | −5.7% | 12.52 / 11.66 ms |
| + @itslil/remark-gfm 4.0.3 | long answer, 10 KB · 834 updates | 5544 ms | 5050 ms | −8.9% | 12.52 / 11.25 ms |
| + gfm, math, KaTeX (npm), drop-in | long answer, 10 KB · 834 updates | 5908 ms | 5744 ms | −2.8% | 13.19 / 12.70 ms |

### Where the time goes (Chromium)

Timing plugins at both ends of the unified pipeline split one render: parse (micromark + mdast-util-from-markdown), mdast → hast (remark-rehype, mdast-util-to-hast and any plugins), and hast → React elements (hast-util-to-jsx-runtime). Allocation is sampled by V8, collected objects included.

| Stack | document | parse | mdast → hast | hast → React | allocated per render |
|---|---:|---:|---:|---:|---:|
| react-markdown | react-markdown's README (26 KB) | 18.3 ms | 1.32 ms | 1.32 ms | 13.6 MB |
| @itslil/react-markdown | react-markdown's README (26 KB) | 16.9 ms | 0.58 ms | 0.44 ms | 12.2 MB |
| react-markdown | CommonMark spec (205 KB) | 101 ms | 5.53 ms | 7.07 ms |  |
| @itslil/react-markdown | CommonMark spec (205 KB) | 98.9 ms | 2.34 ms | 2.34 ms |  |
| react-markdown + remark-gfm | react-markdown's README (26 KB) | 23.2 ms | 1.23 ms | 1.30 ms | 17.2 MB |
| @itslil/react-markdown + remark-gfm | react-markdown's README (26 KB) | 23.7 ms | 0.63 ms | 0.51 ms | 15.6 MB |

### Firefox 153.0

The same app and harness in Firefox (no CPU throttling; Firefox has no DevTools protocol for it).

| Measure | upstream | @itslil | Δ |
|---|---:|---:|---:|
| Markdown on screen, desktop load | 270.3 ms | 278.9 ms | +9 ms (faster in 3/8) |
| Pipeline, chat answer (3.3 KB) | 2.60 ms | 2.48 ms | −4.6% |
| Pipeline, react-markdown's README (26 KB) | 30.3 ms | 29.6 ms | −2.3% |
| Pipeline, CommonMark spec (205 KB) | 205 ms | 188 ms | −8.6% |
| Pipeline + remark-gfm, react-markdown's README (26 KB) | 38.8 ms | 36.1 ms | −6.9% |
| Streaming the 10 KB answer, total | 5937 ms | 5752 ms | −3.1% |
| Streaming with remark-gfm, total | 8530 ms | 7444 ms | −12.7% |

### Same output

Each case is rendered by react-markdown and by @itslil/react-markdown in the same page (the production builds) and the DOM is compared. Plugin setups: none, npm remark-gfm, npm gfm + math + KaTeX, rehype-raw, a docs setup (remark-toc, rehype-slug, rehype-highlight), custom components, and allowedElements/urlTransform/skipHtml.

| Suite | cases | setups | result |
|---|---:|---:|---:|
| CommonMark 0.31.2 spec | 652 examples | 5 × 2 browsers | 0 differ |
| GFM spec + extensions (cmark-gfm 0.29.0.gfm.13) | 702 examples | 3 × 2 browsers | 0 differ |
| Named character references | 2,125 names in text, links, titles and code | 1 × 2 browsers | 0 differ |
| Real documents (READMEs, CommonMark spec, chat, math) | 7 documents | 7 × 2 browsers | 0 differ |
| Named references through the Node builds (SSR, then hydration) | 2,125 names | Node | 0 differ |
| Seeded fuzz, browser | 3,000 documents | 2 browsers | 0 differ |
| Seeded fuzz with Unicode spaces, Node | 20,000 documents | Node | 0 differ |
| MarkdownHooks with an async plugin | fallback, then the result | 2 browsers | same |
| @itslil/remark-gfm 4.0.3 (npm), under either component | 702 examples | 2 browsers | 0 differ |

### Where it runs without a DOM

Each package bundled with the export conditions of the runtime, then run where there is no document; the edge row renders under a process whose cwd throws, as Next.js's edge sandbox has. Upstream resolves decode-named-character-reference's table and vfile's shims in worker and edge runtimes and node:path, node:process and node:url under node; the port resolves the build made of the same pair.

| Runtime (conditions) | react-markdown | @itslil/react-markdown | file resolved |
|---|---:|---:|---:|
| Node (node, import) | renders | renders | dist/react-markdown.esm.js |
| Cloudflare Workers (workerd, worker, browser) | renders | renders | dist/react-markdown.worker.js |
| Next.js and Vercel edge (edge-light, browser), with the edge process | renders | renders | dist/react-markdown.worker.js |
| Deno (deno, node) | renders | renders | dist/react-markdown.esm.js |
| React Native (Metro) | renders | renders | dist/react-markdown.worker.js |

### Known differences

None in behavior: every case above renders the same (1,354 spec examples, 23,000 fuzz documents, 2,125 named references twice, 5 runtimes). What differs is below.

- **Size, not behavior: one module, not tree-shakeable.** An app that imports only defaultUrlTransform ships 30,246 B Brotli with the port and 264 B with upstream.
- **Size, not behavior: KaTeX stacks ship a little more.** With npm rehype-katex the app is +2,383 B Brotli: rehype-katex's hastscript brings property-information, which the port also carries compiled in.
- **Not measured: Safari/WebKit.** Playwright's WebKit needs system libraries the measuring host does not have.

Measured 2026-09-28 on an Azure Standard_B8als_v2 (8 vCPU, burstable) with Playwright 1.62.1: Chromium 151.0.7922.34, Firefox 153.0; React 19.2.0, Vite 8.3.1; react-markdown 10.1.0 against @itslil/react-markdown packed from this repository, plugins from npm. Reproduce: cd real-app && npm run setup && npm run build && npm run correctness && npm run fuzz && npm run edge && npm run perf && npm run report.
<!-- real-app:end -->

## Builds and sizes

Every file in `dist/` is written by the LilScript compiler (`24968659`); the build
adds only a license banner, the React imports, the `development` flag and, for
CommonJS, `module.exports` in place of the export clause. No minifier runs after
the compiler.

| File | Conditions | Brotli-11 | gzip-9 | raw |
|---|---|---:|---:|---:|
| `dist/react-markdown.browser.js` | `browser` | 28,473 | 32,339 | 98,862 |
| `dist/react-markdown.worker.js` | `edge-light`, `react-native`, `worker`, `workerd`, `convex`, any runtime without `node` | 37,059 | 43,222 | 119,255 |
| `dist/react-markdown.esm.js` | `node` (Node, Deno, Bun) | 36,399 | 42,483 | 117,324 |
| `dist/react-markdown.cjs` | `node` with `require` | 36,412 | 42,505 | 117,375 |
| `dist/react-markdown.closed.js` | `./closed` | 39,877 | 46,823 | 136,666 |

Upstream's graph resolves two condition maps, and the package resolves the same
pair. decode-named-character-reference decodes named character references
through the document under `browser` (`index.dom.js`) and with its 2,125-entry
table everywhere else; vfile imports `node:path`, `node:process` and `node:url`
under `node` and its own small shims everywhere else. So the browser build is the
document and the shims, the worker build is the table and the shims (Cloudflare
Workers, Next.js and Vercel edge, React Native, web workers), and the Node build
is the table and the Node modules. Under `development` each is the same program
with devlop's assertions on (`*.development.js`, `*.development.cjs`).
`test/environments.test.mjs` bundles upstream and this package with each
runtime's conditions and compares what a plugin sees of the file: the working
directory, every path getter and setter, file URLs and the errors they throw.
The bars are upstream's browser graph (esbuild, React external) minified:

| Official browser graph | Brotli-11 | gzip-9 | raw |
|---|---:|---:|---:|
| Git source (`44d2e4a`) + Terser 5.51.2, passes 3 (strongest) | 31,280 | 35,092 | 117,688 |
| npm package + Terser 5.51.2 | 31,405 | 35,248 | 118,297 |
| npm package + Oxc (Vite 8.2.1) | 31,725 | 35,470 | 117,592 |
| npm package + esbuild 0.28.1 | 32,786 | 36,663 | 118,575 |

The browser build is 2,807 B (9.0%) smaller in Brotli-11 than the strongest bar,
2,753 B in gzip-9 and 18,730 B raw. The four compiles of one build take about
23.5 s on this Azure B8als_v2 host (shared, 1-minute load 2.1), 7.0 s of it for the
browser build. `npm run record:release` re-measures everything the site
shows (`site/results.json`).

Every library of the stack (unified, micromark, mdast-util-from-markdown,
remark-parse, mdast-util-to-hast, remark-rehype and the plugins) is compared with
its original on the site: [the stack table](https://yeargun.github.io/react-markdownlil/#stack).

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
