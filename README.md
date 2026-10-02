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
- **−12.5%** render time, react-markdown's README, warm (Chromium)
- **−8.9%** main-thread time streaming a 10 KB answer (Chromium)
- **0** differences in 1,354 CommonMark and GFM spec examples and 2,125 named references, Chromium and Firefox

### What the app ships

All JavaScript of the app, React 19.2.0 included: Vite 8.3.1 production build (Rolldown + Oxc minifier), one chunk, Brotli-11. "Markdown adds" is the difference to the same app without a markdown library.

| Stack | raw | gzip-9 | Brotli-11 | markdown adds | vs react-markdown |
|---|---:|---:|---:|---:|---:|
| App without markdown (baseline) | 193,483 | 60,172 | 51,950 | — | — |
| react-markdown 10.1.0 | 310,588 | 94,972 | 82,134 | 30,184 | — |
| @itslil/react-markdown | 285,640 | 91,293 | 79,004 | 27,054 | −3,130 B (−10.4% of what markdown adds) |
| react-markdown + remark-gfm 4.0.1 | 348,442 | 105,566 | 90,991 | 39,041 | — |
| @itslil/react-markdown + remark-gfm (npm) | 327,396 | 103,171 | 89,138 | 37,188 | −1,853 B (−4.7% of what markdown adds) |
| @itslil/react-markdown + @itslil/remark-gfm 4.0.3 | 317,924 | 101,738 | 88,032 | 36,082 | −2,959 B (−7.6% of what markdown adds) |
| react-markdown + remark-gfm, remark-math, rehype-katex | 627,629 | 187,225 | 157,237 | 105,287 | — |
| @itslil/react-markdown + the same npm plugins | 624,672 | 190,643 | 159,468 | 107,518 | +2,231 B (+2.1% of what markdown adds) |
| @itslil/react-markdown + @itslil/remark-gfm, remark-math, rehype-katex (4.0.3, 6.0.2, 7.0.3) | 617,625 | 190,361 | 159,672 | 107,722 | +2,435 B (+2.3% of what markdown adds) |

### Time to markdown on screen (Chromium)

A fresh browser context per load; the app fetches react-markdown's README and renders it on start. Median of 12 loads per variant, variants interleaved round by round; "faster in" counts the rounds the port won. Mobile is Lighthouse's preset: 4× CPU slowdown, 150 ms RTT, 1.6 Mbit/s. Differences under about 3% (desktop) and 2% (mobile) are within the run-to-run noise of this host.

| Stack | desktop, upstream | desktop, @itslil | Δ | mobile, upstream | mobile, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| App without markdown | 64.7 ms | — | — | 882 ms | — | — |
| react-markdown alone | 154.8 ms | 152.5 ms | −2 ms (faster in 8/12) | 1341 ms | 1343 ms | +2 ms (faster in 7/12) |
| + remark-gfm (npm), drop-in | 164.4 ms | 176.8 ms | +12 ms (faster in 5/12) | 1471 ms | 1454 ms | −17 ms (faster in 6/12) |
| + @itslil/remark-gfm 4.0.3 | 164.4 ms | 169.8 ms | +5 ms (faster in 5/12) | 1471 ms | 1445 ms | −26 ms (faster in 6/12) |
| + gfm, math, KaTeX (npm), drop-in | 201.0 ms | 219.0 ms | +18 ms (faster in 2/12) | 1872 ms | 1887 ms | +15 ms (faster in 2/12) |
| + @itslil gfm, math, KaTeX (npm builds) | 201.0 ms | 207.6 ms | +7 ms (faster in 4/12) | 1872 ms | 1903 ms | +30 ms (faster in 5/12) |

### Rendering, react-markdown alone (Chromium)

Warm medians on 5 fresh pages per variant, variants interleaved round by round. Pipeline is the component body (parse, plugins, hast, React elements); mount adds React's render and the DOM commit.

