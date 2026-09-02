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
`@itslil/remark-parse@11.0.1`, and `@itslil/remark-rehype@11.1.3`. They are
hash-locked in `source-graph.lock.json` and compiled with this package as one
static LilScript graph, before code generation and optimization.
HAST-to-JSX conversion, property schemas, inline-style parsing, tree traversal,
VFile behavior, and development assertions are implemented in the shipped
LilScript source rather than delegated to their JavaScript packages.
The processor and renderer share one in-graph VFile constructor. Runtime plugin
functions remain dynamic unified boundaries. React and `react/jsx-runtime` are
the only runtime imports in the ESM and CJS artifacts.

## Source graph

`source-graph.lock.json` records sibling versions, Git revisions, upstream
filenames, and SHA-256 hashes for all 68 imported LilScript modules. The
materialized `src/graph/` files are checked before every compilation.

```sh
npm run graph:lock         # intentionally repin siblings and refresh snapshots
npm run graph:sync         # refresh snapshots from the existing lock
npm run check:graph
npm run build
npm run check:reproducible
npm run measure:graph
```
