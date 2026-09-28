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

<!-- real-app:start -->
<!-- Written by real-app/scripts/summarize.mjs from real-app/results; do not edit by hand. -->
## In a real app

The same React app, built with Vite once per markdown stack and driven by Playwright ([`real-app/`](real-app/)).

- **−4.3 KB** JavaScript the app ships, Brotli-11 (react-markdown alone)
- **−13.2%** render time, react-markdown's README, warm (Chromium)
- **−13.1%** main-thread time streaming a 10 KB answer (Chromium)
- **0** differences in 1,354 CommonMark and GFM spec examples and 2,125 named references, Chromium and Firefox

### What the app ships

All JavaScript of the app, React 19.2.0 included: Vite 8.3.1 production build (Rolldown + Oxc minifier), one chunk, Brotli-11. "Markdown adds" is the difference to the same app without a markdown library.

| Stack | raw | gzip-9 | Brotli-11 | markdown adds | vs react-markdown |
|---|---:|---:|---:|---:|---:|
| App without markdown (baseline) | 193,483 | 60,172 | 51,950 | — | — |
| react-markdown 10.1.0 | 310,588 | 94,972 | 82,134 | 30,184 | — |
| @itslil/react-markdown | 282,260 | 89,957 | 77,787 | 25,837 | −4,347 B (−14.4% of what markdown adds) |
| react-markdown + remark-gfm 4.0.1 | 348,442 | 105,566 | 90,991 | 39,041 | — |
| @itslil/react-markdown + remark-gfm (npm) | 323,962 | 101,823 | 88,056 | 36,106 | −2,935 B (−7.5% of what markdown adds) |
| @itslil/react-markdown + @itslil/remark-gfm 4.0.2 | 315,577 | 100,769 | 87,288 | 35,338 | −3,703 B (−9.5% of what markdown adds) |
| react-markdown + remark-gfm, remark-math, rehype-katex | 627,629 | 187,225 | 157,237 | 105,287 | — |
| @itslil/react-markdown + the same npm plugins | 621,258 | 189,231 | 158,491 | 106,541 | +1,254 B (+1.2% of what markdown adds) |
| @itslil/react-markdown + @itslil/remark-gfm, remark-math, rehype-katex (4.0.2, 6.0.1, 7.0.2) | 613,103 | 188,470 | 158,544 | 106,594 | +1,307 B (+1.2% of what markdown adds) |

### Time to markdown on screen (Chromium)

A fresh browser context per load; the app fetches react-markdown's README and renders it on start. Median of 12 loads per variant, variants interleaved round by round; "faster in" counts the rounds the port won. Mobile is Lighthouse's preset: 4× CPU slowdown, 150 ms RTT, 1.6 Mbit/s. Differences under about 3% (desktop) and 2% (mobile) are within the run-to-run noise of this host.

| Stack | desktop, upstream | desktop, @itslil | Δ | mobile, upstream | mobile, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| App without markdown | 60.7 ms | — | — | 877 ms | — | — |
| react-markdown alone | 144.8 ms | 145.8 ms | +1 ms (faster in 9/12) | 1320 ms | 1306 ms | −14 ms (faster in 7/12) |
| + remark-gfm (npm), drop-in | 161.4 ms | 161.5 ms | +0 ms (faster in 7/12) | 1408 ms | 1407 ms | −1 ms (faster in 9/12) |
| + @itslil/remark-gfm 4.0.2 | 161.4 ms | 167.5 ms | +6 ms (faster in 5/12) | 1408 ms | 1422 ms | +14 ms (faster in 6/12) |
| + gfm, math, KaTeX (npm), drop-in | 187.6 ms | 194.3 ms | +7 ms (faster in 4/12) | 1873 ms | 1868 ms | −6 ms (faster in 7/12) |
| + @itslil gfm, math, KaTeX (npm builds) | 187.6 ms | 196.1 ms | +8 ms (faster in 2/12) | 1873 ms | 1889 ms | +15 ms (faster in 2/12) |

### Rendering, react-markdown alone (Chromium)

Warm medians on 5 fresh pages per variant, variants interleaved round by round. Pipeline is the component body (parse, plugins, hast, React elements); mount adds React's render and the DOM commit.