| Document | pipeline, upstream | pipeline, @itslil | Δ | mount, upstream | mount, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| short reply (307 B) | 0.31 ms | 0.30 ms | −3.2% | 0.41 ms | 0.39 ms | −4.9% |
| chat answer (3.3 KB) | 1.62 ms | 1.47 ms | −9.3% | 1.78 ms | 1.75 ms | −1.8% |
| remark-gfm's README (15 KB) | 11.2 ms | 9.55 ms | −14.5% | 11.6 ms | 10.5 ms | −9.2% |
| react-markdown's README (26 KB) | 17.4 ms | 15.3 ms | −12.5% | 18.7 ms | 17.1 ms | −8.8% |
| unified's README (49 KB) | 33.1 ms | 30.2 ms | −8.9% | 37.6 ms | 33.8 ms | −9.9% |
| CommonMark spec (205 KB) | 119 ms | 110 ms | −8.0% | 120 ms | 107 ms | −10.9% |
| chat history, 40 messages | — | — | — | 8.20 ms | 7.88 ms | −3.8% |

### Rendering at 4× CPU slowdown (Chromium)

The same, with the CPU slowed four times (a mid-range phone).

| Document | pipeline, upstream | pipeline, @itslil | Δ | mount, upstream | mount, @itslil | Δ |
|---|---:|---:|---:|---:|---:|---:|
| short reply (307 B) | 1.52 ms | 1.48 ms | −2.3% | 1.72 ms | 1.95 ms | +13.7% |
| chat answer (3.3 KB) | 9.74 ms | 8.81 ms | −9.6% | 8.44 ms | 9.34 ms | +10.6% |
| remark-gfm's README (15 KB) | 50.5 ms | 43.7 ms | −13.6% | 58.0 ms | 50.5 ms | −13.0% |
| react-markdown's README (26 KB) | 79.5 ms | 73.6 ms | −7.4% | 86.2 ms | 84.2 ms | −2.4% |
| unified's README (49 KB) | 169 ms | 151 ms | −10.2% | 185 ms | 160 ms | −13.4% |
| CommonMark spec (205 KB) | 503 ms | 463 ms | −8.1% | 507 ms | 474 ms | −6.6% |
| chat history, 40 messages | — | — | — | 44.3 ms | 39.7 ms | −10.4% |

### Rendering with plugins (Chromium)

Pipeline only, warm medians. The npm plugins on both sides, then the @itslil plugin builds on npm.

| Stack | document | upstream | @itslil | Δ |
|---|---:|---:|---:|---:|
| + remark-gfm (npm), drop-in | chat answer (3.3 KB) | 2.81 ms | 2.77 ms | −1.4% |
| + remark-gfm (npm), drop-in | react-markdown's README (26 KB) | 24.4 ms | 22.2 ms | −9.0% |
| + remark-gfm (npm), drop-in | CommonMark spec (205 KB) | 161 ms | 157 ms | −1.9% |
| + @itslil/remark-gfm 4.0.3 | chat answer (3.3 KB) | 2.81 ms | 2.55 ms | −9.4% |
| + @itslil/remark-gfm 4.0.3 | react-markdown's README (26 KB) | 24.4 ms | 21.4 ms | −12.4% |
| + @itslil/remark-gfm 4.0.3 | CommonMark spec (205 KB) | 161 ms | 156 ms | −2.5% |
| + gfm, math, KaTeX (npm), drop-in | chat answer (3.3 KB) | 3.15 ms | 3.31 ms | +5.0% |
| + gfm, math, KaTeX (npm), drop-in | react-markdown's README (26 KB) | 24.5 ms | 22.4 ms | −8.3% |
| + gfm, math, KaTeX (npm), drop-in | math notes (2 KB, 20 formulas) | 22.4 ms | 17.6 ms | −21.3% |
| + @itslil gfm, math, KaTeX (npm builds) | chat answer (3.3 KB) | 3.15 ms | 2.65 ms | −15.9% |
| + @itslil gfm, math, KaTeX (npm builds) | react-markdown's README (26 KB) | 24.5 ms | 22.4 ms | −8.6% |
| + @itslil gfm, math, KaTeX (npm builds) | math notes (2 KB, 20 formulas) | 22.4 ms | 16.8 ms | −24.7% |

### Streaming an answer, as a chat UI does (Chromium)

The growing message is re-rendered after every 12 characters (flushSync, so each update is measured whole). Total main-thread time for the whole answer; p95 is per update.

