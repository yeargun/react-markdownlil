// Node lanes: what `import Markdown from ...` resolves to for each side.
export const lanes = {
  'original-npm': {
    side: 'original', pair: 'reference', label: 'react-markdown@10.1.0 as installed from npm (unbundled)',
    module: 'react-markdown', plugins: {gfm: 'remark-gfm', math: 'remark-math', katex: 'rehype-katex'},
  },
  'original-node': {
    side: 'original', pair: 'node', label: 'react-markdown@10.1.0 bundled for Node (node conditions, Terser)',
    module: './artifacts/original-node.mjs', plugins: {gfm: 'remark-gfm', math: 'remark-math', katex: 'rehype-katex'},
  },
  'lil-node': {
    side: 'lilscript', pair: 'node', label: '@itslil/react-markdown Node entry (dist/react-markdown.esm.js)',
    module: '../dist/react-markdown.esm.js', plugins: {gfm: '@itslil/remark-gfm', math: '@itslil/remark-math', katex: '@itslil/rehype-katex'},
  },
  'original-portable': {
    side: 'original', pair: 'portable', label: 'react-markdown@10.1.0 portable bundle (Terser), as in the size comparison',
    module: '../site/comparison-artifacts/original-terser.mjs', plugins: {gfm: 'remark-gfm', math: 'remark-math', katex: 'rehype-katex'},
  },
  'lil-portable': {
    side: 'lilscript', pair: 'portable', label: '@itslil/react-markdown portable Brotli build, as in the size comparison',
    module: '../site/comparison-artifacts/lilscript-brotli.mjs', plugins: {gfm: '@itslil/remark-gfm', math: '@itslil/remark-math', katex: '@itslil/rehype-katex'},
  },
}

// Which plugins each corpus document is rendered with.
export const docs = {
  chat: [],
  readme: [],
  large: [],
  gfm: ['gfm'],
  math: ['gfm', 'math', 'katex'],
}

export async function loadLane(name) {
  const lane = lanes[name]
  const Markdown = (await import(lane.module)).default
  const plugins = {}
  for (const [k, spec] of Object.entries(lane.plugins)) plugins[k] = (await import(spec)).default
  return {Markdown, plugins}
}

export function propsFor(doc, plugins) {
  const use = docs[doc]
  return {
    remarkPlugins: use.filter(k => k !== 'katex').map(k => plugins[k]),
    rehypePlugins: use.includes('katex') ? [plugins.katex] : [],
  }
}