| Document | pipeline, upstream | pipeline, @itslil | Δ | mount, upstream | mount, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| short reply (307 B) | 0.29 ms | 0.29 ms | −3.4% | 0.41 ms | 0.35 ms | −12.3% |
| chat answer (3.3 KB) | 1.53 ms | 1.38 ms | −9.3% | 1.71 ms | 1.55 ms | −9.2% |
| remark-gfm's README (15 KB) | 10.7 ms | 9.59 ms | −10.5% | 11.1 ms | 10.1 ms | −9.7% |
| react-markdown's README (26 KB) | 17.0 ms | 14.7 ms | −13.2% | 17.9 ms | 16.2 ms | −9.2% |
| unified's README (49 KB) | 31.9 ms | 27.5 ms | −13.8% | 34.7 ms | 31.9 ms | −7.9% |
| CommonMark spec (205 KB) | 107 ms | 97.6 ms | −8.5% | 109 ms | 99.2 ms | −8.7% |
| chat history, 40 messages | — | — | — | 7.72 ms | 7.27 ms | −5.9% |

### Rendering at 4× CPU slowdown (Chromium)

The same, with the CPU slowed four times (a mid-range phone).

| Document | pipeline, upstream | pipeline, @itslil | Δ | mount, upstream | mount, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| short reply (307 B) | 1.40 ms | 1.37 ms | −2.5% | 1.73 ms | 1.92 ms | +11.3% |
| chat answer (3.3 KB) | 9.28 ms | 8.09 ms | −12.8% | 7.68 ms | 7.35 ms | −4.4% |
| remark-gfm's README (15 KB) | 43.4 ms | 39.2 ms | −9.7% | 50.9 ms | 45.4 ms | −10.7% |
| react-markdown's README (26 KB) | 69.0 ms | 62.6 ms | −9.2% | 75.3 ms | 67.9 ms | −9.7% |
| unified's README (49 KB) | 135 ms | 138 ms | +1.9% | 156 ms | 142 ms | −9.3% |
| CommonMark spec (205 KB) | 463 ms | 406 ms | −12.3% | 473 ms | 433 ms | −8.4% |
| chat history, 40 messages | — | — | — | 40.4 ms | 33.3 ms | −17.7% |

### Rendering with plugins (Chromium)

Pipeline only, warm medians. The npm plugins on both sides, then the @itslil plugin builds on npm.

| Stack | document | upstream | @itslil | Δ |
|---|---:|---:|---:|---:|
| + remark-gfm (npm), drop-in | chat answer (3.3 KB) | 2.76 ms | 2.69 ms | −2.5% |
| + remark-gfm (npm), drop-in | react-markdown's README (26 KB) | 23.2 ms | 20.8 ms | −10.3% |
| + remark-gfm (npm), drop-in | CommonMark spec (205 KB) | 154 ms | 140 ms | −9.7% |
| + @itslil/remark-gfm 4.0.2 | chat answer (3.3 KB) | 2.76 ms | 3.14 ms | +13.8% |
| + @itslil/remark-gfm 4.0.2 | react-markdown's README (26 KB) | 23.2 ms | 23.8 ms | +2.7% |
| + @itslil/remark-gfm 4.0.2 | CommonMark spec (205 KB) | 154 ms | 176 ms | +13.8% |
| + gfm, math, KaTeX (npm), drop-in | chat answer (3.3 KB) | 2.93 ms | 2.86 ms | −2.6% |
| + gfm, math, KaTeX (npm), drop-in | react-markdown's README (26 KB) | 23.9 ms | 22.3 ms | −7.0% |
| + gfm, math, KaTeX (npm), drop-in | math notes (2 KB, 20 formulas) | 21.7 ms | 16.6 ms | −23.7% |
| + @itslil gfm, math, KaTeX (npm builds) | chat answer (3.3 KB) | 2.93 ms | 3.09 ms | +5.5% |
| + @itslil gfm, math, KaTeX (npm builds) | react-markdown's README (26 KB) | 23.9 ms | 23.9 ms | −0.0% |
| + @itslil gfm, math, KaTeX (npm builds) | math notes (2 KB, 20 formulas) | 21.7 ms | 8.27 ms | −61.9% |

### Streaming an answer, as a chat UI does (Chromium)

The growing message is re-rendered after every 12 characters (flushSync, so each update is measured whole). Total main-thread time for the whole answer; p95 is per update.

| Stack | stream | upstream, total | @itslil, total | Δ | p95 per update (upstream / @itslil) |
|---|---:|---:|---:|---:|---:|
| react-markdown alone | chat answer, 3.3 KB · 277 updates | 225 ms | 210 ms | −6.7% | 1.57 / 1.41 ms |
| react-markdown alone | long answer, 10 KB · 834 updates | 3660 ms | 3181 ms | −13.1% | 7.60 / 6.63 ms |
| react-markdown alone | chat answer, 3.3 KB · 277 updates · 4× CPU | 1009 ms | 905 ms | −10.3% | 7.04 / 6.45 ms |
| + remark-gfm (npm), drop-in | long answer, 10 KB · 834 updates | 5346 ms | 4855 ms | −9.2% | 11.91 / 10.52 ms |
| + @itslil/remark-gfm 4.0.2 | long answer, 10 KB · 834 updates | 5346 ms | 5711 ms | +6.8% | 11.91 / 12.57 ms |
| + gfm, math, KaTeX (npm), drop-in | long answer, 10 KB · 834 updates | 5595 ms | 5525 ms | −1.3% | 12.30 / 12.09 ms |