| Stack | stream | upstream, total | @itslil, total | Δ | p95 per update (upstream / @itslil) |
|---|---:|---:|---:|---:|---:|
| react-markdown alone | chat answer, 3.3 KB · 277 updates | 256 ms | 237 ms | −7.5% | 1.78 / 1.70 ms |
| react-markdown alone | long answer, 10 KB · 834 updates | 3850 ms | 3507 ms | −8.9% | 8.34 / 7.34 ms |
| react-markdown alone | chat answer, 3.3 KB · 277 updates · 4× CPU | 1127 ms | 1018 ms | −9.7% | 8.07 / 6.84 ms |
| + remark-gfm (npm), drop-in | long answer, 10 KB · 834 updates | 5839 ms | 5321 ms | −8.9% | 13.28 / 12.09 ms |
| + @itslil/remark-gfm 4.0.3 | long answer, 10 KB · 834 updates | 5839 ms | 5101 ms | −12.6% | 13.28 / 11.26 ms |
| + gfm, math, KaTeX (npm), drop-in | long answer, 10 KB · 834 updates | 5832 ms | 5711 ms | −2.1% | 13.15 / 12.86 ms |

### Where the time goes (Chromium)

Timing plugins at both ends of the unified pipeline split one render: parse (micromark + mdast-util-from-markdown), mdast → hast (remark-rehype, mdast-util-to-hast and any plugins), and hast → React elements (hast-util-to-jsx-runtime). Allocation is sampled by V8, collected objects included.

| Stack | document | parse | mdast → hast | hast → React | allocated per render |
|---|---:|---:|---:|---:|---:|
| react-markdown | react-markdown's README (26 KB) | 17.9 ms | 1.37 ms | 1.34 ms | 13.6 MB |
| @itslil/react-markdown | react-markdown's README (26 KB) | 19.0 ms | 0.60 ms | 0.47 ms | 12.1 MB |
| react-markdown | CommonMark spec (205 KB) | 106 ms | 5.66 ms | 7.40 ms |  |
| @itslil/react-markdown | CommonMark spec (205 KB) | 106 ms | 2.55 ms | 2.38 ms |  |
| react-markdown + remark-gfm | react-markdown's README (26 KB) | 23.1 ms | 1.25 ms | 1.36 ms | 17.2 MB |
| @itslil/react-markdown + remark-gfm | react-markdown's README (26 KB) | 22.2 ms | 0.54 ms | 0.48 ms | 15.6 MB |

### Firefox 153.0

The same app and harness in Firefox (no CPU throttling; Firefox has no DevTools protocol for it).

| Measure | upstream | @itslil | Δ |
|---|---:|---:|---:|
| Markdown on screen, desktop load | 258.9 ms | 277.5 ms | +19 ms (faster in 3/8) |
| Pipeline, chat answer (3.3 KB) | 2.56 ms | 2.42 ms | −5.5% |
| Pipeline, react-markdown's README (26 KB) | 30.0 ms | 26.7 ms | −11.0% |
| Pipeline, CommonMark spec (205 KB) | 205 ms | 186 ms | −9.3% |
| Pipeline + remark-gfm, react-markdown's README (26 KB) | 40.0 ms | 38.4 ms | −4.1% |
| Streaming the 10 KB answer, total | 6076 ms | 5495 ms | −9.6% |
| Streaming with remark-gfm, total | 8025 ms | 7634 ms | −4.9% |

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

- **Size, not behavior: one module, not tree-shakeable.** An app that imports only defaultUrlTransform ships 30,278 B Brotli with the port and 264 B with upstream.
- **Size, not behavior: KaTeX stacks ship a little more.** With npm rehype-katex the app is +2,231 B Brotli: rehype-katex's hastscript brings property-information, which the port also carries compiled in.
- **Not measured: Safari/WebKit.** Playwright's WebKit needs system libraries the measuring host does not have.

Measured 2026-09-28 on an Azure Standard_B8als_v2 (8 vCPU, burstable) with Playwright 1.62.1: Chromium 151.0.7922.34, Firefox 153.0; React 19.2.0, Vite 8.3.1; react-markdown 10.1.0 against @itslil/react-markdown packed from this repository, plugins from npm. Reproduce: cd real-app && npm run setup && npm run build && npm run correctness && npm run fuzz && npm run edge && npm run perf && npm run report.
<!-- real-app:end -->

## Comparison with the original

See [COMPARISON.md](COMPARISON.md) for current raw-, gzip- and Brotli-objective builds, minified upstream comparisons, build times and validation.

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
