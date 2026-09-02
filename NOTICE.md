# Notices

`@itslil/react-markdown` is an independent LilScript reimplementation of
[`react-markdown`](https://github.com/remarkjs/react-markdown). It is not
affiliated with or endorsed by the upstream authors.

Algorithms and public API names derive from that project, distributed under
the MIT license. Behavior from `html-url-attributes`,
`hast-util-to-jsx-runtime`, `property-information`, `style-to-js`,
`unist-util-visit`, and `vfile` is reimplemented in LilScript. The original
license notice is preserved in [LICENSE](./LICENSE).

The parse/rehype processor stack is built directly from hash-locked source
snapshots of `@itslil/unified`, `@itslil/remark-parse`, and
`@itslil/remark-rehype`; provenance and upstream filename mappings are recorded
in `source-graph.lock.json`.
React, its JSX runtime, and hooks remain host boundaries. Development
assertions and production no-ops are implemented in LilScript and selected by
the package's `development` export condition.

The LilScript compiler is developed separately at
[yeargun/lilscript](https://github.com/yeargun/lilscript).