### Where the time goes (Chromium)

Timing plugins at both ends of the unified pipeline split one render: parse (micromark + mdast-util-from-markdown), mdast → hast (remark-rehype, mdast-util-to-hast and any plugins), and hast → React elements (hast-util-to-jsx-runtime). Allocation is sampled by V8, collected objects included.

| Stack | document | parse | mdast → hast | hast → React | allocated per render |
|---|---:|---:|---:|---:|---:|
| react-markdown | react-markdown's README (26 KB) | 14.7 ms | 1.16 ms | 1.21 ms | 13.5 MB |
| @itslil/react-markdown | react-markdown's README (26 KB) | 14.4 ms | 0.48 ms | 0.42 ms | 11.8 MB |
| react-markdown | CommonMark spec (205 KB) | 89.5 ms | 4.99 ms | 6.66 ms |  |
| @itslil/react-markdown | CommonMark spec (205 KB) | 90.1 ms | 1.89 ms | 2.18 ms |  |
| react-markdown + remark-gfm | react-markdown's README (26 KB) | 21.6 ms | 1.18 ms | 1.25 ms | 17.2 MB |
| @itslil/react-markdown + remark-gfm | react-markdown's README (26 KB) | 22.4 ms | 0.50 ms | 0.46 ms | 15.3 MB |

### Firefox 153.0

The same app and harness in Firefox (no CPU throttling; Firefox has no DevTools protocol for it).

| Measure | upstream | @itslil | Δ |
|---|---:|---:|---:|
| Markdown on screen, desktop load | 244.7 ms | 240.7 ms | −4 ms (faster in 13/20) |
| Pipeline, chat answer (3.3 KB) | 2.53 ms | 2.36 ms | −6.7% |
| Pipeline, react-markdown's README (26 KB) | 28.0 ms | 26.1 ms | −6.8% |
| Pipeline, CommonMark spec (205 KB) | 189 ms | 174 ms | −7.8% |
| Pipeline + remark-gfm, react-markdown's README (26 KB) | 36.1 ms | 34.5 ms | −4.3% |
| Streaming the 10 KB answer, total | 5550 ms | 5199 ms | −6.3% |
| Streaming with remark-gfm, total | 7516 ms | 7144 ms | −5.0% |

### Same output

Each case is rendered by react-markdown and by @itslil/react-markdown in the same page (the production builds) and the DOM is compared. Plugin setups: none, npm remark-gfm, npm gfm + math + KaTeX, rehype-raw, a docs setup (remark-toc, rehype-slug, rehype-highlight), custom components, and allowedElements/urlTransform/skipHtml.

| Suite | cases | setups | result |
|---|---:|---:|---:|
| CommonMark 0.31.2 spec | 652 examples | 5 × 2 browsers | 0 differ |
| GFM spec + extensions (cmark-gfm 0.29.0.gfm.13) | 702 examples | 3 × 2 browsers | 0 differ |
| Named character references | 2,125 names in text, links, titles and code | 1 × 2 browsers | 0 differ |
| Real documents (READMEs, CommonMark spec, chat, math) | 7 documents | 7 × 2 browsers | 0 differ |
| Named references through the Node builds (SSR, then hydration) | 2,125 names | Node | 0 differ |
| Seeded fuzz, browser | 3,000 documents | 2 browsers | 52 differ, all explained below |
| Seeded fuzz with Unicode spaces, Node | 20,000 documents | Node | 2,232 differ, all explained below |
| MarkdownHooks with an async plugin | fallback, then the result | 2 browsers | same |
| @itslil/remark-gfm 4.0.2 (npm), under either component | GFM spec | 2 browsers | 1 example differs |

### Where it runs without a DOM

Each package bundled with the export conditions of the runtime, then run where there is no document. Worker and edge runtimes resolve the build with the entity table, as upstream's decode-named-character-reference does; the browser build decodes through the document.

| Runtime (conditions) | react-markdown | @itslil/react-markdown | file resolved |
|---|---:|---:|---:|
| Node (import) | renders | renders | dist/react-markdown.esm.js |
| Cloudflare Workers (workerd, worker, browser) | renders | renders | dist/react-markdown.esm.js |
| Deno | renders | renders | dist/react-markdown.esm.js |
| React Native (Metro) | renders | renders | dist/react-markdown.esm.js |

