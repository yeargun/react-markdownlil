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

The processor is `@itslil/unified` + `@itslil/remark-parse` + `@itslil/remark-rehype`.
