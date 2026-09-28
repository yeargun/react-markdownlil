# Real-app test

The same small React 19 app (a docs and chat markdown viewer), built with Vite 8
once per markdown stack, so every number is what an app actually ships and runs.
Playwright loads each build in Chromium and Firefox, compares the DOM the two
components produce, and measures load, render and streaming.

| Variant | Stack |
|---|---|
| `none` | no markdown library: React and the app shell, the baseline |
| `up` / `lil` | `react-markdown@10.1.0` / `@itslil/react-markdown` (packed from this repository) |
| `up-gfm` / `lil-upgfm` | + npm `remark-gfm` on both |
| `lil-gfm` | the port with `@itslil/remark-gfm` from npm |
| `up-full` / `lil-upfull` | + npm `remark-gfm`, `remark-math`, `rehype-katex` on both |
| `lil-full` | the port with the `@itslil` gfm, math and KaTeX plugins from npm |

`upstream-203/` is a control: upstream react-markdown resolved against
micromark-core-commonmark 2.0.3, the version this package's source graph pins.

```sh
npm run setup        # npm pack of the repository, npm install, Playwright browsers, corpus
npm run build        # one Vite production build per variant + the comparison page; dist/sizes.json
npm run serve        # http://localhost:4173/ : every variant, DevTools work as on any site
npm run correctness  # DOM of both components: CommonMark 652, GFM 702, 2,125 entities, 3,000 fuzz documents, 7 documents, 10 plugin setups
npm run fuzz         # 20,000 Node fuzz documents, every difference classified
npm run edge         # Cloudflare Workers, Next.js edge, Deno, React Native: export conditions without a DOM
npm run perf         # load (desktop, mobile preset), render, streaming, stages; Chromium then Firefox (about 45 minutes)
npm run report       # results/REPORT.md, ../site/real-app.json and the README section
```

Each page exposes `window.bench` (`process`, `mount`, `stream`, `stages`,
`html`) and `compare.html` exposes `window.cmp`. The corpus is written by
`scripts/prepare-corpus.mjs`: the CommonMark spec from `commonmark-spec`, the
GFM spec downloaded from cmark-gfm `0.29.0.gfm.13` (CC-BY-SA 4.0, not vendored),
READMEs from `node_modules`, and two hand-written documents in `corpus-src/`.

Timing rules: a fresh browser context or page per sample, the variants
interleaved round by round, medians of same-round differences, CPU throttling
through the DevTools protocol, `performance.now()` at 5 µs (the server sends
cross-origin isolation headers). The host is a burstable Azure VM, so run
nothing else during `npm run perf`. WebKit needs system libraries that host
lacks and is not measured.