### Known differences

Every fuzz difference (2,284 of 23,000 documents) has one of the first two causes; none is left unexplained.

- **A Unicode space in a code-fence language.** ```js title="a" with a non-breaking (or other Unicode) space gives class="language-js title=…" where upstream gives language-js: the port splits the info string at ASCII whitespace, upstream at JavaScript's \s. Only the class differs (2,242 fuzz documents).
- **micromark-core-commonmark 2.0.4 (published 2026-09-26).** Emphasis next to an underscore or an escaped asterisk (a**_b_**c, foo*_bar_*baz, \**x**) follows 2.0.3, which this package's source graph pins; a fresh install of react-markdown resolves 2.0.4 (42 fuzz documents, 6 of them with the code-fence difference as well).
- **One module, not tree-shakeable.** An app that imports only defaultUrlTransform ships 29,034 B Brotli with the port and 264 B with upstream.
- **KaTeX stacks ship a little more.** With npm rehype-katex the app is +1,254 B Brotli: rehype-katex's hastscript brings property-information, which the port also carries compiled in.
- **Earlier @itslil plugin builds.** @itslil/remark-gfm 4.0.2 links an e-mail address right after a slash (GFM extensions example 19), and @itslil/rehype-katex 7.0.2 bundles an older KaTeX port that drops the &lt;mspace> of \quad; @itslil/remark-gfm 4.0.3 and @itslil/rehype-katex 7.0.3 match upstream, and the npm plugins work unchanged with @itslil/react-markdown.
- **Next.js edge runtime.** A page with runtime = "edge" fails at request time: the compiled VFile calls process.cwd(), which that runtime replaces with a function that throws, where upstream's vfile uses its browser shim. Plain React apps, server rendering with react-dom/server, Cloudflare Workers, Deno and React Native are not affected.
- **Not measured: Safari/WebKit.** Playwright's WebKit needs system libraries the measuring host does not have.

Measured 2026-09-28 on an Azure Standard_B8als_v2 (8 vCPU, burstable) with Playwright 1.62.1: Chromium 151.0.7922.34, Firefox 153.0; React 19.2.0, Vite 8.3.1; react-markdown 10.1.0 against @itslil/react-markdown packed from this repository, plugins from npm. Reproduce: cd real-app && npm run setup && npm run build && npm run correctness && npm run fuzz && npm run edge && npm run perf && npm run report.
<!-- real-app:end -->

## Builds and sizes

Every file in `dist/` is written by the LilScript compiler (`24968659`); the build
adds only a license banner, the React imports, the `development` flag and, for
CommonJS, `module.exports` in place of the export clause. No minifier runs after
the compiler.

| File | Condition | Brotli-11 | gzip-9 | raw |
|---|---|---:|---:|---:|
| `dist/react-markdown.browser.js` | `browser` | 27,250 | 30,919 | 95,307 |
| `dist/react-markdown.esm.js` | `import` (Node), `worker`, `deno`, `react-native` | 35,953 | 41,885 | 115,843 |
| `dist/react-markdown.cjs` | `require` | 35,934 | 41,908 | 115,903 |
| `dist/react-markdown.closed.js` | `./closed` | 39,417 | 46,347 | 136,925 |

The browser build decodes named character references through the document, as
upstream's browser graph does (`decode-named-character-reference`'s
`index.dom.js`); the Node builds carry the 2,125-entry entity table, as
upstream's Node graph does. Worker and edge runtimes (Cloudflare Workers,
Next.js edge, Deno, React Native) resolve the table build, as upstream's do:
they have no document. The bars are upstream's browser graph (esbuild,
React external) minified:

| Official browser graph | Brotli-11 | gzip-9 | raw |
|---|---:|---:|---:|
| Git source (`44d2e4a`) + Terser 5.51.2, passes 3 (strongest) | 30,950 | 34,789 | 117,068 |
| npm package + Terser 5.51.2 | 31,082 | 34,924 | 117,674 |
| npm package + Oxc (Vite 8.2.1) | 31,413 | 35,166 | 116,998 |
| npm package + esbuild 0.28.1 | 32,530 | 36,331 | 118,006 |

The browser build is 3,700 B (12.0%) smaller in Brotli-11 than the strongest bar,
3,870 B in gzip-9 and 21,691 B raw. The three compiles of one build take about
23.3 s on this Azure B8als_v2 host (shared, 1-minute load 8.5), 6.2 s of it for
the browser build. `npm run record:release` re-measures everything the site
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
