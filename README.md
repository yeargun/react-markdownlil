# @itslil/react-markdown

react-markdown 10.1.0 implemented in LilScript. React stays external; the Markdown processor graph is compiled from the hash-locked LilScript sources in source-graph.lock.json.

[Live comparison and examples](https://yeargun.github.io/react-markdownlil/) · [Checked repository package](https://yeargun.github.io/react-markdownlil/downloads/package.tgz) · [Package build evidence](https://yeargun.github.io/react-markdownlil/package-build.json)

```sh
npm install @itslil/react-markdown react
```

```js
import Markdown from "@itslil/react-markdown"
import remarkGfm from "remark-gfm"

<Markdown remarkPlugins={[remarkGfm]}>{source}</Markdown>
```

The repository download contains the checked build of this checkout. npm publication is independent; an npm install can resolve a different published snapshot.

## Comparison with the original

[Current raw, gzip and Brotli results and build times](COMPARISON.md) compare three independently targeted LilScript compilations with the smallest recorded original result for each codec from Terser, esbuild and Oxc. Exact bytes, configuration hashes, source inputs and commands are downloadable from the comparison page. Package formats and browser application bundles have different boundaries from the standalone comparison entries.

## Speed

[Render speed](https://yeargun.github.io/react-markdownlil/#speed) is measured against the original on identical input, and every build must produce byte-identical HTML before it is timed. Each build runs in its own fresh browser context. There are five documents, from a chat reply to 222 KB of READMEs, with and without remark-gfm, remark-math and rehype-katex. Against the original, the browser entry renders 10–25% faster in Chromium 151 and 2–19% faster in Firefox 153, and the package loads faster in both. The page also covers Node server rendering, and anyone can run the same harness in their own browser from it. `bench/run-all.sh` reruns everything; `bench/browser.mjs` and `bench/node.mjs` define the method.

## Compatibility and scope

The public exports are Markdown (default), MarkdownAsync, MarkdownHooks and defaultUrlTransform. Conditional exports select Node path/process/URL behavior, browser entity decoding, or a DOM-free worker build. Production and development entries preserve their respective assertion behavior. Standard remark and rehype plugins remain supported. The current package is checked against the upstream React test suite, TypeScript declarations, CommonMark cases and named-entity data; the comparison artifacts use the portable production entry with React external.

## Rebuild and verify

Set `LILSCRIPT_COMPILER` to the current LilScript executable. Builds use one compiler job at a time.

```sh
npm ci
npm run build
npm test
npm run check:site
```

See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md) for licensing and upstream attribution.
