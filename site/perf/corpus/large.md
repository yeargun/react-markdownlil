# [![unified][logo]][site]

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**unified** lets you inspect and transform content with plugins.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [Overview](#overview)
* [API](#api)
  * [`processor()`](#processor)
  * [`processor.compiler`](#processorcompiler)
  * [`processor.data([key[, value]])`](#processordatakey-value)
  * [`processor.freeze()`](#processorfreeze)
  * [`processor.parse(file)`](#processorparsefile)
  * [`processor.parser`](#processorparser)
  * [`processor.process(file[, done])`](#processorprocessfile-done)
  * [`processor.processSync(file)`](#processorprocesssyncfile)
  * [`processor.run(tree[, file][, done])`](#processorruntree-file-done)
  * [`processor.runSync(tree[, file])`](#processorrunsynctree-file)
  * [`processor.stringify(tree[, file])`](#processorstringifytree-file)
  * [`processor.use(plugin[, options])`](#processoruseplugin-options)
  * [`CompileResultMap`](#compileresultmap)
  * [`CompileResults`](#compileresults)
  * [`Compiler`](#compiler)
  * [`Data`](#data)
  * [`Parser`](#parser)
  * [`Pluggable`](#pluggable)
  * [`PluggableList`](#pluggablelist)
  * [`Plugin`](#plugin)
  * [`PluginTuple`](#plugintuple)
  * [`Preset`](#preset)
  * [`ProcessCallback`](#processcallback)
  * [`Processor`](#processor-1)
  * [`RunCallback`](#runcallback)
  * [`Settings`](#settings)
  * [`TransformCallback`](#transformcallback)
  * [`Transformer`](#transformer)
* [Types](#types)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [Sponsor](#sponsor)
* [Acknowledgments](#acknowledgments)
* [License](#license)

## What is this?

unified is two things:

* **unified** is a collective of 500+ free and open source packages that work
  with content as structured data (ASTs)
* `unified` (this project) is the core package, used in 1.3m+ projects on GH,
  to process content with plugins

Several ecosystems are built on unified around different kinds of content.
Notably, [remark][] (markdown), [rehype][] (HTML), and [retext][] (natural
language).
These ecosystems can be connected together.

* for more about us, see [`unifiedjs.com`][site]
* for updates, see [@unifiedjs][twitter] on Twitter
* for questions, see [support][]
* to help, see [contribute][] and [sponsor][] below

## When should I use this?

In some cases, you are already using unified.
For example, it’s used in MDX, Gatsby, Docusaurus, etc.
In those cases, you don’t need to add `unified` yourself but you can include
plugins into those projects.

But the real fun (for some) is to get your hands dirty and work with syntax
trees and build with it yourself.
You can create those projects, or things like Prettier, or your own site
generator.
You can connect utilities together and make your own plugins that check for
problems and transform from one thing to another.

When you are dealing with one type of content (such as markdown), you can use
the main package of that ecosystem instead (so `remark`).
When you are dealing with different kinds of content (such as markdown and
HTML), it’s recommended to use `unified` itself, and pick and choose the plugins
you need.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install unified
```

In Deno with [`esm.sh`][esmsh]:

```js
import {unified} from 'https://esm.sh/unified@11'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {unified} from 'https://esm.sh/unified@11?bundle'
</script>
```

## Use

```js
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {title: '👋🌍'})
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process('# Hello world!')

console.error(reporter(file))
console.log(String(file))
```

Yields:

```txt
no issues found
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>👋🌍</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
```

<!-- Old name: -->

<a name="description"></a>

## Overview

`unified` is an interface for processing content with syntax trees.
Syntax trees are a representation of content understandable to programs.
Those programs, called *[plugins][api-plugin]*, take these trees and inspect and
modify them.
To get to the syntax tree from text, there is a *[parser][api-parser]*.
To get from that back to text, there is a *[compiler][api-compiler]*.
This is the *[process][api-process]* of a *processor*.

```ascii
| ........................ process ........................... |
| .......... parse ... | ... run ... | ... stringify ..........|

          +--------+                     +----------+
Input ->- | Parser | ->- Syntax Tree ->- | Compiler | ->- Output
          +--------+          |          +----------+
                              X
                              |
                       +--------------+
                       | Transformers |
                       +--------------+
```

###### Processors

Processors process content.
On its own, `unified` (the root processor) doesn’t work.
It needs to be configured with plugins to work.
For example:

```js
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {title: '👋🌍'})
  .use(rehypeFormat)
  .use(rehypeStringify)
```

That processor can do different things.
It can:

* …parse markdown (`parse`)
* …turn parsed markdown into HTML and format the HTML (`run`)
* …compile HTML (`stringify`)
* …do all of the above (`process`)

Every processor implements another processor.
To create a processor, call another processor.
The new processor is configured to work the same as its ancestor.
But when the descendant processor is configured in the future it does not affect
the ancestral processor.

When processors are exposed from a module (for example, `unified` itself) they
should not be configured directly, as that would change their behavior for all
module users.
Those processors are *[frozen][api-freeze]* and they should be called to create
a new processor before they are used.

###### File

When processing a document, metadata is gathered about that document.
[`vfile`][vfile] is the file format that stores data, metadata, and messages
about files for unified and plugins.

There are several [utilities][vfile-utilities] for working with these files.

###### Syntax tree

The syntax trees used in unified are [unist][] nodes.
A tree represents a whole document and each [node][] is a plain JavaScript
object with a `type` field.
The semantics of nodes and the format of syntax trees is defined by other
projects:

* [esast][] — JavaScript
* [hast][] — HTML
* [mdast][] — markdown
* [nlcst][] — natural language
* [xast][] — XML

There are many utilities for working with trees listed in each aforementioned
project and maintained in the [`syntax-tree`][syntax-tree] organization.
These utilities are a level lower than unified itself and are building blocks
that can be used to make plugins.

<!-- Old name: -->

<a name="list-of-processors"></a>

###### Ecosystems

Around each syntax tree is an ecosystem that focusses on that particular kind
of content.
At their core, they parse text to a tree and compile that tree back to text.
They also provide plugins that work with the syntax tree, without requiring
that the end user has knowledge about that tree.

* [rehype][] (hast) — HTML
* [remark][] (mdast) — markdown
* [retext][] (nlcst) — natural language

<a name="list-of-plugins"></a>

###### Plugins

Each aforementioned ecosystem comes with a large set of plugins that you can
pick and choose from to do all kinds of things.

* [List of remark plugins][remark-plugins] ·
  [`remarkjs/awesome-remark`][awesome-remark] ·
  [`remark-plugin` topic][topic-remark-plugin]
* [List of rehype plugins][rehype-plugins] ·
  [`rehypejs/awesome-rehype`][awesome-rehype] ·
  [`rehype-plugin` topic][topic-rehype-plugin]
* [List of retext plugins][retext-plugins] ·
  [`retextjs/awesome-retext`][awesome-retext] ·
  [`retext-plugin` topic][topic-retext-plugin]

There are also a few plugins that work in any ecosystem:

* [`unified-diff`](https://github.com/unifiedjs/unified-diff)
  — ignore unrelated messages in GitHub Actions and Travis
* [`unified-infer-git-meta`](https://github.com/unifiedjs/unified-infer-git-meta)
  — infer metadata of a document from Git
* [`unified-message-control`](https://github.com/unifiedjs/unified-message-control)
  — enable, disable, and ignore messages from content

###### Configuration

Processors are configured with [plugins][api-plugin] or with the
[`data`][api-data] method.
Most plugins also accept configuration through options.
See each plugin’s readme for more info.

###### Integrations

unified can integrate with the file system through
[`unified-engine`][unified-engine].
CLI apps can be created with [`unified-args`][unified-args], Gulp plugins with
[`unified-engine-gulp`][unified-engine-gulp], and language servers with
[`unified-language-server`][unified-language-server].
A streaming interface can be created with [`unified-stream`][unified-stream].

###### Programming interface

The [API][] provided by `unified` allows multiple files to be processed and
gives access to metadata (such as lint messages):

```js
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import remarkRehype from 'remark-rehype'
import remarkRetext from 'remark-retext'
import retextEnglish from 'retext-english'
import retextEquality from 'retext-equality'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await unified()
  .use(remarkParse)
  .use(remarkPresetLintMarkdownStyleGuide)
  .use(remarkRetext, unified().use(retextEnglish).use(retextEquality))
  .use(remarkRehype)
  .use(rehypeStringify)
  .process('*Emphasis* and _stress_, you guys!')

console.error(reporter(file))
console.log(String(file))
```

Yields:

```txt
1:16-1:24 warning Emphasis should use `*` as a marker                                 emphasis-marker remark-lint
1:30-1:34 warning `guys` may be insensitive, use `people`, `persons`, `folks` instead gals-man        retext-equality

⚠ 2 warnings
```

```html
<p><em>Emphasis</em> and <em>stress</em>, you guys!</p>
```

<!-- Old name: -->

<a name="processing-between-syntaxes"></a>

###### Transforming between ecosystems

Ecosystems can be combined in two modes.

**Bridge** mode transforms the tree from one format (*origin*) to another
(*destination*).
A different processor runs on the destination tree.
Afterwards, the original processor continues with the origin tree.

**Mutate** mode also transforms the syntax tree from one format to another.
But the original processor continues transforming the destination tree.

In the previous example (“Programming interface”), `remark-retext` is used in
bridge mode: the origin syntax tree is kept after retext is done; whereas
`remark-rehype` is used in mutate mode: it sets a new syntax tree and discards
the origin tree.

The following plugins lets you combine ecosystems:

* [`remark-retext`][remark-retext] — turn markdown into natural language
* [`remark-rehype`][remark-rehype] — turn markdown into HTML
* [`rehype-retext`][rehype-retext] — turn HTML into natural language
* [`rehype-remark`][rehype-remark] — turn HTML into markdown

## API

This package exports the identifier `unified` (the root `processor`).
There is no default export.

### `processor()`

Create a new processor.

###### Returns

New *[unfrozen][api-freeze]* processor ([`processor`][api-processor]).

This processor is configured to work the same as its ancestor.
When the descendant processor is configured in the future it does not affect
the ancestral processor.

###### Example

This example shows how a new processor can be created (from `remark`) and linked
to **stdin**(4) and **stdout**(4).

```js
import process from 'node:process'
import concatStream from 'concat-stream'
import {remark} from 'remark'

process.stdin.pipe(
  concatStream(function (buf) {
    process.stdout.write(String(remark().processSync(buf)))
  })
)
```

### `processor.compiler`

Compiler to use ([`Compiler`][api-compiler], optional).

### `processor.data([key[, value]])`

Configure the processor with info available to all plugins.
Information is stored in an object.

Typically, options can be given to a specific plugin, but sometimes it makes
sense to have information shared with several plugins.
For example, a list of HTML elements that are self-closing, which is needed
during all [phases][overview].

> 👉 **Note**: setting information cannot occur on *[frozen][api-freeze]*
> processors.
> Call the processor first to create a new unfrozen processor.

> 👉 **Note**: to register custom data in TypeScript, augment the
> [`Data`][api-data] interface.

###### Signatures

* `processor = processor.data(key, value)`
* `processor = processor.data(dataset)`
* `value = processor.data(key)`
* `dataset = processor.data()`

###### Parameters

* `key` ([`keyof Data`][api-data], optional) — field to get
* `value` ([`Data[key]`][api-data]) — value to set
* `values` ([`Data`][api-data]) — values to set

###### Returns

The current processor when setting ([`processor`][api-processor]), the value at
`key` when getting ([`Data[key]`][api-data]), or the entire dataset when
getting without key ([`Data`][api-data]).

###### Example

This example show how to get and set info:

```js
import {unified} from 'unified'

const processor = unified().data('alpha', 'bravo')

processor.data('alpha') // => 'bravo'

processor.data() // => {alpha: 'bravo'}

processor.data({charlie: 'delta'})

processor.data() // => {charlie: 'delta'}
```

### `processor.freeze()`

Freeze a processor.

Frozen processors are meant to be extended and not to be configured directly.

When a processor is frozen it cannot be unfrozen.
New processors working the same way can be created by calling the processor.

It’s possible to freeze processors explicitly by calling `.freeze()`.
Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
`.stringify()`, `.process()`, or `.processSync()` are called.

###### Returns

The current processor ([`processor`][api-processor]).

###### Example

This example, `index.js`, shows how `rehype` prevents extensions to itself:

```js
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'

export const rehype = unified().use(rehypeParse).use(rehypeStringify).freeze()
```

That processor can be used and configured like so:

```js
import {rehype} from 'rehype'
import rehypeFormat from 'rehype-format'
// …

rehype()
  .use(rehypeFormat)
  // …
```

A similar looking example is broken as operates on the frozen interface.
If this behavior was allowed it would result in unexpected behavior so an error
is thrown.
**This is not valid**:

```js
import {rehype} from 'rehype'
import rehypeFormat from 'rehype-format'
// …

rehype
  .use(rehypeFormat)
  // …
```

Yields:

```txt
~/node_modules/unified/index.js:426
    throw new Error(
    ^

Error: Cannot call `use` on a frozen processor.
Create a new processor first, by calling it: use `processor()` instead of `processor`.
    at assertUnfrozen (~/node_modules/unified/index.js:426:11)
    at Function.use (~/node_modules/unified/index.js:165:5)
    …
```

### `processor.parse(file)`

Parse text to a syntax tree.

> 👉 **Note**: `parse` freezes the processor if not already
> *[frozen][api-freeze]*.

> 👉 **Note**: `parse` performs the [parse phase][overview], not the run phase
> or other phases.

###### Parameters

* `file` ([`Compatible`][vfile-compatible]) — file to parse; typically
  `string` or [`VFile`][vfile]; any value accepted as `x` in `new VFile(x)`

###### Returns

Syntax tree representing `file` ([`Node`][node]).

###### Example

This example shows how `parse` can be used to create a tree from a file.

```js
import remarkParse from 'remark-parse'
import {unified} from 'unified'

const tree = unified().use(remarkParse).parse('# Hello world!')

console.log(tree)
```

Yields:

```js
{
  type: 'root',
  children: [
    {type: 'heading', depth: 1, children: [Array], position: [Object]}
  ],
  position: {
    start: {line: 1, column: 1, offset: 0},
    end: {line: 1, column: 15, offset: 14}
  }
}
```

### `processor.parser`

Parser to use ([`Parser`][api-parser], optional).

### `processor.process(file[, done])`

Process the given file as configured on the processor.

> 👉 **Note**: `process` freezes the processor if not already
> *[frozen][api-freeze]*.

> 👉 **Note**: `process` performs the [parse, run, and stringify
> phases][overview].

###### Signatures

* `processor.process(file, done)`
* `Promise<VFile> = processor.process(file?)`

###### Parameters

* `file` ([`Compatible`][vfile-compatible], optional) — file; typically
  `string` or [`VFile`][vfile]; any value accepted as `x` in `new VFile(x)`
* `done` ([`ProcessCallback`][api-process-callback], optional) — callback

###### Returns

Nothing if `done` is given (`undefined`).
Otherwise a promise, rejected with a fatal error or resolved with the
processed file ([`Promise<VFile>`][vfile]).

The parsed, transformed, and compiled value is available at `file.value` (see
note).

> 👉 **Note**: unified typically compiles by serializing: most
> compilers return `string` (or `Uint8Array`).
> Some compilers, such as the one configured with
> [`rehype-react`][rehype-react], return other values (in this case, a React
> tree).
> If you’re using a compiler that doesn’t serialize, expect different result
> values.
>
> To register custom results in TypeScript, add them to
> [`CompileResultMap`][api-compile-result-map].

###### Example

This example shows how `process` can be used to process a file:

```js
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {title: '👋🌍'})
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process('# Hello world!')

console.log(String(file))
```

Yields:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>👋🌍</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
```

### `processor.processSync(file)`

Process the given file as configured on the processor.

An error is thrown if asynchronous transforms are configured.

> 👉 **Note**: `processSync` freezes the processor if not already
> *[frozen][api-freeze]*.

> 👉 **Note**: `processSync` performs the [parse, run, and stringify
> phases][overview].

###### Parameters

* `file` ([`Compatible`][vfile-compatible], optional) — file; typically
  `string` or [`VFile`][vfile]; any value accepted as `x` in `new VFile(x)`

###### Returns

The processed file ([`VFile`][vfile]).

The parsed, transformed, and compiled value is available at `file.value` (see
note).

> 👉 **Note**: unified typically compiles by serializing: most
> compilers return `string` (or `Uint8Array`).
> Some compilers, such as the one configured with
> [`rehype-react`][rehype-react], return other values (in this case, a React
> tree).
> If you’re using a compiler that doesn’t serialize, expect different result
> values.
>
> To register custom results in TypeScript, add them to
> [`CompileResultMap`][api-compile-result-map].

###### Example

This example shows how `processSync` can be used to process a file, if all
transformers are synchronous.

```js
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {title: '👋🌍'})
  .use(rehypeFormat)
  .use(rehypeStringify)

console.log(String(processor.processSync('# Hello world!')))
```

Yields:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>👋🌍</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
```

### `processor.run(tree[, file][, done])`

Run *[transformers][api-transformer]* on a syntax tree.

> 👉 **Note**: `run` freezes the processor if not already
> *[frozen][api-freeze]*.

> 👉 **Note**: `run` performs the [run phase][overview], not other phases.

###### Signatures

* `processor.run(tree, done)`
* `processor.run(tree, file, done)`
* `Promise<Node> = processor.run(tree, file?)`

###### Parameters

* `tree` ([`Node`][node]) — tree to transform and inspect
* `file` ([`Compatible`][vfile-compatible], optional) — file associated
  with `node`; any value accepted as `x` in `new VFile(x)`
* `done` ([`RunCallback`][api-run-callback], optional) — callback

###### Returns

Nothing if `done` is given (`undefined`).
Otherwise, a promise rejected with a fatal error or resolved with the
transformed tree ([`Promise<Node>`][node]).

###### Example

This example shows how `run` can be used to transform a tree:

```js
import remarkReferenceLinks from 'remark-reference-links'
import {unified} from 'unified'
import {u} from 'unist-builder'

const tree = u('root', [
  u('paragraph', [
    u('link', {href: 'https://example.com'}, [u('text', 'Example Domain')])
  ])
])

const changedTree = await unified().use(remarkReferenceLinks).run(tree)

console.log(changedTree)
```

Yields:

```js
{
  type: 'root',
  children: [
    {type: 'paragraph', children: [Array]},
    {type: 'definition', identifier: '1', title: '', url: undefined}
  ]
}
```

### `processor.runSync(tree[, file])`

Run *[transformers][api-transformer]* on a syntax tree.

An error is thrown if asynchronous transforms are configured.

> 👉 **Note**: `runSync` freezes the processor if not already
> *[frozen][api-freeze]*.

> 👉 **Note**: `runSync` performs the [run phase][overview], not other phases.

###### Parameters

* `tree` ([`Node`][node]) — tree to transform and inspect
* `file` ([`Compatible`][vfile-compatible], optional) — file associated
  with `node`; any value accepted as `x` in `new VFile(x)`

###### Returns

Transformed tree ([`Node`][node]).

### `processor.stringify(tree[, file])`

Compile a syntax tree.

> 👉 **Note**: `stringify` freezes the processor if not already
> *[frozen][api-freeze]*.

> 👉 **Note**: `stringify` performs the [stringify phase][overview], not the run
> phase or other phases.

###### Parameters

* `tree` ([`Node`][node]) — tree to compile
* `file` ([`Compatible`][vfile-compatible], optional) — file associated
  with `node`; any value accepted as `x` in `new VFile(x)`

###### Returns

Textual representation of the tree (`Uint8Array` or `string`, see note).

> 👉 **Note**: unified typically compiles by serializing: most compilers
> return `string` (or `Uint8Array`).
> Some compilers, such as the one configured with
> [`rehype-react`][rehype-react], return other values (in this case, a
> React tree).
> If you’re using a compiler that doesn’t serialize, expect different
> result values.
>
> To register custom results in TypeScript, add them to
> [`CompileResultMap`][api-compile-result-map].

###### Example

This example shows how `stringify` can be used to serialize a syntax tree:

```js
import {h} from 'hastscript'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'

const tree = h('h1', 'Hello world!')

const document = unified().use(rehypeStringify).stringify(tree)

console.log(document)
```

Yields:

```html
<h1>Hello world!</h1>
```

### `processor.use(plugin[, options])`

Configure the processor to use a plugin, a list of usable values, or a preset.

If the processor is already using a plugin, the previous plugin configuration
is changed based on the options that are passed in.
In other words, the plugin is not added a second time.

> 👉 **Note**: `use` cannot be called on [*frozen*][api-freeze] processors.
> Call the processor first to create a new unfrozen processor.

###### Signatures

* `processor.use(preset?)`
* `processor.use(list)`
* `processor.use(plugin[, ...parameters])`

###### Parameters

* `preset` ([`Preset`][api-preset]) — plugins and settings
* `list` ([`PluggableList`][api-pluggable-list]) — list of usable things
* `plugin` ([`Plugin`][api-plugin]) — plugin
* `parameters` (`Array<unknown>`) — configuration for `plugin`, typically a
  single options object

###### Returns

Current processor ([`processor`][api-processor]).

###### Example

There are many ways to pass plugins to `.use()`.
This example gives an overview:

```js
import {unified} from 'unified'

unified()
  // Plugin with options:
  .use(pluginA, {x: true, y: true})
  // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
  .use(pluginA, {y: false, z: true})
  // Plugins:
  .use([pluginB, pluginC])
  // Two plugins, the second with options:
  .use([pluginD, [pluginE, {}]])
  // Preset with plugins and settings:
  .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
  // Settings only:
  .use({settings: {position: false}})
```

### `CompileResultMap`

Interface of known results from compilers (TypeScript type).

Normally, compilers result in text ([`Value`][vfile-value] of `vfile`).
When you compile to something else, such as a React node (as in,
`rehype-react`), you can augment this interface to include that type.

```ts
import type {ReactNode} from 'somewhere'

declare module 'unified' {
  interface CompileResultMap {
    // Register a new result (value is used, key should match it).
    ReactNode: ReactNode
  }
}

export {} // You may not need this, but it makes sure the file is a module.
```

Use [`CompileResults`][api-compile-results] to access the values.

###### Type

```ts
interface CompileResultMap {
  // Note: if `Value` from `VFile` is changed, this should too.
  Uint8Array: Uint8Array
  string: string
}
```

### `CompileResults`

Acceptable results from compilers (TypeScript type).

To register custom results, add them to
[`CompileResultMap`][api-compile-result-map].

###### Type

```ts
type CompileResults = CompileResultMap[keyof CompileResultMap]
```

### `Compiler`

A **compiler** handles the compiling of a syntax tree to something else
(in most cases, text) (TypeScript type).

It is used in the stringify phase and called with a [`Node`][node]
and [`VFile`][vfile] representation of the document to compile.
It should return the textual representation of the given tree (typically
`string`).

> 👉 **Note**: unified typically compiles by serializing: most compilers
> return `string` (or `Uint8Array`).
> Some compilers, such as the one configured with
> [`rehype-react`][rehype-react], return other values (in this case, a
> React tree).
> If you’re using a compiler that doesn’t serialize, expect different
> result values.
>
> To register custom results in TypeScript, add them to
> [`CompileResultMap`][api-compile-result-map].

###### Type

```ts
type Compiler<
  Tree extends Node = Node,
  Result extends CompileResults = CompileResults
> = (tree: Tree, file: VFile) => Result
```

### `Data`

Interface of known data that can be supported by all plugins (TypeScript type).

Typically, options can be given to a specific plugin, but sometimes it makes
sense to have information shared with several plugins.
For example, a list of HTML elements that are self-closing, which is needed
during all phases.

To type this, do something like:

```ts
declare module 'unified' {
  interface Data {
    htmlVoidElements?: Array<string> | undefined
  }
}

export {} // You may not need this, but it makes sure the file is a module.
```

###### Type

```ts
interface Data {
  settings?: Settings | undefined
}
```

See [`Settings`][api-settings] for more info.

### `Parser`

A **parser** handles the parsing of text to a syntax tree (TypeScript type).

It is used in the parse phase and is called with a `string` and
[`VFile`][vfile] of the document to parse.
It must return the syntax tree representation of the given file
([`Node`][node]).

###### Type

```ts
type Parser<Tree extends Node = Node> = (document: string, file: VFile) => Tree
```

### `Pluggable`

Union of the different ways to add plugins and settings (TypeScript type).

###### Type

```ts
type Pluggable =
  | Plugin<Array<any>, any, any>
  | PluginTuple<Array<any>, any, any>
  | Preset
```

See [`Plugin`][api-plugin], [`PluginTuple`][api-plugin-tuple],
and [`Preset`][api-preset] for more info.

### `PluggableList`

List of plugins and presets (TypeScript type).

###### Type

```ts
type PluggableList = Array<Pluggable>
```

See [`Pluggable`][api-pluggable] for more info.

### `Plugin`

Single plugin (TypeScript type).

Plugins configure the processors they are applied on in the following ways:

* they change the processor, such as the parser, the compiler, or by
  configuring data
* they specify how to handle trees and files

In practice, they are functions that can receive options and configure the
processor (`this`).

> 👉 **Note**: plugins are called when the processor is *frozen*, not when they
> are applied.

###### Type

```ts
type Plugin<
  PluginParameters extends unknown[] = [],
  Input extends Node | string | undefined = Node,
  Output = Input
> = (
  this: Processor,
  ...parameters: PluginParameters
) => Input extends string // Parser.
  ? Output extends Node | undefined
    ? undefined | void
    : never
  : Output extends CompileResults // Compiler.
  ? Input extends Node | undefined
    ? undefined | void
    : never
  : // Inspect/transform.
      | Transformer<
          Input extends Node ? Input : Node,
          Output extends Node ? Output : Node
        >
      | undefined
      | void
```

See [`Transformer`][api-transformer] for more info.

###### Example

`move.js`:

```js
/**
 * @typedef Options
 *   Configuration (required).
 * @property {string} extname
 *   File extension to use (must start with `.`).
 */

/** @type {import('unified').Plugin<[Options]>} */
export function move(options) {
  if (!options || !options.extname) {
    throw new Error('Missing `options.extname`')
  }

  return function (_, file) {
    if (file.extname && file.extname !== options.extname) {
      file.extname = options.extname
    }
  }
}
```

`example.md`:

```markdown
# Hello, world!
```

`example.js`:

```js
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {read, write} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'
import {move} from './move.js'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(move, {extname: '.html'})
  .use(rehypeStringify)
  .process(await read('example.md'))

console.error(reporter(file))
await write(file) // Written to `example.html`.
```

Yields:

```txt
example.md: no issues found
```

…and in `example.html`:

```html
<h1>Hello, world!</h1>
```

### `PluginTuple`

Tuple of a plugin and its configuration (TypeScript type).

The first item is a plugin, the rest are its parameters.

###### Type

```ts
type PluginTuple<
  TupleParameters extends unknown[] = [],
  Input extends Node | string | undefined = undefined,
  Output = undefined
> = [
  plugin: Plugin<TupleParameters, Input, Output>,
  ...parameters: TupleParameters
]
```

See [`Plugin`][api-plugin] for more info.

### `Preset`

Sharable configuration (TypeScript type).

They can contain plugins and settings.

###### Fields

* `plugins` ([`PluggableList`][api-pluggable-list], optional)
  — list of plugins and presets
* `settings` ([`Data`][api-data], optional)
  — shared settings for parsers and compilers

###### Example

`preset.js`:

```js
import remarkCommentConfig from 'remark-comment-config'
import remarkLicense from 'remark-license'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkToc from 'remark-toc'

/** @type {import('unified').Preset} */
const preset = {
  plugins: [
    remarkPresetLintRecommended,
    remarkPresetLintConsistent,
    remarkCommentConfig,
    [remarkToc, {maxDepth: 3, tight: true}],
    remarkLicense
  ]
  settings: {bullet: '*', emphasis: '*', fences: true},
}

export default preset
```

`example.md`:

```markdown
# Hello, world!

_Emphasis_ and **importance**.

## Table of contents

## API

## License
```

`example.js`:

```js
import {remark} from 'remark'
import {read, write} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import preset from './preset.js'

const file = await remark()
  .use(preset)
  .process(await read('example.md'))

console.error(reporter(file))
await write(file)
```

Yields:

```txt
example.md: no issues found
```

`example.md` now contains:

```markdown
# Hello, world!

*Emphasis* and **importance**.

## Table of contents

*   [API](#api)
*   [License](#license)

## API

## License

[MIT](license) © [Titus Wormer](https://wooorm.com)
```

### `ProcessCallback`

Callback called when the process is done (TypeScript type).

Called with either an error or a result.

###### Parameters

* `error` (`Error`, optional)
  — fatal error
* `file` ([`VFile`][vfile], optional)
  — processed file

###### Returns

Nothing (`undefined`).

###### Example

This example shows how `process` can be used to process a file with a callback.

```js
import remarkGithub from 'remark-github'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

unified()
  .use(remarkParse)
  .use(remarkGithub)
  .use(remarkStringify)
  .process('@unifiedjs', function (error, file) {
    if (error) throw error
    if (file) {
      console.error(reporter(file))
      console.log(String(file))
    }
  })
```

Yields:

```txt
no issues found
```

```markdown
[**@unifiedjs**](https://github.com/unifiedjs)
```

### `Processor`

Type of a [`processor`][api-processor] (TypeScript type).

### `RunCallback`

Callback called when transformers are done (TypeScript type).

Called with either an error or results.

###### Parameters

* `error` (`Error`, optional)
  — fatal error
* `tree` ([`Node`][node], optional)
  — transformed tree
* `file` ([`VFile`][vfile], optional)
  — file

###### Returns

Nothing (`undefined`).

### `Settings`

Interface of known extra options, that can be supported by parser and
compilers.

This exists so that users can use packages such as `remark`, which configure
both parsers and compilers (in this case `remark-parse` and
`remark-stringify`), and still provide options for them.

When you make parsers or compilers, that could be packaged up together, you
should support `this.data('settings')` as input and merge it with explicitly
passed `options`.
Then, to type it, using `remark-stringify` as an example, do something like:

```ts
declare module 'unified' {
  interface Settings {
    bullet: '*' | '+' | '-'
    // …
  }
}

export {} // You may not need this, but it makes sure the file is a module.
```

###### Type

```ts
interface Settings {}
```

### `TransformCallback`

Callback passed to transforms (TypeScript type).

If the signature of a `transformer` accepts a third argument, the transformer
may perform asynchronous operations, and must call it.

###### Parameters

* `error` (`Error`, optional)
  — fatal error to stop the process
* `tree` ([`Node`][node], optional)
  — new, changed, tree
* `file` ([`VFile`][vfile], optional)
  — new, changed, file

###### Returns

Nothing (`undefined`).

### `Transformer`

Transformers handle syntax trees and files (TypeScript type).

They are functions that are called each time a syntax tree and file are
passed through the run phase.
When an error occurs in them (either because it’s thrown, returned,
rejected, or passed to `next`), the process stops.

The run phase is handled by [`trough`][trough], see its documentation for
the exact semantics of these functions.

> 👉 **Note**: you should likely ignore `next`: don’t accept it.
> it supports callback-style async work.
> But promises are likely easier to reason about.

###### Type

```ts
type Transformer<
  Input extends Node = Node,
  Output extends Node = Input
> = (
  tree: Input,
  file: VFile,
  next: TransformCallback<Output>
) =>
  | Promise<Output | undefined>
  | Output
  | Error
  | undefined
```

## Types

This package is fully typed with [TypeScript][].
It exports the additional types
[`CompileResultMap`][api-compile-result-map],
[`CompileResults`][api-compile-results],
[`Compiler`][api-compiler],
[`Data`][api-data],
[`Parser`][api-parser],
[`Pluggable`][api-pluggable],
[`PluggableList`][api-pluggable-list],
[`Plugin`][api-plugin],
[`PluginTuple`][api-plugin-tuple],
[`Preset`][api-preset],
[`ProcessCallback`][api-process-callback],
[`Processor`][api-processor],
[`RunCallback`][api-run-callback],
[`Settings`][api-settings],
[`TransformCallback`][api-transform-callback],
and [`Transformer`][api-transformer]

For TypeScript to work, it is particularly important to type your plugins
correctly.
We strongly recommend using the `Plugin` type with its generics and to use the
node types for the syntax trees provided by our packages (as in,
[`@types/hast`][types-hast], [`@types/mdast`][types-mdast],
[`@types/nlcst`][types-nlcst]).

```js
/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('mdast').Root} MdastRoot
 */

/**
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean | null | undefined} [someField]
 *   Some option (optional).
 */

// To type options:
/** @type {import('unified').Plugin<[(Options | null | undefined)?]>} */
export function myPluginAcceptingOptions(options) {
  const settings = options || {}
  // `settings` is now `Options`.
}

// To type a plugin that works on a certain tree, without options:
/** @type {import('unified').Plugin<[], MdastRoot>} */
export function myRemarkPlugin() {
  return function (tree, file) {
    // `tree` is `MdastRoot`.
  }
}

// To type a plugin that transforms one tree into another:
/** @type {import('unified').Plugin<[], MdastRoot, HastRoot>} */
export function remarkRehype() {
  return function (tree) {
    // `tree` is `MdastRoot`.
    // Result must be `HastRoot`.
  }
}

// To type a plugin that defines a parser:
/** @type {import('unified').Plugin<[], string, MdastRoot>} */
export function remarkParse(options) {}

// To type a plugin that defines a compiler:
/** @type {import('unified').Plugin<[], HastRoot, string>} */
export function rehypeStringify(options) {}
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `unified@^11`, compatible
with Node.js 16.

## Contribute

See [`contributing.md`][contributing] in [`unifiedjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

For info on how to submit a security report, see our
[security policy][security].

## Sponsor

Support this effort and give back by sponsoring on [OpenCollective][collective]!

<table>
<tr valign="middle">
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://vercel.com">Vercel</a><br><br>
  <a href="https://vercel.com"><img src="https://avatars1.githubusercontent.com/u/14985020?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://motif.land">Motif</a><br><br>
  <a href="https://motif.land"><img src="https://avatars1.githubusercontent.com/u/74457950?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.hashicorp.com">HashiCorp</a><br><br>
  <a href="https://www.hashicorp.com"><img src="https://avatars1.githubusercontent.com/u/761456?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://americanexpress.io">American Express</a><br><br>
  <a href="https://americanexpress.io"><img src="https://avatars1.githubusercontent.com/u/3853301?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.gitbook.com">GitBook</a><br><br>
  <a href="https://www.gitbook.com"><img src="https://avatars1.githubusercontent.com/u/7111340?s=256&v=4" width="128"></a>
</td>
</tr>
<tr valign="middle">
</tr>
<tr valign="middle">
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.gatsbyjs.org">Gatsby</a><br><br>
  <a href="https://www.gatsbyjs.org"><img src="https://avatars1.githubusercontent.com/u/12551863?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.netlify.com">Netlify</a><br><br>
  <!--OC has a sharper image-->
  <a href="https://www.netlify.com"><img src="https://images.opencollective.com/netlify/4087de2/logo/256.png" width="128"></a>
</td>
<td width="10%" align="center">
  <a href="https://www.coinbase.com">Coinbase</a><br><br>
  <a href="https://www.coinbase.com"><img src="https://avatars1.githubusercontent.com/u/1885080?s=256&v=4" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://themeisle.com">ThemeIsle</a><br><br>
  <a href="https://themeisle.com"><img src="https://avatars1.githubusercontent.com/u/58979018?s=128&v=4" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://expo.io">Expo</a><br><br>
  <a href="https://expo.io"><img src="https://avatars1.githubusercontent.com/u/12504344?s=128&v=4" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://boostnote.io">Boost Note</a><br><br>
  <a href="https://boostnote.io"><img src="https://images.opencollective.com/boosthub/6318083/logo/128.png" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://markdown.space">Markdown Space</a><br><br>
  <a href="https://markdown.space"><img src="https://images.opencollective.com/markdown-space/e1038ed/logo/128.png" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://www.holloway.com">Holloway</a><br><br>
  <a href="https://www.holloway.com"><img src="https://avatars1.githubusercontent.com/u/35904294?s=128&v=4" width="64"></a>
</td>
</tr>
<tr valign="middle">
<td width="100%" align="center" colspan="6">
  <br>
  <a href="https://opencollective.com/unified"><strong>You?</strong></a>
  <br><br>
</td>
</tr>
</table>

## Acknowledgments

Preliminary work for unified was done [in 2014][preliminary] for
**[retext][]** and inspired by [`ware`][ware].
Further incubation happened in **[remark][]**.
The project was finally [externalised][] in 2015 and [published][] as `unified`.
The project was authored by **[@wooorm](https://github.com/wooorm)**.

Although `unified` since moved its plugin architecture to [`trough`][trough],
thanks to **[@calvinfo](https://github.com/calvinfo)**,
**[@ianstormtaylor](https://github.com/ianstormtaylor)**, and others for their
work on [`ware`][ware], as it was a huge initial inspiration.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[logo]: https://raw.githubusercontent.com/unifiedjs/unified/93862e5/logo.svg?sanitize=true

[build-badge]: https://github.com/unifiedjs/unified/workflows/main/badge.svg

[build]: https://github.com/unifiedjs/unified/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/unifiedjs/unified.svg

[coverage]: https://codecov.io/github/unifiedjs/unified

[downloads-badge]: https://img.shields.io/npm/dm/unified.svg

[downloads]: https://www.npmjs.com/package/unified

[size-badge]: https://img.shields.io/bundlejs/size/unified

[size]: https://bundlejs.com/?q=unified

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/unifiedjs/unified/discussions

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/unifiedjs/.github

[contributing]: https://github.com/unifiedjs/.github/blob/main/contributing.md

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[coc]: https://github.com/unifiedjs/.github/blob/main/code-of-conduct.md

[security]: https://github.com/unifiedjs/.github/blob/main/security.md

[license]: license

[author]: https://wooorm.com

[npm]: https://docs.npmjs.com/cli/install

[site]: https://unifiedjs.com

[twitter]: https://twitter.com/unifiedjs

[rehype]: https://github.com/rehypejs/rehype

[remark]: https://github.com/remarkjs/remark

[retext]: https://github.com/retextjs/retext

[syntax-tree]: https://github.com/syntax-tree

[esast]: https://github.com/syntax-tree/esast

[hast]: https://github.com/syntax-tree/hast

[mdast]: https://github.com/syntax-tree/mdast

[nlcst]: https://github.com/syntax-tree/nlcst

[unist]: https://github.com/syntax-tree/unist

[xast]: https://github.com/syntax-tree/xast

[unified-engine]: https://github.com/unifiedjs/unified-engine

[unified-args]: https://github.com/unifiedjs/unified-args

[unified-engine-gulp]: https://github.com/unifiedjs/unified-engine-gulp

[unified-language-server]: https://github.com/unifiedjs/unified-language-server

[unified-stream]: https://github.com/unifiedjs/unified-stream

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[rehype-retext]: https://github.com/rehypejs/rehype-retext

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[remark-retext]: https://github.com/remarkjs/remark-retext

[node]: https://github.com/syntax-tree/unist#node

[vfile]: https://github.com/vfile/vfile

[vfile-compatible]: https://github.com/vfile/vfile#compatible

[vfile-value]: https://github.com/vfile/vfile#value

[vfile-utilities]: https://github.com/vfile/vfile#list-of-utilities

[rehype-react]: https://github.com/rehypejs/rehype-react

[trough]: https://github.com/wooorm/trough#function-fninput-next

[rehype-plugins]: https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins

[remark-plugins]: https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins

[retext-plugins]: https://github.com/retextjs/retext/blob/main/doc/plugins.md#list-of-plugins

[awesome-rehype]: https://github.com/rehypejs/awesome-rehype

[awesome-remark]: https://github.com/remarkjs/awesome-remark

[awesome-retext]: https://github.com/retextjs/awesome-retext

[topic-rehype-plugin]: https://github.com/topics/rehype-plugin

[topic-remark-plugin]: https://github.com/topics/remark-plugin

[topic-retext-plugin]: https://github.com/topics/retext-plugin

[types-hast]: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/hast

[types-mdast]: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/mdast

[types-nlcst]: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/nlcst

[preliminary]: https://github.com/retextjs/retext/commit/8fcb1f

[externalised]: https://github.com/remarkjs/remark/commit/9892ec

[published]: https://github.com/unifiedjs/unified/commit/2ba1cf

[ware]: https://github.com/segmentio/ware

[api]: #api

[contribute]: #contribute

[overview]: #overview

[sponsor]: #sponsor

[api-compile-result-map]: #compileresultmap

[api-compile-results]: #compileresults

[api-compiler]: #compiler

[api-data]: #data

[api-freeze]: #processorfreeze

[api-parser]: #parser

[api-pluggable]: #pluggable

[api-pluggable-list]: #pluggablelist

[api-plugin]: #plugin

[api-plugin-tuple]: #plugintuple

[api-preset]: #preset

[api-process]: #processorprocessfile-done

[api-process-callback]: #processcallback

[api-processor]: #processor

[api-run-callback]: #runcallback

[api-settings]: #settings

[api-transform-callback]: #transformcallback

[api-transformer]: #transformer


# mdast-util-to-hast

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[mdast][] utility to transform to [hast][].

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`defaultFootnoteBackContent(referenceIndex, rereferenceIndex)`](#defaultfootnotebackcontentreferenceindex-rereferenceindex)
  * [`defaultFootnoteBackLabel(referenceIndex, rereferenceIndex)`](#defaultfootnotebacklabelreferenceindex-rereferenceindex)
  * [`defaultHandlers`](#defaulthandlers)
  * [`toHast(tree[, options])`](#tohasttree-options)
  * [`FootnoteBackContentTemplate`](#footnotebackcontenttemplate)
  * [`FootnoteBackLabelTemplate`](#footnotebacklabeltemplate)
  * [`Handler`](#handler)
  * [`Handlers`](#handlers)
  * [`Options`](#options)
  * [`Raw`](#raw)
  * [`State`](#state)
* [Examples](#examples)
  * [Example: supporting HTML in markdown naïvely](#example-supporting-html-in-markdown-naïvely)
  * [Example: supporting HTML in markdown properly](#example-supporting-html-in-markdown-properly)
  * [Example: footnotes in languages other than English](#example-footnotes-in-languages-other-than-english)
  * [Example: supporting custom nodes](#example-supporting-custom-nodes)
* [Algorithm](#algorithm)
  * [Default handling](#default-handling)
  * [Fields on nodes](#fields-on-nodes)
* [CSS](#css)
* [Syntax tree](#syntax-tree)
  * [Nodes](#nodes)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a utility that takes an [mdast][] (markdown) syntax tree as
input and turns it into a [hast][] (HTML) syntax tree.

## When should I use this?

This project is useful when you want to deal with ASTs and turn markdown to
HTML.

The hast utility [`hast-util-to-mdast`][hast-util-to-mdast] does the inverse of
this utility.
It turns HTML into markdown.

The remark plugin [`remark-rehype`][remark-rehype] wraps this utility to also
turn markdown to HTML at a higher-level (easier) abstraction.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install mdast-util-to-hast
```

In Deno with [`esm.sh`][esmsh]:

```js
import {toHast} from 'https://esm.sh/mdast-util-to-hast@13'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {toHast} from 'https://esm.sh/mdast-util-to-hast@13?bundle'
</script>
```

## Use

Say we have the following `example.md`:

```markdown
## Hello **World**!
```

…and next to it a module `example.js`:

```js
import {fs} from 'node:fs/promises'
import {toHtml} from 'hast-util-to-html'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toHast} from 'mdast-util-to-hast'

const markdown = String(await fs.readFile('example.md'))
const mdast = fromMarkdown(markdown)
const hast = toHast(mdast)
const html = toHtml(hast)

console.log(html)
```

…now running `node example.js` yields:

```html
<h2>Hello <strong>World</strong>!</h2>
```

## API

This package exports the identifiers
[`defaultFootnoteBackContent`][api-default-footnote-back-content],
[`defaultFootnoteBackLabel`][api-default-footnote-back-label],
[`defaultHandlers`][api-default-handlers], and
[`toHast`][api-to-hast].
There is no default export.

### `defaultFootnoteBackContent(referenceIndex, rereferenceIndex)`

Generate the default content that GitHub uses on backreferences.

###### Parameters

* `referenceIndex` (`number`)
  — index of the definition in the order that they are first referenced,
  0-indexed
* `rereferenceIndex` (`number`)
  — index of calls to the same definition, 0-indexed

###### Returns

Content (`Array<ElementContent>`).

### `defaultFootnoteBackLabel(referenceIndex, rereferenceIndex)`

Generate the default label that GitHub uses on backreferences.

###### Parameters

* `referenceIndex` (`number`)
  — index of the definition in the order that they are first referenced,
  0-indexed
* `rereferenceIndex` (`number`)
  — index of calls to the same definition, 0-indexed

###### Returns

Label (`string`).

### `defaultHandlers`

Default handlers for nodes ([`Handlers`][api-handlers]).

### `toHast(tree[, options])`

Transform mdast to hast.

###### Parameters

* `tree` ([`MdastNode`][mdast-node])
  — mdast tree
* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

hast tree ([`HastNode`][hast-node]).

##### Notes

###### HTML

Raw HTML is available in mdast as [`html`][mdast-html] nodes and can be embedded
in hast as semistandard `raw` nodes.
Most utilities ignore `raw` nodes but two notable ones don’t:

* [`hast-util-to-html`][hast-util-to-html] also has an option
  `allowDangerousHtml` which will output the raw HTML.
  This is typically discouraged as noted by the option name but is useful if
  you completely trust authors
* [`hast-util-raw`][hast-util-raw] can handle the raw embedded HTML strings by
  parsing them into standard hast nodes (`element`, `text`, etc).
  This is a heavy task as it needs a full HTML parser, but it is the only way
  to support untrusted content

###### Footnotes

Many options supported here relate to footnotes.
Footnotes are not specified by CommonMark, which we follow by default.
They are supported by GitHub, so footnotes can be enabled in markdown with
[`mdast-util-gfm`][mdast-util-gfm].

The options `footnoteBackLabel` and `footnoteLabel` define natural language
that explains footnotes, which is hidden for sighted users but shown to
assistive technology.
When your page is not in English, you must define translated values.

Back references use ARIA attributes, but the section label itself uses a
heading that is hidden with an `sr-only` class.
To show it to sighted users, define different attributes in
`footnoteLabelProperties`.

###### Clobbering

Footnotes introduces a problem, as it links footnote calls to footnote
definitions on the page through `id` attributes generated from user content,
which results in DOM clobbering.

DOM clobbering is this:

```html
<p id=x></p>
<script>alert(x) // `x` now refers to the DOM `p#x` element</script>
```

Elements by their ID are made available by browsers on the `window` object,
which is a security risk.
Using a prefix solves this problem.

More information on how to handle clobbering and the prefix is explained in
[Example: headings (DOM clobbering) in `rehype-sanitize`][clobber-example].

###### Unknown nodes

Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
The default behavior for unknown nodes is:

* when the node has a `value` (and doesn’t have `data.hName`,
  `data.hProperties`, or `data.hChildren`, see later), create a hast `text`
  node
* otherwise, create a `<div>` element (which could be changed with
  `data.hName`), with its children mapped from mdast to hast as well

This behavior can be changed by passing an `unknownHandler`.

### `FootnoteBackContentTemplate`

Generate content for the backreference dynamically.

For the following markdown:

```markdown
Alpha[^micromark], bravo[^micromark], and charlie[^remark].

[^remark]: things about remark
[^micromark]: things about micromark
```

This function will be called with:

* `0` and `0` for the backreference from `things about micromark` to
  `alpha`, as it is the first used definition, and the first call to it
* `0` and `1` for the backreference from `things about micromark` to
  `bravo`, as it is the first used definition, and the second call to it
* `1` and `0` for the backreference from `things about remark` to
  `charlie`, as it is the second used definition

###### Parameters

* `referenceIndex` (`number`)
  — index of the definition in the order that they are first referenced,
  0-indexed
* `rereferenceIndex` (`number`)
  — index of calls to the same definition, 0-indexed

###### Returns

Content for the backreference when linking back from definitions to their
reference (`Array<ElementContent>`, `ElementContent`, or `string`).

### `FootnoteBackLabelTemplate`

Generate a back label dynamically.

For the following markdown:

```markdown
Alpha[^micromark], bravo[^micromark], and charlie[^remark].

[^remark]: things about remark
[^micromark]: things about micromark
```

This function will be called with:

* `0` and `0` for the backreference from `things about micromark` to
  `alpha`, as it is the first used definition, and the first call to it
* `0` and `1` for the backreference from `things about micromark` to
  `bravo`, as it is the first used definition, and the second call to it
* `1` and `0` for the backreference from `things about remark` to
  `charlie`, as it is the second used definition

###### Parameters

* `referenceIndex` (`number`)
  — index of the definition in the order that they are first referenced,
  0-indexed
* `rereferenceIndex` (`number`)
  — index of calls to the same definition, 0-indexed

###### Returns

Back label to use when linking back from definitions to their reference
(`string`).

### `Handler`

Handle a node (TypeScript type).

###### Parameters

* `state` ([`State`][api-state])
  — info passed around
* `node` ([`MdastNode`][mdast-node])
  — node to handle
* `parent` ([`MdastNode | undefined`][mdast-node])
  — parent of `node`

###### Returns

Result ([`Array<HastNode> | HastNode | undefined`][hast-node]).

### `Handlers`

Handle nodes (TypeScript type).

###### Type

```ts
type Handlers = Partial<Record<Nodes['type'], Handler>>
```

### `Options`

Configuration (TypeScript type).

###### Fields

* `allowDangerousHtml` (`boolean`, default: `false`)
  — whether to persist raw HTML in markdown in the hast tree
* `clobberPrefix` (`string`, default: `'user-content-'`)
  — prefix to use before the `id` property on footnotes to prevent them from
  *clobbering*
* `file` ([`VFile`][vfile], optional)
  — corresponding virtual file representing the input document
* `footnoteBackContent`
  ([`FootnoteBackContentTemplate`][api-footnote-back-content-template]
  or `string`, default:
  [`defaultFootnoteBackContent`][api-default-footnote-back-content])
  — content of the backreference back to references
* `footnoteBackLabel`
  ([`FootnoteBackLabelTemplate`][api-footnote-back-label-template]
  or `string`, default:
  [`defaultFootnoteBackLabel`][api-default-footnote-back-label])
  — label to describe the backreference back to references
* `footnoteLabel` (`string`, default: `'Footnotes'`)
  — label to use for the footnotes section (affects screen readers)
* `footnoteLabelProperties`
  ([`Properties`][properties], default: `{className: ['sr-only']}`)
  — properties to use on the footnote label
  (note that `id: 'footnote-label'` is always added as footnote calls use it
  with `aria-describedby` to provide an accessible label)
* `footnoteLabelTagName` (`string`, default: `h2`)
  — tag name to use for the footnote label
* `handlers` ([`Handlers`][api-handlers], optional)
  — extra handlers for nodes
* `passThrough` (`Array<Nodes['type']>`, optional)
  — list of custom mdast node types to pass through (keep) in hast (note that
  the node itself is passed, but eventual children are transformed)
* `unknownHandler` ([`Handler`][api-handler], optional)
  — handle all unknown nodes

### `Raw`

Raw string of HTML embedded into HTML AST (TypeScript type).

###### Type

```ts
import type {Data, Literal} from 'hast'

interface Raw extends Literal {
  type: 'raw'
  data?: RawData | undefined
}

interface RawData extends Data {}
```

### `State`

Info passed around about the current state (TypeScript type).

###### Fields

* `all` (`(node: MdastNode) => Array<HastNode>`)
  — transform the children of an mdast parent to hast
* `applyData` (`<Type extends HastNode>(from: MdastNode, to: Type) => Type | HastElement`)
  — honor the `data` of `from` and maybe generate an element instead of `to`
* `definitionById` (`Map<string, Definition>`)
  — definitions by their uppercased identifier
* `footnoteById` (`Map<string, FootnoteDefinition>`)
  — footnote definitions by their uppercased identifier
* `footnoteCounts` (`Map<string, number>`)
  — counts for how often the same footnote was called
* `footnoteOrder` (`Array<string>`)
  — identifiers of order when footnote calls first appear in tree order
* `handlers` ([`Handlers`][api-handlers])
  — applied node handlers
* `one` (`(node: MdastNode, parent: MdastNode | undefined) => HastNode | Array<HastNode> | undefined`)
  — transform an mdast node to hast
* `options` ([`Options`][api-options])
  — configuration
* `patch` (`(from: MdastNode, to: HastNode) => undefined`)
* `wrap` (`<Type extends HastNode>(nodes: Array<Type>, loose?: boolean) => Array<Type | HastText>`)
  — wrap `nodes` with line endings between each node, adds initial/final line
  endings when `loose`

## Examples

### Example: supporting HTML in markdown naïvely

If you completely trust authors (or plugins) and want to allow them to HTML *in*
markdown, and the last utility has an `allowDangerousHtml` option as well (such
as `hast-util-to-html`) you can pass `allowDangerousHtml` to this utility
(`mdast-util-to-hast`):

```js
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toHast} from 'mdast-util-to-hast'
import {toHtml} from 'hast-util-to-html'

const markdown = 'It <i>works</i>! <img onerror="alert(1)">'
const mdast = fromMarkdown(markdown)
const hast = toHast(mdast, {allowDangerousHtml: true})
const html = toHtml(hast, {allowDangerousHtml: true})

console.log(html)
```

…now running `node example.js` yields:

```html
<p>It <i>works</i>! <img onerror="alert(1)"></p>
```

> ⚠️ **Danger**: observe that the XSS attack through the `onerror` attribute
> is still present.

### Example: supporting HTML in markdown properly

If you do not trust the authors of the input markdown, or if you want to make
sure that further utilities can see HTML embedded in markdown, use
[`hast-util-raw`][hast-util-raw].
The following example passes `allowDangerousHtml` to this utility
(`mdast-util-to-hast`), then turns the raw embedded HTML into proper HTML nodes
(`hast-util-raw`), and finally sanitizes the HTML by only allowing safe things
(`hast-util-sanitize`):

```js
import {raw} from 'hast-util-raw'
import {sanitize} from 'hast-util-sanitize'
import {toHtml} from 'hast-util-to-html'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toHast} from 'mdast-util-to-hast'

const markdown = 'It <i>works</i>! <img onerror="alert(1)">'
const mdast = fromMarkdown(markdown)
const hast = raw(toHast(mdast, {allowDangerousHtml: true}))
const safeHast = sanitize(hast)
const html = toHtml(safeHast)

console.log(html)
```

…now running `node example.js` yields:

```html
<p>It <i>works</i>! <img></p>
```

> 👉 **Note**: observe that the XSS attack through the `onerror` attribute
> is no longer present.

### Example: footnotes in languages other than English

If you know that the markdown is authored in a language other than English,
and you’re using `micromark-extension-gfm` and `mdast-util-gfm` to match how
GitHub renders markdown, and you know that footnotes are (or can?) be used, you
should translate the labels associated with them.

Let’s first set the stage:

```js
import {toHtml} from 'hast-util-to-html'
import {gfm} from 'micromark-extension-gfm'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import {toHast} from 'mdast-util-to-hast'

const markdown = 'Bonjour[^1]\n\n[^1]: Monde!'
const mdast = fromMarkdown(markdown, {
  extensions: [gfm()],
  mdastExtensions: [gfmFromMarkdown()]
})
const hast = toHast(mdast)
const html = toHtml(hast)

console.log(html)
```

…now running `node example.js` yields:

```html
<p>Bonjour<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-1">
<p>Monde! <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>
```

This is a mix of English and French that screen readers can’t handle nicely.
Let’s say our program does know that the markdown is in French.
In that case, it’s important to translate and define the labels relating to
footnotes so that screen reader users can properly pronounce the page:

```diff
@@ -9,7 +9,16 @@ const mdast = fromMarkdown(markdown, {
   extensions: [gfm()],
   mdastExtensions: [gfmFromMarkdown()]
 })
-const hast = toHast(mdast)
+const hast = toHast(mdast, {
+  footnoteLabel: 'Notes de bas de page',
+  footnoteBackLabel(referenceIndex, rereferenceIndex) {
+    return (
+      'Retour à la référence ' +
+      (referenceIndex + 1) +
+      (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
+    )
+  }
+})
 const html = toHtml(hast)

 console.log(html)
```

…now running `node example.js` with the above patch applied yields:

```diff
@@ -1,8 +1,8 @@
 <p>Bonjour<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
-<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
+<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Notes de bas de page</h2>
 <ol>
 <li id="user-content-fn-1">
-<p>Monde! <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
+<p>Monde! <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Retour à la référence 1" class="data-footnote-backref">↩</a></p>
 </li>
 </ol>
 </section>
```

### Example: supporting custom nodes

This project supports CommonMark and the GFM constructs (footnotes,
strikethrough, tables) and the frontmatter constructs YAML and TOML.
Support can be extended to other constructs in two ways: a) with handlers, b)
through fields on nodes.

For example, when we represent a mark element in markdown and want to turn it
into a `<mark>` element in HTML, we can use a handler:

```js
import {toHtml} from 'hast-util-to-html'
import {toHast} from 'mdast-util-to-hast'

const mdast = {
  type: 'paragraph',
  children: [{type: 'mark', children: [{type: 'text', value: 'x'}]}]
}

const hast = toHast(mdast, {
  handlers: {
    mark(state, node) {
      return {
        type: 'element',
        tagName: 'mark',
        properties: {},
        children: state.all(node)
      }
    }
  }
})

console.log(toHtml(hast))
```

We can do the same through certain fields on nodes:

```js
import {toHtml} from 'hast-util-to-html'
import {toHast} from 'mdast-util-to-hast'

const mdast = {
  type: 'paragraph',
  children: [
    {
      type: 'mark',
      children: [{type: 'text', value: 'x'}],
      data: {hName: 'mark'}
    }
  ]
}

console.log(toHtml(toHast(mdast)))
```

## Algorithm

This project by default handles CommonMark, GFM (footnotes, strikethrough,
tables) and common frontmatter (YAML, TOML).

Existing handlers can be overwritten and handlers for more nodes can be added.
It’s also possible to define how mdast is turned into hast through fields on
nodes.

### Default handling

The following table gives insight into what input turns into what output:

<table>
<thead>
<tr>
<th scope="col">mdast node</th>
<th scope="col">markdown example</th>
<th scope="col">hast node</th>
<th scope="col">html example</th>
</tr>
</thead>
<tbody>
<tr>
<th scope="row">

[`blockquote`](https://github.com/syntax-tree/mdast#blockquote)

</th>
<td>

```markdown
> A greater than…
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`blockquote`)

</td>
<td>

```html
<blockquote>
<p>A greater than…</p>
</blockquote>
```

</td>
</tr>
<tr>
<th scope="row">

[`break`](https://github.com/syntax-tree/mdast#break)

</th>
<td>

```markdown
A backslash\
before a line break…
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`br`)

</td>
<td>

```html
<p>A backslash<br>
before a line break…</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`code`](https://github.com/syntax-tree/mdast#code)

</th>
<td>

````markdown
```js
backtick.fences('for blocks')
```
````

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`pre` and `code`)

</td>
<td>

```html
<pre><code className="language-js">backtick.fences('for blocks')
</code></pre>
```

</td>
</tr>
<tr>
<th scope="row">

[`delete`](https://github.com/syntax-tree/mdast#delete) (GFM)

</th>
<td>

```markdown
Two ~~tildes~~ for delete.
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`del`)

</td>
<td>

```html
<p>Two <del>tildes</del> for delete.</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`emphasis`](https://github.com/syntax-tree/mdast#emphasis)

</th>
<td>

```markdown
Some *asterisks* for emphasis.
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`em`)

</td>
<td>

```html
<p>Some <em>asterisks</em> for emphasis.</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`footnoteReference`](https://github.com/syntax-tree/mdast#footnotereference),
[`footnoteDefinition`](https://github.com/syntax-tree/mdast#footnotedefinition)
(GFM)

</th>
<td>

```markdown
With a [^caret].

[^caret]: Stuff
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`section`, `sup`, `a`)

</td>
<td>

```html
<p>With a <sup><a href="#fn-caret" …>1</a></sup>.</p>…
```

</td>
</tr>
<tr>
<th scope="row">

[`heading`](https://github.com/syntax-tree/mdast#heading)

</th>
<td>

```markdown
# One number sign…
###### Six number signs…
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`h1`…`h6`)

</td>
<td>

```html
<h1>One number sign…</h1>
<h6>Six number signs…</h6>
```

</td>
</tr>
<tr>
<th scope="row">

[`html`](https://github.com/syntax-tree/mdast#html)

</th>
<td>

```html
<kbd>CMD+S</kbd>
```

</td>
<td>

Nothing (default), `raw` (when `allowDangerousHtml: true`)

</td>
<td>

n/a

</td>
</tr>
<tr>
<th scope="row">

[`image`](https://github.com/syntax-tree/mdast#image)

</th>
<td>

```markdown
![Alt text](/logo.png "title")
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`img`)

</td>
<td>

```html
<p><img src="/logo.png" alt="Alt text" title="title"></p>
```

</td>
</tr>
<tr>
<th scope="row">

[`imageReference`](https://github.com/syntax-tree/mdast#imagereference),
[`definition`](https://github.com/syntax-tree/mdast#definition)

</th>
<td>

```markdown
![Alt text][logo]

[logo]: /logo.png "title"
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`img`)

</td>
<td>

```html
<p><img src="/logo.png" alt="Alt text" title="title"></p>
```

</td>
</tr>
<tr>
<th scope="row">

[`inlineCode`](https://github.com/syntax-tree/mdast#inlinecode)

</th>
<td>

```markdown
Some `backticks` for inline code.
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`code`)

</td>
<td>

```html
<p>Some <code>backticks</code> for inline code.</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`link`](https://github.com/syntax-tree/mdast#link)

</th>
<td>

```markdown
[Example](https://example.com "title")
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`a`)

</td>
<td>

```html
<p><a href="https://example.com" title="title">Example</a></p>
```

</td>
</tr>
<tr>
<th scope="row">

[`linkReference`](https://github.com/syntax-tree/mdast#linkreference),
[`definition`](https://github.com/syntax-tree/mdast#definition)

</th>
<td>

```markdown
[Example][]

[example]: https://example.com "title"
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`a`)

</td>
<td>

```html
<p><a href="https://example.com" title="title">Example</a></p>
```

</td>
</tr>
<tr>
<th scope="row">

[`list`](https://github.com/syntax-tree/mdast#list),
[`listItem`](https://github.com/syntax-tree/mdast#listitem)

</th>
<td>

```markdown
* asterisks for unordered items

1. decimals and a dot for ordered items
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`li` and `ol` or `ul`)

</td>
<td>

```html
<ul>
<li>asterisks for unordered items</li>
</ul>
<ol>
<li>decimals and a dot for ordered items</li>
</ol>
```

</td>
</tr>
<tr>
<th scope="row">

[`paragraph`](https://github.com/syntax-tree/mdast#paragraph)

</th>
<td>

```markdown
Just some text…
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`p`)

</td>
<td>

```html
<p>Just some text…</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`root`](https://github.com/syntax-tree/mdast#root)

</th>
<td>

```markdown
Anything!
```

</td>
<td>

[`root`](https://github.com/syntax-tree/hast#root)

</td>
<td>

```html
<p>Anything!</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`strong`](https://github.com/syntax-tree/mdast#strong)

</th>
<td>

```markdown
Two **asterisks** for strong.
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`strong`)

</td>
<td>

```html
<p>Two <strong>asterisks</strong> for strong.</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`text`](https://github.com/syntax-tree/mdast#text)

</th>
<td>

```markdown
Anything!
```

</td>
<td>

[`text`](https://github.com/syntax-tree/hast#text)

</td>
<td>

```html
<p>Anything!</p>
```

</td>
</tr>
<tr>
<th scope="row">

[`table`](https://github.com/syntax-tree/mdast#table),
[`tableRow`](https://github.com/syntax-tree/mdast#tablerow),
[`tableCell`](https://github.com/syntax-tree/mdast#tablecell)

</th>
<td>

```markdown
| Pipes |
| ----- |
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`table`, `thead`,
`tbody`, `tr`, `td`, `th`)

</td>
<td>

```html
<table>
<thead>
<tr>
<th>Pipes</th>
</tr>
</thead>
</table>
```

</td>
</tr>
<tr>
<th scope="row">

[`thematicBreak`](https://github.com/syntax-tree/mdast#thematicbreak)

</th>
<td>

```markdown
Three asterisks for a thematic break:

***
```

</td>
<td>

[`element`](https://github.com/syntax-tree/hast#element) (`hr`)

</td>
<td>

```html
<p>Three asterisks for a thematic break:</p>
<hr>
```

</td>
</tr>
<tr>
<th scope="row">

`toml` (frontmatter)

</th>
<td>

```markdown
+++
fenced = true
+++
```

</td>
<td>

Nothing

</td>
<td>

n/a

</td>
</tr>
<tr>
<th scope="row">

[`yaml`](https://github.com/syntax-tree/mdast#yaml) (frontmatter)

</th>
<td>

```markdown
---
fenced: yes
---
```

</td>
<td>

Nothing

</td>
<td>

n/a

</td>
</tr>
</tbody>
</table>

> 👉 **Note**: GFM prescribes that the obsolete `align` attribute on `td` and
> `th` elements is used.
> To use `style` attributes instead of obsolete features, combine this utility
> with [`@mapbox/hast-util-table-cell-style`][hast-util-table-cell-style].

> 🧑‍🏫 **Info**: this project is concerned with turning one syntax tree into
> another.
> It does not deal with markdown syntax or HTML syntax.
> The preceding examples are illustrative rather than authoritative or
> exhaustive.

### Fields on nodes

A frequent problem arises when having to turn one syntax tree into another.
As the original tree (in this case, mdast for markdown) is in some cases
limited compared to the destination (in this case, hast for HTML) tree,
is it possible to provide more info in the original to define what the
result will be in the destination?
This is possible by defining data on mdast nodes, which this utility will read
as instructions on what hast nodes to create.

An example is math, which is a nonstandard markdown extension, that this utility
doesn’t understand.
To solve this, `mdast-util-math` defines instructions on mdast nodes that this
plugin does understand because they define a certain hast structure.

The following fields can be used:

* `node.data.hName` — define the element’s tag name
* `node.data.hProperties` — define extra properties to use
* `node.data.hChildren` — define hast children to use

###### `hName`

`node.data.hName` sets the tag name of an element.
The following [mdast][]:

```js
{
  type: 'strong',
  data: {hName: 'b'},
  children: [{type: 'text', value: 'Alpha'}]
}
```

…yields ([hast][]):

```js
{
  type: 'element',
  tagName: 'b',
  properties: {},
  children: [{type: 'text', value: 'Alpha'}]
}
```

###### `hProperties`

`node.data.hProperties` sets the properties of an element.
The following [mdast][]:

```js
{
  type: 'image',
  src: 'circle.svg',
  alt: 'Big red circle on a black background',
  data: {hProperties: {className: ['responsive']}}
}
```

…yields ([hast][]):

```js
{
  type: 'element',
  tagName: 'img',
  properties: {
    src: 'circle.svg',
    alt: 'Big red circle on a black background',
    className: ['responsive']
  },
  children: []
}
```

###### `hChildren`

`node.data.hChildren` sets the children of an element.
The following [mdast][]:

```js
{
  type: 'code',
  lang: 'js',
  data: {
    hChildren: [
      {
        type: 'element',
        tagName: 'span',
        properties: {className: ['hljs-meta']},
        children: [{type: 'text', value: '"use strict"'}]
      },
      {type: 'text', value: ';'}
    ]
  },
  value: '"use strict";'
}
```

…yields ([hast][]):

```js
{
  type: 'element',
  tagName: 'pre',
  properties: {},
  children: [{
    type: 'element',
    tagName: 'code',
    properties: {className: ['language-js']},
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: {className: ['hljs-meta']},
        children: [{type: 'text', value: '"use strict"'}]
      },
      {type: 'text', value: ';'}
    ]
  }]
}
```

> 👉 **Note**: the `pre` and `language-js` class are normal `mdast-util-to-hast`
> functionality.

## CSS

Assuming you know how to use (semantic) HTML and CSS, then it should generally
be straightforward to style the HTML produced by this plugin.
With CSS, you can get creative and style the results as you please.

Some semistandard features, notably GFMs tasklists and footnotes, generate HTML
that be unintuitive, as it matches exactly what GitHub produces for their
website.
There is a project, [`sindresorhus/github-markdown-css`][github-markdown-css],
that exposes the stylesheet that GitHub uses for rendered markdown, which might
either be inspirational for more complex features, or can be used as-is to
exactly match how GitHub styles rendered markdown.

The following CSS is needed to make footnotes look a bit like GitHub:

```css
/* Style the footnotes section. */
.footnotes {
  font-size: smaller;
  color: #8b949e;
  border-top: 1px solid #30363d;
}

/* Hide the section label for visual users. */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  word-wrap: normal;
  border: 0;
}

/* Place `[` and `]` around footnote calls. */
[data-footnote-ref]::before {
  content: '[';
}

[data-footnote-ref]::after {
  content: ']';
}
```

## Syntax tree

The following interfaces are added to **[hast][]** by this utility.

### Nodes

#### `Raw`

```idl
interface Raw <: Literal {
  type: 'raw'
}
```

**Raw** (**[Literal][dfn-literal]**) represents a string if raw HTML inside
hast.
Raw nodes are typically ignored but are handled by
[`hast-util-to-html`][hast-util-to-html] and [`hast-util-raw`][hast-util-raw].

## Types

This package is fully typed with [TypeScript][].
It exports the
[`FootnoteBackContentTemplate`][api-footnote-back-content-template],
[`FootnoteBackLabelTemplate`][api-footnote-back-label-template],
[`Handler`][api-handler],
[`Handlers`][api-handlers],
[`Options`][api-options],
[`Raw`][api-raw], and
[`State`][api-state] types.

It also registers the `Raw` node type with `@types/hast`.
If you’re working with the syntax tree (and you pass
`allowDangerousHtml: true`), make sure to import this utility somewhere in your
types, as that registers the new node type in the tree.

```js
/**
 * @import {Root} from 'hast'
 * @import {} from 'mdast-util-to-hast'
 */

import {visit} from 'unist-util-visit'

/** @type {Root} */
const tree = { /* … */ }

visit(tree, function (node) {
  // `node` can now be `raw`.
})
```

Finally, it also registers the `hChildren`, `hName`, and `hProperties` fields
on `Data` of `@types/mdast`.
If you’re working with the syntax tree, make sure to import this utility
somewhere in your types, as that registers the data fields in the tree.

```js
/**
 * @import {Root} from 'hast'
 * @import {} from 'mdast-util-to-hast'
 */

import {visit} from 'unist-util-visit'

/** @type {Root} */
const tree = { /* … */ }

console.log(tree.data?.hName) // Types as `string | undefined`.
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `mdast-util-to-hast@^13`,
compatible with Node.js 16.

## Security

Use of `mdast-util-to-hast` can open you up to a
[cross-site scripting (XSS)][xss] attack.
Embedded hast properties (`hName`, `hProperties`, `hChildren`), custom handlers,
and the `allowDangerousHtml` option all provide openings.

The following example shows how a script is injected where a benign code block
is expected with embedded hast properties:

```js
const code = {type: 'code', value: 'alert(1)'}

code.data = {hName: 'script'}
```

Yields:

```html
<script>alert(1)</script>
```

The following example shows how an image is changed to fail loading and
therefore run code in a browser.

```js
const image = {type: 'image', url: 'existing.png'}

image.data = {hProperties: {src: 'missing', onError: 'alert(2)'}}
```

Yields:

```html
<img src="missing" onerror="alert(2)">
```

The following example shows the default handling of embedded HTML:

```markdown
# Hello

<script>alert(3)</script>
```

Yields:

```html
<h1>Hello</h1>
```

Passing `allowDangerousHtml: true` to `mdast-util-to-hast` is typically still
not enough to run unsafe code:

```html
<h1>Hello</h1>
&#x3C;script>alert(3)&#x3C;/script>
```

If `allowDangerousHtml: true` is also given to `hast-util-to-html` (or
`rehype-stringify`), the unsafe code runs:

```html
<h1>Hello</h1>
<script>alert(3)</script>
```

Use [`hast-util-sanitize`][hast-util-sanitize] to make the hast tree safe.

## Related

* [`hast-util-to-mdast`](https://github.com/syntax-tree/hast-util-to-mdast)
  — transform hast to mdast
* [`hast-util-to-xast`](https://github.com/syntax-tree/hast-util-to-xast)
  — transform hast to xast
* [`hast-util-sanitize`](https://github.com/syntax-tree/hast-util-sanitize)
  — sanitize hast nodes

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/mdast-util-to-hast/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/mdast-util-to-hast/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-to-hast.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-to-hast

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-to-hast.svg

[downloads]: https://www.npmjs.com/package/mdast-util-to-hast

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=mdast-util-to-hast

[size]: https://bundlejs.com/?q=mdast-util-to-hast

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[mdast]: https://github.com/syntax-tree/mdast

[mdast-node]: https://github.com/syntax-tree/mdast#nodes

[mdast-html]: https://github.com/syntax-tree/mdast#html

[mdast-util-gfm]: https://github.com/syntax-tree/mdast-util-gfm

[hast]: https://github.com/syntax-tree/hast

[hast-node]: https://github.com/syntax-tree/hast#nodes

[properties]: https://github.com/syntax-tree/hast#properties

[hast-util-table-cell-style]: https://github.com/mapbox/hast-util-table-cell-style

[hast-util-to-mdast]: https://github.com/syntax-tree/hast-util-to-mdast

[hast-util-to-html]: https://github.com/syntax-tree/hast-util-to-html

[hast-util-raw]: https://github.com/syntax-tree/hast-util-raw

[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[vfile]: https://github.com/vfile/vfile

[clobber-example]: https://github.com/rehypejs/rehype-sanitize#example-headings-dom-clobbering

[github-markdown-css]: https://github.com/sindresorhus/github-markdown-css

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[dfn-literal]: https://github.com/syntax-tree/hast#literal

[api-default-footnote-back-content]: #defaultfootnotebackcontentreferenceindex-rereferenceindex

[api-default-footnote-back-label]: #defaultfootnotebacklabelreferenceindex-rereferenceindex

[api-default-handlers]: #defaulthandlers

[api-footnote-back-content-template]: #footnotebackcontenttemplate

[api-footnote-back-label-template]: #footnotebacklabeltemplate

[api-handler]: #handler

[api-handlers]: #handlers

[api-options]: #options

[api-raw]: #raw

[api-state]: #state

[api-to-hast]: #tohasttree-options


# property-information

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

Info on the properties and attributes of the web platform
(HTML, SVG, ARIA, XML, XMLNS, XLink).

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`Info`](#info)
  * [`Schema`](#schema)
  * [`Space`](#space)
  * [`find(schema, name)`](#findschema-name)
  * [`hastToReact`](#hasttoreact)
  * [`html`](#html)
  * [`normalize(name)`](#normalizename)
  * [`svg`](#svg)
* [Compatibility](#compatibility)
* [Support](#support)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package contains lots of info on all the properties and attributes found
on the web platform.
It includes data on
HTML, SVG, ARIA, XML, XMLNS, and XLink.
The names of the properties follow [hast][github-hast-property-name]’s
sensible naming scheme.
It includes info on what data types attributes hold,
such as whether they’re booleans or contain lists of space separated numbers.

## When should I use this?

You can use this package if you’re working with hast,
which is an AST for HTML,
or have goals related to ASTs,
such as figuring out which properties or attributes are valid,
or what data types they hold.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npmjs-install]:

```sh
npm install property-information
```

In Deno with [`esm.sh`][esmsh]:

```js
import * as propertyInformation from 'https://esm.sh/property-information@7'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import * as propertyInformation from 'https://esm.sh/property-information@7?bundle'
</script>
```

## Use

```js
import {find, html, svg} from 'property-information'

console.log(find(html, 'className'))
// Or: find(html, 'class')
console.log(find(svg, 'horiz-adv-x'))
// Or: find(svg, 'horizAdvX')
console.log(find(svg, 'xlink:arcrole'))
// Or: find(svg, 'xLinkArcRole')
console.log(find(html, 'xmlLang'))
// Or: find(html, 'xml:lang')
console.log(find(html, 'ariaValueNow'))
// Or: find(html, 'aria-valuenow')
```

Yields:

```js
{attribute: 'class', property: 'className', spaceSeparated: true, space: 'html'}
{attribute: 'horiz-adv-x', number: true, property: 'horizAdvX', space: 'svg'}
{attribute: 'xlink:arcrole', property: 'xLinkArcRole', space: 'xlink'}
{attribute: 'xml:lang', property: 'xmlLang', space: 'xml'}
{attribute: 'aria-valuenow', number: true, property: 'ariaValueNow'}
```

## API

This package exports the identifiers
[`find`][api-find],
[`hastToReact`][api-hast-to-react],
[`html`][api-html],
[`normalize`][api-normalize],
and
[`svg`][api-svg].
There is no default export.
It exports the [TypeScript][] types
[`Info`][api-info],
[`Schema`][api-schema],
and
[`Space`][api-space].

### `Info`

Info on a property (TypeScript type).

###### Fields

* `attribute` (`string`)
  — attribute name for the property that could be used in markup
  (such as `'aria-describedby'`, `'allowfullscreen'`, `'xml:lang'`, `'for'`,
  or `'charoff'`)
* `booleanish` (`boolean`)
  — the property is *like* a `boolean`
  (such as `draggable`);
  these properties have both an on and off state when defined,
  *and* another state when not defined
* `boolean` (`boolean`)
  — the property is a `boolean`
  (such as `hidden`);
  these properties have an on state when defined and an off state when not
  defined
* `commaOrSpaceSeparated` (`boolean`)
  — the property is a list separated by spaces or commas
  (such as `strokeDashArray`)
* `commaSeparated` (`boolean`)
  — the property is a list separated by commas
  (such as `coords`)
* `defined` (`boolean`)
  — the property is [defined by a space][section-support];
  this is the case for values in HTML
  (including [data][mozilla-dataset] and ARIA),
  SVG, XML, XMLNS, and XLink;
  not defined properties can only be found through `find`
* `mustUseProperty` (`boolean`)
  — when working with the DOM,
  this property has to be changed as a field on the element,
  instead of through `setAttribute`
  (this is true only for `'checked'`, `'multiple'`, `'muted'`, and
  `'selected'`)
* `number` (`boolean`)
  — the property is a `number` (such as `height`)
* `overloadedBoolean` (`boolean`)
  — the property is *like* a `boolean` (such as `download`);
  these properties have an on state *and* more states when defined and an off
  state when not defined
* `property` (`string`)
  — JavaScript-style camel-cased name;
  based on the DOM but sometimes different
  (such as `'ariaDescribedBy'`, `'allowFullScreen'`, `'xmlLang'`, `'htmlFor'`,
  `'charOff'`)
* `spaceSeparated` (`boolean`)
  — the property is a list separated by spaces
  (such as `className`)
* `space` ([`Space`][api-space] or `undefined`)
  — [space][github-web-namespaces] of the property

### `Schema`

Schema for a primary space (TypeScript type).

###### Fields

* `normal` (`Record<string, string>`)
  — object mapping normalized attributes and properties to properly cased
  properties
* `property` ([`Record<string, Info>`][api-info])
  — object mapping properties to info
* `space` (`'html'` or `'svg'`)
  — primary space of the schema

### `Space`

Space of a property (TypeScript type).

###### Type

```ts
type Space = 'html' | 'svg' | 'xlink' | 'xmlns' | 'xml'
```

### `find(schema, name)`

Look up info on a property.

In most cases the given `schema` contains info on the property.
All standard,
most legacy,
and some non-standard properties are supported.
For these cases,
the returned [`Info`][api-info] has hints about the value of the property.

`name` can also be a [valid data attribute or property][mozilla-dataset],
in which case an [`Info`][api-info] object with the correctly cased `attribute`
and `property` is returned.

`name` can be an unknown attribute,
in which case an [`Info`][api-info] object with `attribute` and `property` set
to the given name is returned.
It is not recommended to provide unsupported legacy or recently specced
properties.

###### Parameters

* `schema` ([`Schema`][api-schema])
  — schema;
  either the `html` or `svg` export
* `name` (`string`)
  — an attribute-like or property-like name;
  it will be passed through
  [`normalize`][api-normalize] to hopefully find the correct info

###### Returns

[`Info`][api-info].

###### Example

Aside from the aforementioned example,
which shows known HTML, SVG, XML, XLink, and ARIA support,
data properties and attributes are also supported:

```js
console.log(find(html, 'data-date-of-birth'))
// Or: find(html, 'dataDateOfBirth')
// => {attribute: 'data-date-of-birth', property: 'dataDateOfBirth'}
```

Unknown values are passed through untouched:

```js
console.log(find(html, 'un-Known'))
// => {attribute: 'un-Known', property: 'un-Known'}
```

### `hastToReact`

Special cases for React (`Record<string, string>`).

[`hast`][github-hast] is close to [`React`][github-react]
but differs in a couple of cases.
To get a React property from a hast property,
check if it is in `hastToReact`.
If it is,
use the corresponding value.

### `html`

[`Schema`][api-schema] for HTML,
with info on properties from HTML itself and related embedded spaces
(ARIA, XML, XMLNS, XLink).

###### Example

```js
console.log(html.property.htmlFor)
// => {attribute: 'for', property: 'htmlFor', spaceSeparated: true, space: 'html'}
console.log(html.property.unknown)
// => undefined
```

### `normalize(name)`

Get the cleaned case insensitive form of an attribute or property.

###### Parameters

* `name` (`string`)
  — an attribute-like or property-like name

###### Returns

Value (`string`) that can be used to look up the properly cased property on a
[`Schema`][api-schema].

###### Example

```js
html.normal[normalize('for')] // => 'htmlFor'
svg.normal[normalize('VIEWBOX')] // => 'viewBox'
html.normal[normalize('unknown')] // => undefined
html.normal[normalize('accept-charset')] // => 'acceptCharset'
```

### `svg`

[`Schema`][api-schema] for SVG,
with info on properties from SVG itself and related embedded spaces
(ARIA, XML, XMLNS, XLink).

###### Example

```js
console.log(svg.property.viewBox)
// => {attribute: 'viewBox', property: 'viewBox', space: 'svg'}
console.log(svg.property.unknown)
// => undefined
```

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now,
that is Node.js 16+.
It also works in Deno and modern browsers.

## Support

<!--list start-->

| Property                          | Attribute                         | Space         |
| --------------------------------- | --------------------------------- | ------------- |
| `aLink`                           | `alink`                           | `html`        |
| `abbr`                            | `abbr`                            | `html`        |
| `about`                           | `about`                           | `svg`         |
| `accentHeight`                    | `accent-height`                   | `svg`         |
| `accept`                          | `accept`                          | `html`        |
| `acceptCharset`                   | `accept-charset`                  | `html`        |
| `accessKey`                       | `accesskey`                       | `html`        |
| `accumulate`                      | `accumulate`                      | `svg`         |
| `action`                          | `action`                          | `html`        |
| `additive`                        | `additive`                        | `svg`         |
| `align`                           | `align`                           | `html`        |
| `alignmentBaseline`               | `alignment-baseline`              | `svg`         |
| `allow`                           | `allow`                           | `html`        |
| `allowFullScreen`                 | `allowfullscreen`                 | `html`        |
| `allowPaymentRequest`             | `allowpaymentrequest`             | `html`        |
| `allowTransparency`               | `allowtransparency`               | `html`        |
| `allowUserMedia`                  | `allowusermedia`                  | `html`        |
| `alpha`                           | `alpha`                           | `html`        |
| `alphabetic`                      | `alphabetic`                      | `svg`         |
| `alt`                             | `alt`                             | `html`        |
| `amplitude`                       | `amplitude`                       | `svg`         |
| `arabicForm`                      | `arabic-form`                     | `svg`         |
| `archive`                         | `archive`                         | `html`        |
| `ariaActiveDescendant`            | `aria-activedescendant`           |               |
| `ariaAtomic`                      | `aria-atomic`                     |               |
| `ariaAutoComplete`                | `aria-autocomplete`               |               |
| `ariaBusy`                        | `aria-busy`                       |               |
| `ariaChecked`                     | `aria-checked`                    |               |
| `ariaColCount`                    | `aria-colcount`                   |               |
| `ariaColIndex`                    | `aria-colindex`                   |               |
| `ariaColSpan`                     | `aria-colspan`                    |               |
| `ariaControls`                    | `aria-controls`                   |               |
| `ariaCurrent`                     | `aria-current`                    |               |
| `ariaDescribedBy`                 | `aria-describedby`                |               |
| `ariaDetails`                     | `aria-details`                    |               |
| `ariaDisabled`                    | `aria-disabled`                   |               |
| `ariaDropEffect`                  | `aria-dropeffect`                 |               |
| `ariaErrorMessage`                | `aria-errormessage`               |               |
| `ariaExpanded`                    | `aria-expanded`                   |               |
| `ariaFlowTo`                      | `aria-flowto`                     |               |
| `ariaGrabbed`                     | `aria-grabbed`                    |               |
| `ariaHasPopup`                    | `aria-haspopup`                   |               |
| `ariaHidden`                      | `aria-hidden`                     |               |
| `ariaInvalid`                     | `aria-invalid`                    |               |
| `ariaKeyShortcuts`                | `aria-keyshortcuts`               |               |
| `ariaLabel`                       | `aria-label`                      |               |
| `ariaLabelledBy`                  | `aria-labelledby`                 |               |
| `ariaLevel`                       | `aria-level`                      |               |
| `ariaLive`                        | `aria-live`                       |               |
| `ariaModal`                       | `aria-modal`                      |               |
| `ariaMultiLine`                   | `aria-multiline`                  |               |
| `ariaMultiSelectable`             | `aria-multiselectable`            |               |
| `ariaOrientation`                 | `aria-orientation`                |               |
| `ariaOwns`                        | `aria-owns`                       |               |
| `ariaPlaceholder`                 | `aria-placeholder`                |               |
| `ariaPosInSet`                    | `aria-posinset`                   |               |
| `ariaPressed`                     | `aria-pressed`                    |               |
| `ariaReadOnly`                    | `aria-readonly`                   |               |
| `ariaRelevant`                    | `aria-relevant`                   |               |
| `ariaRequired`                    | `aria-required`                   |               |
| `ariaRoleDescription`             | `aria-roledescription`            |               |
| `ariaRowCount`                    | `aria-rowcount`                   |               |
| `ariaRowIndex`                    | `aria-rowindex`                   |               |
| `ariaRowSpan`                     | `aria-rowspan`                    |               |
| `ariaSelected`                    | `aria-selected`                   |               |
| `ariaSetSize`                     | `aria-setsize`                    |               |
| `ariaSort`                        | `aria-sort`                       |               |
| `ariaValueMax`                    | `aria-valuemax`                   |               |
| `ariaValueMin`                    | `aria-valuemin`                   |               |
| `ariaValueNow`                    | `aria-valuenow`                   |               |
| `ariaValueText`                   | `aria-valuetext`                  |               |
| `as`                              | `as`                              | `html`        |
| `ascent`                          | `ascent`                          | `svg`         |
| `async`                           | `async`                           | `html`        |
| `attributeName`                   | `attributeName`                   | `svg`         |
| `attributeType`                   | `attributeType`                   | `svg`         |
| `autoCapitalize`                  | `autocapitalize`                  | `html`        |
| `autoComplete`                    | `autocomplete`                    | `html`        |
| `autoCorrect`                     | `autocorrect`                     | `html`        |
| `autoFocus`                       | `autofocus`                       | `html`        |
| `autoPlay`                        | `autoplay`                        | `html`        |
| `autoSave`                        | `autosave`                        | `html`        |
| `axis`                            | `axis`                            | `html`        |
| `azimuth`                         | `azimuth`                         | `svg`         |
| `background`                      | `background`                      | `html`        |
| `bandwidth`                       | `bandwidth`                       | `svg`         |
| `baseFrequency`                   | `baseFrequency`                   | `svg`         |
| `baseProfile`                     | `baseProfile`                     | `svg`         |
| `baselineShift`                   | `baseline-shift`                  | `svg`         |
| `bbox`                            | `bbox`                            | `svg`         |
| `begin`                           | `begin`                           | `svg`         |
| `bgColor`                         | `bgcolor`                         | `html`        |
| `bias`                            | `bias`                            | `svg`         |
| `blocking`                        | `blocking`                        | `html`        |
| `border`                          | `border`                          | `html`        |
| `borderColor`                     | `bordercolor`                     | `html`        |
| `bottomMargin`                    | `bottommargin`                    | `html`        |
| `by`                              | `by`                              | `svg`         |
| `calcMode`                        | `calcMode`                        | `svg`         |
| `capHeight`                       | `cap-height`                      | `svg`         |
| `capture`                         | `capture`                         | `html`        |
| `cellPadding`                     | `cellpadding`                     | `html`        |
| `cellSpacing`                     | `cellspacing`                     | `html`        |
| `char`                            | `char`                            | `html`        |
| `charOff`                         | `charoff`                         | `html`        |
| `charSet`                         | `charset`                         | `html`        |
| `checked`                         | `checked`                         | `html`        |
| `cite`                            | `cite`                            | `html`        |
| `classId`                         | `classid`                         | `html`        |
| `className`                       | `class`                           | `svg`, `html` |
| `clear`                           | `clear`                           | `html`        |
| `clip`                            | `clip`                            | `svg`         |
| `clipPath`                        | `clip-path`                       | `svg`         |
| `clipPathUnits`                   | `clipPathUnits`                   | `svg`         |
| `clipRule`                        | `clip-rule`                       | `svg`         |
| `closedBy`                        | `closedby`                        | `html`        |
| `code`                            | `code`                            | `html`        |
| `codeBase`                        | `codebase`                        | `html`        |
| `codeType`                        | `codetype`                        | `html`        |
| `colSpan`                         | `colspan`                         | `html`        |
| `color`                           | `color`                           | `svg`, `html` |
| `colorInterpolation`              | `color-interpolation`             | `svg`         |
| `colorInterpolationFilters`       | `color-interpolation-filters`     | `svg`         |
| `colorProfile`                    | `color-profile`                   | `svg`         |
| `colorRendering`                  | `color-rendering`                 | `svg`         |
| `colorSpace`                      | `colorspace`                      | `html`        |
| `cols`                            | `cols`                            | `html`        |
| `command`                         | `command`                         | `html`        |
| `commandFor`                      | `commandfor`                      | `html`        |
| `compact`                         | `compact`                         | `html`        |
| `content`                         | `content`                         | `svg`, `html` |
| `contentEditable`                 | `contenteditable`                 | `html`        |
| `contentScriptType`               | `contentScriptType`               | `svg`         |
| `contentStyleType`                | `contentStyleType`                | `svg`         |
| `controls`                        | `controls`                        | `html`        |
| `controlsList`                    | `controlslist`                    | `html`        |
| `coords`                          | `coords`                          | `html`        |
| `credentialless`                  | `credentialless`                  | `html`        |
| `crossOrigin`                     | `crossorigin`                     | `svg`, `html` |
| `cursor`                          | `cursor`                          | `svg`         |
| `cx`                              | `cx`                              | `svg`         |
| `cy`                              | `cy`                              | `svg`         |
| `d`                               | `d`                               | `svg`         |
| `data`                            | `data`                            | `html`        |
| `dataType`                        | `datatype`                        | `svg`         |
| `dateTime`                        | `datetime`                        | `html`        |
| `declare`                         | `declare`                         | `html`        |
| `decoding`                        | `decoding`                        | `html`        |
| `default`                         | `default`                         | `html`        |
| `defaultAction`                   | `defaultAction`                   | `svg`         |
| `defer`                           | `defer`                           | `html`        |
| `descent`                         | `descent`                         | `svg`         |
| `diffuseConstant`                 | `diffuseConstant`                 | `svg`         |
| `dir`                             | `dir`                             | `html`        |
| `dirName`                         | `dirname`                         | `html`        |
| `direction`                       | `direction`                       | `svg`         |
| `disablePictureInPicture`         | `disablepictureinpicture`         | `html`        |
| `disableRemotePlayback`           | `disableremoteplayback`           | `html`        |
| `disabled`                        | `disabled`                        | `html`        |
| `display`                         | `display`                         | `svg`         |
| `divisor`                         | `divisor`                         | `svg`         |
| `dominantBaseline`                | `dominant-baseline`               | `svg`         |
| `download`                        | `download`                        | `svg`, `html` |
| `draggable`                       | `draggable`                       | `html`        |
| `dur`                             | `dur`                             | `svg`         |
| `dx`                              | `dx`                              | `svg`         |
| `dy`                              | `dy`                              | `svg`         |
| `edgeMode`                        | `edgeMode`                        | `svg`         |
| `editable`                        | `editable`                        | `svg`         |
| `elevation`                       | `elevation`                       | `svg`         |
| `enableBackground`                | `enable-background`               | `svg`         |
| `encType`                         | `enctype`                         | `html`        |
| `end`                             | `end`                             | `svg`         |
| `enterKeyHint`                    | `enterkeyhint`                    | `html`        |
| `event`                           | `event`                           | `svg`, `html` |
| `exponent`                        | `exponent`                        | `svg`         |
| `exportParts`                     | `exportparts`                     | `html`        |
| `externalResourcesRequired`       | `externalResourcesRequired`       | `svg`         |
| `face`                            | `face`                            | `html`        |
| `fetchPriority`                   | `fetchpriority`                   | `html`        |
| `fill`                            | `fill`                            | `svg`         |
| `fillOpacity`                     | `fill-opacity`                    | `svg`         |
| `fillRule`                        | `fill-rule`                       | `svg`         |
| `filter`                          | `filter`                          | `svg`         |
| `filterRes`                       | `filterRes`                       | `svg`         |
| `filterUnits`                     | `filterUnits`                     | `svg`         |
| `floodColor`                      | `flood-color`                     | `svg`         |
| `floodOpacity`                    | `flood-opacity`                   | `svg`         |
| `focusHighlight`                  | `focusHighlight`                  | `svg`         |
| `focusable`                       | `focusable`                       | `svg`         |
| `fontFamily`                      | `font-family`                     | `svg`         |
| `fontSize`                        | `font-size`                       | `svg`         |
| `fontSizeAdjust`                  | `font-size-adjust`                | `svg`         |
| `fontStretch`                     | `font-stretch`                    | `svg`         |
| `fontStyle`                       | `font-style`                      | `svg`         |
| `fontVariant`                     | `font-variant`                    | `svg`         |
| `fontWeight`                      | `font-weight`                     | `svg`         |
| `form`                            | `form`                            | `html`        |
| `formAction`                      | `formaction`                      | `html`        |
| `formEncType`                     | `formenctype`                     | `html`        |
| `formMethod`                      | `formmethod`                      | `html`        |
| `formNoValidate`                  | `formnovalidate`                  | `html`        |
| `formTarget`                      | `formtarget`                      | `html`        |
| `format`                          | `format`                          | `svg`         |
| `fr`                              | `fr`                              | `svg`         |
| `frame`                           | `frame`                           | `html`        |
| `frameBorder`                     | `frameborder`                     | `html`        |
| `from`                            | `from`                            | `svg`         |
| `fx`                              | `fx`                              | `svg`         |
| `fy`                              | `fy`                              | `svg`         |
| `g1`                              | `g1`                              | `svg`         |
| `g2`                              | `g2`                              | `svg`         |
| `glyphName`                       | `glyph-name`                      | `svg`         |
| `glyphOrientationHorizontal`      | `glyph-orientation-horizontal`    | `svg`         |
| `glyphOrientationVertical`        | `glyph-orientation-vertical`      | `svg`         |
| `glyphRef`                        | `glyphRef`                        | `svg`         |
| `gradientTransform`               | `gradientTransform`               | `svg`         |
| `gradientUnits`                   | `gradientUnits`                   | `svg`         |
| `hSpace`                          | `hspace`                          | `html`        |
| `handler`                         | `handler`                         | `svg`         |
| `hanging`                         | `hanging`                         | `svg`         |
| `hatchContentUnits`               | `hatchContentUnits`               | `svg`         |
| `hatchUnits`                      | `hatchUnits`                      | `svg`         |
| `headers`                         | `headers`                         | `html`        |
| `height`                          | `height`                          | `svg`, `html` |
| `hidden`                          | `hidden`                          | `html`        |
| `high`                            | `high`                            | `html`        |
| `horizAdvX`                       | `horiz-adv-x`                     | `svg`         |
| `horizOriginX`                    | `horiz-origin-x`                  | `svg`         |
| `horizOriginY`                    | `horiz-origin-y`                  | `svg`         |
| `href`                            | `href`                            | `svg`, `html` |
| `hrefLang`                        | `hreflang`                        | `svg`, `html` |
| `htmlFor`                         | `for`                             | `html`        |
| `httpEquiv`                       | `http-equiv`                      | `html`        |
| `id`                              | `id`                              | `svg`, `html` |
| `ideographic`                     | `ideographic`                     | `svg`         |
| `imageRendering`                  | `image-rendering`                 | `svg`         |
| `imageSizes`                      | `imagesizes`                      | `html`        |
| `imageSrcSet`                     | `imagesrcset`                     | `html`        |
| `in`                              | `in`                              | `svg`         |
| `in2`                             | `in2`                             | `svg`         |
| `inert`                           | `inert`                           | `html`        |
| `initialVisibility`               | `initialVisibility`               | `svg`         |
| `inputMode`                       | `inputmode`                       | `html`        |
| `integrity`                       | `integrity`                       | `html`        |
| `intercept`                       | `intercept`                       | `svg`         |
| `is`                              | `is`                              | `html`        |
| `isMap`                           | `ismap`                           | `html`        |
| `itemId`                          | `itemid`                          | `html`        |
| `itemProp`                        | `itemprop`                        | `html`        |
| `itemRef`                         | `itemref`                         | `html`        |
| `itemScope`                       | `itemscope`                       | `html`        |
| `itemType`                        | `itemtype`                        | `html`        |
| `k`                               | `k`                               | `svg`         |
| `k1`                              | `k1`                              | `svg`         |
| `k2`                              | `k2`                              | `svg`         |
| `k3`                              | `k3`                              | `svg`         |
| `k4`                              | `k4`                              | `svg`         |
| `kernelMatrix`                    | `kernelMatrix`                    | `svg`         |
| `kernelUnitLength`                | `kernelUnitLength`                | `svg`         |
| `kerning`                         | `kerning`                         | `svg`         |
| `keyPoints`                       | `keyPoints`                       | `svg`         |
| `keySplines`                      | `keySplines`                      | `svg`         |
| `keyTimes`                        | `keyTimes`                        | `svg`         |
| `kind`                            | `kind`                            | `html`        |
| `label`                           | `label`                           | `html`        |
| `lang`                            | `lang`                            | `svg`, `html` |
| `language`                        | `language`                        | `html`        |
| `leftMargin`                      | `leftmargin`                      | `html`        |
| `lengthAdjust`                    | `lengthAdjust`                    | `svg`         |
| `letterSpacing`                   | `letter-spacing`                  | `svg`         |
| `lightingColor`                   | `lighting-color`                  | `svg`         |
| `limitingConeAngle`               | `limitingConeAngle`               | `svg`         |
| `link`                            | `link`                            | `html`        |
| `list`                            | `list`                            | `html`        |
| `loading`                         | `loading`                         | `html`        |
| `local`                           | `local`                           | `svg`         |
| `longDesc`                        | `longdesc`                        | `html`        |
| `loop`                            | `loop`                            | `html`        |
| `low`                             | `low`                             | `html`        |
| `lowSrc`                          | `lowsrc`                          | `html`        |
| `manifest`                        | `manifest`                        | `html`        |
| `marginHeight`                    | `marginheight`                    | `html`        |
| `marginWidth`                     | `marginwidth`                     | `html`        |
| `markerEnd`                       | `marker-end`                      | `svg`         |
| `markerHeight`                    | `markerHeight`                    | `svg`         |
| `markerMid`                       | `marker-mid`                      | `svg`         |
| `markerStart`                     | `marker-start`                    | `svg`         |
| `markerUnits`                     | `markerUnits`                     | `svg`         |
| `markerWidth`                     | `markerWidth`                     | `svg`         |
| `mask`                            | `mask`                            | `svg`         |
| `maskContentUnits`                | `maskContentUnits`                | `svg`         |
| `maskType`                        | `mask-type`                       | `svg`         |
| `maskUnits`                       | `maskUnits`                       | `svg`         |
| `mathematical`                    | `mathematical`                    | `svg`         |
| `max`                             | `max`                             | `svg`, `html` |
| `maxLength`                       | `maxlength`                       | `html`        |
| `media`                           | `media`                           | `svg`, `html` |
| `mediaCharacterEncoding`          | `mediaCharacterEncoding`          | `svg`         |
| `mediaContentEncodings`           | `mediaContentEncodings`           | `svg`         |
| `mediaSize`                       | `mediaSize`                       | `svg`         |
| `mediaTime`                       | `mediaTime`                       | `svg`         |
| `method`                          | `method`                          | `svg`, `html` |
| `min`                             | `min`                             | `svg`, `html` |
| `minLength`                       | `minlength`                       | `html`        |
| `mode`                            | `mode`                            | `svg`         |
| `multiple`                        | `multiple`                        | `html`        |
| `muted`                           | `muted`                           | `html`        |
| `name`                            | `name`                            | `svg`, `html` |
| `navDown`                         | `nav-down`                        | `svg`         |
| `navDownLeft`                     | `nav-down-left`                   | `svg`         |
| `navDownRight`                    | `nav-down-right`                  | `svg`         |
| `navLeft`                         | `nav-left`                        | `svg`         |
| `navNext`                         | `nav-next`                        | `svg`         |
| `navPrev`                         | `nav-prev`                        | `svg`         |
| `navRight`                        | `nav-right`                       | `svg`         |
| `navUp`                           | `nav-up`                          | `svg`         |
| `navUpLeft`                       | `nav-up-left`                     | `svg`         |
| `navUpRight`                      | `nav-up-right`                    | `svg`         |
| `noHref`                          | `nohref`                          | `html`        |
| `noModule`                        | `nomodule`                        | `html`        |
| `noResize`                        | `noresize`                        | `html`        |
| `noShade`                         | `noshade`                         | `html`        |
| `noValidate`                      | `novalidate`                      | `html`        |
| `noWrap`                          | `nowrap`                          | `html`        |
| `nonce`                           | `nonce`                           | `html`        |
| `numOctaves`                      | `numOctaves`                      | `svg`         |
| `object`                          | `object`                          | `html`        |
| `observer`                        | `observer`                        | `svg`         |
| `offset`                          | `offset`                          | `svg`         |
| `onAbort`                         | `onabort`                         | `svg`, `html` |
| `onActivate`                      | `onactivate`                      | `svg`         |
| `onAfterPrint`                    | `onafterprint`                    | `svg`, `html` |
| `onAuxClick`                      | `onauxclick`                      | `html`        |
| `onBeforeMatch`                   | `onbeforematch`                   | `html`        |
| `onBeforePrint`                   | `onbeforeprint`                   | `svg`, `html` |
| `onBeforeToggle`                  | `onbeforetoggle`                  | `html`        |
| `onBeforeUnload`                  | `onbeforeunload`                  | `html`        |
| `onBegin`                         | `onbegin`                         | `svg`         |
| `onBlur`                          | `onblur`                          | `html`        |
| `onCanPlay`                       | `oncanplay`                       | `svg`, `html` |
| `onCanPlayThrough`                | `oncanplaythrough`                | `svg`, `html` |
| `onCancel`                        | `oncancel`                        | `svg`, `html` |
| `onChange`                        | `onchange`                        | `svg`, `html` |
| `onClick`                         | `onclick`                         | `svg`, `html` |
| `onClose`                         | `onclose`                         | `svg`, `html` |
| `onContextLost`                   | `oncontextlost`                   | `html`        |
| `onContextMenu`                   | `oncontextmenu`                   | `html`        |
| `onContextRestored`               | `oncontextrestored`               | `html`        |
| `onCopy`                          | `oncopy`                          | `svg`, `html` |
| `onCueChange`                     | `oncuechange`                     | `svg`, `html` |
| `onCut`                           | `oncut`                           | `svg`, `html` |
| `onDblClick`                      | `ondblclick`                      | `svg`, `html` |
| `onDrag`                          | `ondrag`                          | `svg`, `html` |
| `onDragEnd`                       | `ondragend`                       | `svg`, `html` |
| `onDragEnter`                     | `ondragenter`                     | `svg`, `html` |
| `onDragExit`                      | `ondragexit`                      | `svg`, `html` |
| `onDragLeave`                     | `ondragleave`                     | `svg`, `html` |
| `onDragOver`                      | `ondragover`                      | `svg`, `html` |
| `onDragStart`                     | `ondragstart`                     | `svg`, `html` |
| `onDrop`                          | `ondrop`                          | `svg`, `html` |
| `onDurationChange`                | `ondurationchange`                | `svg`, `html` |
| `onEmptied`                       | `onemptied`                       | `svg`, `html` |
| `onEnd`                           | `onend`                           | `svg`         |
| `onEnded`                         | `onended`                         | `svg`, `html` |
| `onError`                         | `onerror`                         | `svg`, `html` |
| `onFocus`                         | `onfocus`                         | `svg`, `html` |
| `onFocusIn`                       | `onfocusin`                       | `svg`         |
| `onFocusOut`                      | `onfocusout`                      | `svg`         |
| `onFormData`                      | `onformdata`                      | `html`        |
| `onHashChange`                    | `onhashchange`                    | `svg`, `html` |
| `onInput`                         | `oninput`                         | `svg`, `html` |
| `onInvalid`                       | `oninvalid`                       | `svg`, `html` |
| `onKeyDown`                       | `onkeydown`                       | `svg`, `html` |
| `onKeyPress`                      | `onkeypress`                      | `svg`, `html` |
| `onKeyUp`                         | `onkeyup`                         | `svg`, `html` |
| `onLanguageChange`                | `onlanguagechange`                | `html`        |
| `onLoad`                          | `onload`                          | `svg`, `html` |
| `onLoadEnd`                       | `onloadend`                       | `html`        |
| `onLoadStart`                     | `onloadstart`                     | `svg`, `html` |
| `onLoadedData`                    | `onloadeddata`                    | `svg`, `html` |
| `onLoadedMetadata`                | `onloadedmetadata`                | `svg`, `html` |
| `onMessage`                       | `onmessage`                       | `svg`, `html` |
| `onMessageError`                  | `onmessageerror`                  | `html`        |
| `onMouseDown`                     | `onmousedown`                     | `svg`, `html` |
| `onMouseEnter`                    | `onmouseenter`                    | `svg`, `html` |
| `onMouseLeave`                    | `onmouseleave`                    | `svg`, `html` |
| `onMouseMove`                     | `onmousemove`                     | `svg`, `html` |
| `onMouseOut`                      | `onmouseout`                      | `svg`, `html` |
| `onMouseOver`                     | `onmouseover`                     | `svg`, `html` |
| `onMouseUp`                       | `onmouseup`                       | `svg`, `html` |
| `onMouseWheel`                    | `onmousewheel`                    | `svg`         |
| `onOffline`                       | `onoffline`                       | `svg`, `html` |
| `onOnline`                        | `ononline`                        | `svg`, `html` |
| `onPageHide`                      | `onpagehide`                      | `svg`, `html` |
| `onPageShow`                      | `onpageshow`                      | `svg`, `html` |
| `onPaste`                         | `onpaste`                         | `svg`, `html` |
| `onPause`                         | `onpause`                         | `svg`, `html` |
| `onPlay`                          | `onplay`                          | `svg`, `html` |
| `onPlaying`                       | `onplaying`                       | `svg`, `html` |
| `onPopState`                      | `onpopstate`                      | `svg`, `html` |
| `onProgress`                      | `onprogress`                      | `svg`, `html` |
| `onRateChange`                    | `onratechange`                    | `svg`, `html` |
| `onRejectionHandled`              | `onrejectionhandled`              | `html`        |
| `onRepeat`                        | `onrepeat`                        | `svg`         |
| `onReset`                         | `onreset`                         | `svg`, `html` |
| `onResize`                        | `onresize`                        | `svg`, `html` |
| `onScroll`                        | `onscroll`                        | `svg`, `html` |
| `onScrollEnd`                     | `onscrollend`                     | `html`        |
| `onSecurityPolicyViolation`       | `onsecuritypolicyviolation`       | `html`        |
| `onSeeked`                        | `onseeked`                        | `svg`, `html` |
| `onSeeking`                       | `onseeking`                       | `svg`, `html` |
| `onSelect`                        | `onselect`                        | `svg`, `html` |
| `onShow`                          | `onshow`                          | `svg`         |
| `onSlotChange`                    | `onslotchange`                    | `html`        |
| `onStalled`                       | `onstalled`                       | `svg`, `html` |
| `onStorage`                       | `onstorage`                       | `svg`, `html` |
| `onSubmit`                        | `onsubmit`                        | `svg`, `html` |
| `onSuspend`                       | `onsuspend`                       | `svg`, `html` |
| `onTimeUpdate`                    | `ontimeupdate`                    | `svg`, `html` |
| `onToggle`                        | `ontoggle`                        | `svg`, `html` |
| `onUnhandledRejection`            | `onunhandledrejection`            | `html`        |
| `onUnload`                        | `onunload`                        | `svg`, `html` |
| `onVolumeChange`                  | `onvolumechange`                  | `svg`, `html` |
| `onWaiting`                       | `onwaiting`                       | `svg`, `html` |
| `onWheel`                         | `onwheel`                         | `html`        |
| `onZoom`                          | `onzoom`                          | `svg`         |
| `opacity`                         | `opacity`                         | `svg`         |
| `open`                            | `open`                            | `html`        |
| `operator`                        | `operator`                        | `svg`         |
| `optimum`                         | `optimum`                         | `html`        |
| `order`                           | `order`                           | `svg`         |
| `orient`                          | `orient`                          | `svg`         |
| `orientation`                     | `orientation`                     | `svg`         |
| `origin`                          | `origin`                          | `svg`         |
| `overflow`                        | `overflow`                        | `svg`         |
| `overlay`                         | `overlay`                         | `svg`         |
| `overlinePosition`                | `overline-position`               | `svg`         |
| `overlineThickness`               | `overline-thickness`              | `svg`         |
| `paintOrder`                      | `paint-order`                     | `svg`         |
| `panose1`                         | `panose-1`                        | `svg`         |
| `part`                            | `part`                            | `html`        |
| `path`                            | `path`                            | `svg`         |
| `pathLength`                      | `pathLength`                      | `svg`         |
| `pattern`                         | `pattern`                         | `html`        |
| `patternContentUnits`             | `patternContentUnits`             | `svg`         |
| `patternTransform`                | `patternTransform`                | `svg`         |
| `patternUnits`                    | `patternUnits`                    | `svg`         |
| `phase`                           | `phase`                           | `svg`         |
| `ping`                            | `ping`                            | `svg`, `html` |
| `pitch`                           | `pitch`                           | `svg`         |
| `placeholder`                     | `placeholder`                     | `html`        |
| `playbackOrder`                   | `playbackorder`                   | `svg`         |
| `playsInline`                     | `playsinline`                     | `html`        |
| `pointerEvents`                   | `pointer-events`                  | `svg`         |
| `points`                          | `points`                          | `svg`         |
| `pointsAtX`                       | `pointsAtX`                       | `svg`         |
| `pointsAtY`                       | `pointsAtY`                       | `svg`         |
| `pointsAtZ`                       | `pointsAtZ`                       | `svg`         |
| `popover`                         | `popover`                         | `html`        |
| `popoverTarget`                   | `popovertarget`                   | `html`        |
| `popoverTargetAction`             | `popovertargetaction`             | `html`        |
| `poster`                          | `poster`                          | `html`        |
| `prefix`                          | `prefix`                          | `html`        |
| `preload`                         | `preload`                         | `html`        |
| `preserveAlpha`                   | `preserveAlpha`                   | `svg`         |
| `preserveAspectRatio`             | `preserveAspectRatio`             | `svg`         |
| `primitiveUnits`                  | `primitiveUnits`                  | `svg`         |
| `profile`                         | `profile`                         | `html`        |
| `prompt`                          | `prompt`                          | `html`        |
| `propagate`                       | `propagate`                       | `svg`         |
| `property`                        | `property`                        | `svg`, `html` |
| `r`                               | `r`                               | `svg`         |
| `radius`                          | `radius`                          | `svg`         |
| `readOnly`                        | `readonly`                        | `html`        |
| `refX`                            | `refX`                            | `svg`         |
| `refY`                            | `refY`                            | `svg`         |
| `referrerPolicy`                  | `referrerpolicy`                  | `svg`, `html` |
| `rel`                             | `rel`                             | `svg`, `html` |
| `renderingIntent`                 | `rendering-intent`                | `svg`         |
| `repeatCount`                     | `repeatCount`                     | `svg`         |
| `repeatDur`                       | `repeatDur`                       | `svg`         |
| `required`                        | `required`                        | `html`        |
| `requiredExtensions`              | `requiredExtensions`              | `svg`         |
| `requiredFeatures`                | `requiredFeatures`                | `svg`         |
| `requiredFonts`                   | `requiredFonts`                   | `svg`         |
| `requiredFormats`                 | `requiredFormats`                 | `svg`         |
| `resource`                        | `resource`                        | `svg`         |
| `restart`                         | `restart`                         | `svg`         |
| `result`                          | `result`                          | `svg`         |
| `results`                         | `results`                         | `html`        |
| `rev`                             | `rev`                             | `svg`, `html` |
| `reversed`                        | `reversed`                        | `html`        |
| `rightMargin`                     | `rightmargin`                     | `html`        |
| `role`                            | `role`                            |               |
| `rotate`                          | `rotate`                          | `svg`         |
| `rowSpan`                         | `rowspan`                         | `html`        |
| `rows`                            | `rows`                            | `html`        |
| `rules`                           | `rules`                           | `html`        |
| `rx`                              | `rx`                              | `svg`         |
| `ry`                              | `ry`                              | `svg`         |
| `sandbox`                         | `sandbox`                         | `html`        |
| `scale`                           | `scale`                           | `svg`         |
| `scheme`                          | `scheme`                          | `html`        |
| `scope`                           | `scope`                           | `html`        |
| `scoped`                          | `scoped`                          | `html`        |
| `scrolling`                       | `scrolling`                       | `html`        |
| `seamless`                        | `seamless`                        | `html`        |
| `security`                        | `security`                        | `html`        |
| `seed`                            | `seed`                            | `svg`         |
| `selected`                        | `selected`                        | `html`        |
| `shadowRootClonable`              | `shadowrootclonable`              | `html`        |
| `shadowRootCustomElementRegistry` | `shadowrootcustomelementregistry` | `html`        |
| `shadowRootDelegatesFocus`        | `shadowrootdelegatesfocus`        | `html`        |
| `shadowRootMode`                  | `shadowrootmode`                  | `html`        |
| `shadowRootSerializable`          | `shadowrootserializable`          | `html`        |
| `shape`                           | `shape`                           | `html`        |
| `shapeRendering`                  | `shape-rendering`                 | `svg`         |
| `side`                            | `side`                            | `svg`         |
| `size`                            | `size`                            | `html`        |
| `sizes`                           | `sizes`                           | `html`        |
| `slope`                           | `slope`                           | `svg`         |
| `slot`                            | `slot`                            | `html`        |
| `snapshotTime`                    | `snapshotTime`                    | `svg`         |
| `spacing`                         | `spacing`                         | `svg`         |
| `span`                            | `span`                            | `html`        |
| `specularConstant`                | `specularConstant`                | `svg`         |
| `specularExponent`                | `specularExponent`                | `svg`         |
| `spellCheck`                      | `spellcheck`                      | `html`        |
| `spreadMethod`                    | `spreadMethod`                    | `svg`         |
| `src`                             | `src`                             | `html`        |
| `srcDoc`                          | `srcdoc`                          | `html`        |
| `srcLang`                         | `srclang`                         | `html`        |
| `srcSet`                          | `srcset`                          | `html`        |
| `standby`                         | `standby`                         | `html`        |
| `start`                           | `start`                           | `html`        |
| `startOffset`                     | `startOffset`                     | `svg`         |
| `stdDeviation`                    | `stdDeviation`                    | `svg`         |
| `stemh`                           | `stemh`                           | `svg`         |
| `stemv`                           | `stemv`                           | `svg`         |
| `step`                            | `step`                            | `html`        |
| `stitchTiles`                     | `stitchTiles`                     | `svg`         |
| `stopColor`                       | `stop-color`                      | `svg`         |
| `stopOpacity`                     | `stop-opacity`                    | `svg`         |
| `strikethroughPosition`           | `strikethrough-position`          | `svg`         |
| `strikethroughThickness`          | `strikethrough-thickness`         | `svg`         |
| `string`                          | `string`                          | `svg`         |
| `stroke`                          | `stroke`                          | `svg`         |
| `strokeDashArray`                 | `stroke-dasharray`                | `svg`         |
| `strokeDashOffset`                | `stroke-dashoffset`               | `svg`         |
| `strokeLineCap`                   | `stroke-linecap`                  | `svg`         |
| `strokeLineJoin`                  | `stroke-linejoin`                 | `svg`         |
| `strokeMiterLimit`                | `stroke-miterlimit`               | `svg`         |
| `strokeOpacity`                   | `stroke-opacity`                  | `svg`         |
| `strokeWidth`                     | `stroke-width`                    | `svg`         |
| `style`                           | `style`                           | `svg`, `html` |
| `summary`                         | `summary`                         | `html`        |
| `surfaceScale`                    | `surfaceScale`                    | `svg`         |
| `syncBehavior`                    | `syncBehavior`                    | `svg`         |
| `syncBehaviorDefault`             | `syncBehaviorDefault`             | `svg`         |
| `syncMaster`                      | `syncMaster`                      | `svg`         |
| `syncTolerance`                   | `syncTolerance`                   | `svg`         |
| `syncToleranceDefault`            | `syncToleranceDefault`            | `svg`         |
| `systemLanguage`                  | `systemLanguage`                  | `svg`         |
| `tabIndex`                        | `tabindex`                        | `svg`, `html` |
| `tableValues`                     | `tableValues`                     | `svg`         |
| `target`                          | `target`                          | `svg`, `html` |
| `targetX`                         | `targetX`                         | `svg`         |
| `targetY`                         | `targetY`                         | `svg`         |
| `text`                            | `text`                            | `html`        |
| `textAnchor`                      | `text-anchor`                     | `svg`         |
| `textDecoration`                  | `text-decoration`                 | `svg`         |
| `textLength`                      | `textLength`                      | `svg`         |
| `textRendering`                   | `text-rendering`                  | `svg`         |
| `timelineBegin`                   | `timelinebegin`                   | `svg`         |
| `title`                           | `title`                           | `svg`, `html` |
| `to`                              | `to`                              | `svg`         |
| `topMargin`                       | `topmargin`                       | `html`        |
| `transform`                       | `transform`                       | `svg`         |
| `transformBehavior`               | `transformBehavior`               | `svg`         |
| `transformOrigin`                 | `transform-origin`                | `svg`         |
| `translate`                       | `translate`                       | `html`        |
| `type`                            | `type`                            | `svg`, `html` |
| `typeMustMatch`                   | `typemustmatch`                   | `html`        |
| `typeOf`                          | `typeof`                          | `svg`         |
| `u1`                              | `u1`                              | `svg`         |
| `u2`                              | `u2`                              | `svg`         |
| `underlinePosition`               | `underline-position`              | `svg`         |
| `underlineThickness`              | `underline-thickness`             | `svg`         |
| `unicode`                         | `unicode`                         | `svg`         |
| `unicodeBidi`                     | `unicode-bidi`                    | `svg`         |
| `unicodeRange`                    | `unicode-range`                   | `svg`         |
| `unitsPerEm`                      | `units-per-em`                    | `svg`         |
| `unselectable`                    | `unselectable`                    | `html`        |
| `useMap`                          | `usemap`                          | `html`        |
| `vAlign`                          | `valign`                          | `html`        |
| `vAlphabetic`                     | `v-alphabetic`                    | `svg`         |
| `vHanging`                        | `v-hanging`                       | `svg`         |
| `vIdeographic`                    | `v-ideographic`                   | `svg`         |
| `vLink`                           | `vlink`                           | `html`        |
| `vMathematical`                   | `v-mathematical`                  | `svg`         |
| `vSpace`                          | `vspace`                          | `html`        |
| `value`                           | `value`                           | `html`        |
| `valueType`                       | `valuetype`                       | `html`        |
| `values`                          | `values`                          | `svg`         |
| `vectorEffect`                    | `vector-effect`                   | `svg`         |
| `version`                         | `version`                         | `svg`, `html` |
| `vertAdvY`                        | `vert-adv-y`                      | `svg`         |
| `vertOriginX`                     | `vert-origin-x`                   | `svg`         |
| `vertOriginY`                     | `vert-origin-y`                   | `svg`         |
| `viewBox`                         | `viewBox`                         | `svg`         |
| `viewTarget`                      | `viewTarget`                      | `svg`         |
| `visibility`                      | `visibility`                      | `svg`         |
| `width`                           | `width`                           | `svg`, `html` |
| `widths`                          | `widths`                          | `svg`         |
| `wordSpacing`                     | `word-spacing`                    | `svg`         |
| `wrap`                            | `wrap`                            | `html`        |
| `writingMode`                     | `writing-mode`                    | `svg`         |
| `writingSuggestions`              | `writingsuggestions`              | `html`        |
| `x`                               | `x`                               | `svg`         |
| `x1`                              | `x1`                              | `svg`         |
| `x2`                              | `x2`                              | `svg`         |
| `xChannelSelector`                | `xChannelSelector`                | `svg`         |
| `xHeight`                         | `x-height`                        | `svg`         |
| `xLinkActuate`                    | `xlink:actuate`                   | `xlink`       |
| `xLinkArcRole`                    | `xlink:arcrole`                   | `xlink`       |
| `xLinkHref`                       | `xlink:href`                      | `xlink`       |
| `xLinkRole`                       | `xlink:role`                      | `xlink`       |
| `xLinkShow`                       | `xlink:show`                      | `xlink`       |
| `xLinkTitle`                      | `xlink:title`                     | `xlink`       |
| `xLinkType`                       | `xlink:type`                      | `xlink`       |
| `xmlBase`                         | `xml:base`                        | `xml`         |
| `xmlLang`                         | `xml:lang`                        | `xml`         |
| `xmlSpace`                        | `xml:space`                       | `xml`         |
| `xmlns`                           | `xmlns`                           | `xmlns`       |
| `xmlnsXLink`                      | `xmlns:xlink`                     | `xmlns`       |
| `y`                               | `y`                               | `svg`         |
| `y1`                              | `y1`                              | `svg`         |
| `y2`                              | `y2`                              | `svg`         |
| `yChannelSelector`                | `yChannelSelector`                | `svg`         |
| `z`                               | `z`                               | `svg`         |
| `zoomAndPan`                      | `zoomAndPan`                      | `svg`         |

<!--list end-->

## Security

This package is safe.

## Related

* [`wooorm/web-namespaces`][github-web-namespaces]
  — list of web namespaces
* [`wooorm/space-separated-tokens`](https://github.com/wooorm/space-separated-tokens)
  — parse/stringify space separated tokens
* [`wooorm/comma-separated-tokens`](https://github.com/wooorm/comma-separated-tokens)
  — parse/stringify comma separated tokens
* [`wooorm/html-tag-names`](https://github.com/wooorm/html-tag-names)
  — list of HTML tag names
* [`wooorm/mathml-tag-names`](https://github.com/wooorm/mathml-tag-names)
  — list of MathML tag names
* [`wooorm/svg-tag-names`](https://github.com/wooorm/svg-tag-names)
  — list of SVG tag names
* [`wooorm/html-void-elements`](https://github.com/wooorm/html-void-elements)
  — list of void HTML tag names
* [`wooorm/svg-element-attributes`](https://github.com/wooorm/svg-element-attributes)
  — map of SVG elements to allowed attributes
* [`wooorm/html-element-attributes`](https://github.com/wooorm/html-element-attributes)
  — map of HTML elements to allowed attributes
* [`wooorm/aria-attributes`](https://github.com/wooorm/aria-attributes)
  — list of ARIA attributes

## Contribute

Yes please!
See [*How to Contribute to Open Source*][opensource-guide].

## License

[MIT][file-license] © [Titus Wormer][wooorm]

Derivative work based on [React][github-react-source] licensed under
[MIT][github-react-source-license] © Facebook, Inc.

[api-find]: #findschema-name

[api-hast-to-react]: #hasttoreact

[api-html]: #html

[api-info]: #info

[api-normalize]: #normalizename

[api-schema]: #schema

[api-space]: #space

[api-svg]: #svg

[badge-build-image]: https://github.com/wooorm/property-information/workflows/main/badge.svg

[badge-build-url]: https://github.com/wooorm/property-information/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/wooorm/property-information.svg

[badge-coverage-url]: https://codecov.io/github/wooorm/property-information

[badge-downloads-image]: https://img.shields.io/npm/dm/property-information.svg

[badge-downloads-url]: https://www.npmjs.com/package/property-information

[badge-size-image]: https://img.shields.io/bundlejs/size/property-information

[badge-size-url]: https://bundlejs.com/?q=property-information

[esmsh]: https://esm.sh

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-hast]: https://github.com/syntax-tree/hast

[github-hast-property-name]: https://github.com/syntax-tree/hast#propertyname

[github-react]: https://github.com/facebook/react

[github-react-source]: https://github.com/facebook/react/blob/4632e36/packages/react-dom-bindings/src/shared/possibleStandardNames.js

[github-react-source-license]: https://github.com/facebook/react/blob/4632e36/LICENSE

[github-web-namespaces]: https://github.com/wooorm/web-namespaces

[mozilla-dataset]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset

[npmjs-install]: https://docs.npmjs.com/cli/install

[opensource-guide]: https://opensource.guide/how-to-contribute/

[section-support]: #support

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com


# remark-rehype

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

**[remark][github-remark]** plugin that turns markdown into HTML to support
**[rehype][github-rehype]**.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`defaultFootnoteBackContent(referenceIndex, rereferenceIndex)`](#defaultfootnotebackcontentreferenceindex-rereferenceindex)
  * [`defaultFootnoteBackLabel(referenceIndex, rereferenceIndex)`](#defaultfootnotebacklabelreferenceindex-rereferenceindex)
  * [`defaultHandlers`](#defaulthandlers)
  * [`unified().use(remarkRehype[, destination][, options])`](#unifieduseremarkrehype-destination-options)
  * [`Options`](#options)
* [Examples](#examples)
  * [Example: supporting HTML in markdown naïvely](#example-supporting-html-in-markdown-naïvely)
  * [Example: supporting HTML in markdown properly](#example-supporting-html-in-markdown-properly)
  * [Example: footnotes in languages other than English](#example-footnotes-in-languages-other-than-english)
* [HTML](#html-1)
* [CSS](#css)
* [Syntax tree](#syntax-tree)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a [unified][github-unified] ([remark][github-remark])
plugin that switches from remark (the markdown ecosystem)
to rehype (the HTML ecosystem).
It does this by transforming the current markdown (mdast) syntax tree into an
HTML (hast) syntax tree.
remark plugins deal with mdast and rehype plugins deal with hast,
so plugins used after `remark-rehype` have to be rehype plugins.

The reason that there are different ecosystems for markdown and HTML is that
turning markdown into HTML is,
while frequently needed,
not the only purpose of markdown.
Checking (linting) and formatting markdown are also common use cases for
remark and markdown.
There are several aspects of markdown that do not translate 1-to-1 to HTML.
In some cases markdown contains more information than HTML:
for example,
there are several ways to add a link in markdown
(as in,
autolinks: `<https://url>`,
resource links: `[label](url)`,
and reference links with definitions:
`[label][id]` and `[id]: url`).
In other cases HTML contains more information than markdown:
there are many tags,
which add new meaning (semantics),
available in HTML that aren’t available in markdown.
If there was just one AST,
it would be quite hard to perform the tasks that several remark and rehype
plugins currently do.

## When should I use this?

This project is useful when you want to turn markdown to HTML.
It opens up a whole new ecosystem with tons of plugins to do all kinds of
things.
You can [minify HTML][github-rehype-minify],
[format HTML][github-rehype-format],
[make sure it’s safe][github-rehype-sanitize],
[highlight code][github-rehype-starry-night],
[add metadata][github-rehype-meta],
and a lot more.

A different plugin,
[`rehype-raw`][github-rehype-raw],
adds support for raw HTML written inside markdown.
This is a separate plugin because supporting HTML inside markdown is a heavy
task (performance and bundle size) and not always needed.
To use both together,
you also have to configure `remark-rehype` with `allowDangerousHtml: true` and
then use `rehype-raw`.

The rehype plugin [`rehype-remark`][github-rehype-remark] does the inverse of
this plugin.
It turns HTML into markdown.

If you don’t use plugins and want to access syntax trees,
you can use
[`mdast-util-to-hast`][github-mdast-util-to-hast].

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npmjs-install]:

```sh
npm install remark-rehype
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkRehype from 'https://esm.sh/remark-rehype@11'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkRehype from 'https://esm.sh/remark-rehype@11?bundle'
</script>
```

## Use

Say our document `example.md` contains:

```markdown
# Pluto

**Pluto** (minor-planet designation: **134340 Pluto**) is a
[dwarf planet](https://en.wikipedia.org/wiki/Dwarf_planet) in the
[Kuiper belt](https://en.wikipedia.org/wiki/Kuiper_belt).
```

…and our module `example.js` contains:

```js
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {read} from 'to-vfile'
import {unified} from 'unified'
import {reporter} from 'vfile-reporter'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(await read('example.md'))

console.error(reporter(file))
console.log(String(file))
```

…then running `node example.js` yields:

```text
example.md: no issues found
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>example</title>
    <meta content="width=device-width, initial-scale=1" name="viewport">
  </head>
  <body>
    <h1>Pluto</h1>
    <p>
      <strong>Pluto</strong> (minor-planet designation: <strong>134340 Pluto</strong>) is a
      <a href="https://en.wikipedia.org/wiki/Dwarf_planet">dwarf planet</a> in the
      <a href="https://en.wikipedia.org/wiki/Kuiper_belt">Kuiper belt</a>.
    </p>
  </body>
</html>
```

## API

This package exports the identifiers
[`defaultFootnoteBackContent`][api-default-footnote-back-content],
[`defaultFootnoteBackLabel`][api-default-footnote-back-label],
and
[`defaultHandlers`][api-default-handlers].
The default export is [`remarkRehype`][api-remark-rehype].

### `defaultFootnoteBackContent(referenceIndex, rereferenceIndex)`

See [`defaultFootnoteBackContent` from
`mdast-util-to-hast`][github-mdast-util-to-hast-default-back-content].

### `defaultFootnoteBackLabel(referenceIndex, rereferenceIndex)`

See [`defaultFootnoteBackLabel` from
`mdast-util-to-hast`][github-mdast-util-to-hast-default-back-label].

### `defaultHandlers`

See [`defaultHandlers` from
`mdast-util-to-hast`][github-mdast-util-to-hast-default-handlers].

### `unified().use(remarkRehype[, destination][, options])`

Turn markdown into HTML.

###### Parameters

* `destination`
  ([`Processor`][github-unified-processor], optional)
  — processor
* `options`
  ([`Options`][api-options], optional)
  — configuration

###### Returns

Transform ([`Transformer`][github-unified-transformer]).

##### Notes

###### Signature

* if a [processor][github-unified-processor] is given,
  runs the (rehype) plugins used on it with a hast tree,
  then discards the result
  ([*bridge mode*][github-unified-mode])
* otherwise,
  returns a hast tree,
  the plugins used after `remarkRehype` are rehype plugins
  ([*mutate mode*][github-unified-mode])

> 👉 **Note**:
> it’s highly unlikely that you want to pass a `processor`.

###### HTML

Raw HTML is available in mdast as [`html`][github-mdast-html] nodes and can be
embedded in hast as semistandard `raw` nodes.
Most plugins ignore `raw` nodes but two notable ones don’t:

* [`rehype-stringify`][github-rehype-stringify] also has an option
  `allowDangerousHtml` which will output the raw HTML;
  this is typically discouraged as noted by the option name but is useful if
  you completely trust authors
* [`rehype-raw`][github-rehype-raw] can handle the raw embedded HTML strings by
  parsing them into standard hast nodes
  (`element`, `text`, etc);
  This is a heavy task as it needs a full HTML parser,
  but it is the only way to support untrusted content

###### Footnotes

Many options supported here relate to footnotes.
Footnotes are not specified by CommonMark,
which we follow by default.
They are supported by GitHub,
so footnotes can be enabled in markdown with [`remark-gfm`][github-remark-gfm].

The options `footnoteBackLabel` and `footnoteLabel` define natural language
that explains footnotes,
which is hidden for sighted users but shown to assistive technology.
When your page is not in English,
you must define translated values.

Back references use ARIA attributes,
but the section label itself uses a heading that is hidden with an
`sr-only` class.
To show it to sighted users,
define different attributes in `footnoteLabelProperties`.

###### Clobbering

Footnotes introduces a problem,
as it links footnote calls to footnote definitions on the page through `id`
attributes generated from user content,
which results in DOM clobbering.

DOM clobbering is this:

```html
<p id=x></p>
<script>alert(x) // `x` now refers to the DOM `p#x` element</script>
```

Elements by their ID are made available by browsers on the `window` object,
which is a security risk.
Using a prefix solves this problem.

More information on how to handle clobbering and the prefix is explained in
[*Example: headings (DOM clobbering)* in
`rehype-sanitize`][github-rehype-sanitize-clobber].

###### Unknown nodes

Unknown nodes are nodes with a type that isn’t in `handlers` or `passThrough`.
The default behavior for unknown nodes is:

* when the node has a `value`
  (and doesn’t have `data.hName`, `data.hProperties`, or `data.hChildren`,
  see later),
  create a hast `text` node
* otherwise,
  create a `<div>` element
  (which could be changed with `data.hName`),
  with its children mapped from mdast to hast as well

This behavior can be changed by passing an `unknownHandler`.

### `Options`

Configuration (TypeScript type).

###### Fields

* `allowDangerousHtml`
  (`boolean`, default: `false`)
  — whether to persist raw HTML in markdown in the hast tree
* `clobberPrefix`
  (`string`, default: `'user-content-'`)
  — prefix to use before the `id` property on footnotes to prevent them from
  *clobbering*
* `footnoteBackContent`
  ([`FootnoteBackContentTemplate` from
  `mdast-util-to-hast`][github-mdast-util-to-hast-back-content-template]
  or `string`, default:
  [`defaultFootnoteBackContent` from
  `mdast-util-to-hast`][github-mdast-util-to-hast-default-back-content])
  — content of the backreference back to references
* `footnoteBackLabel`
  ([`FootnoteBackLabelTemplate` from
  `mdast-util-to-hast`][github-mdast-util-to-hast-back-label-template]
  or `string`, default:
  [`defaultFootnoteBackLabel` from
  `mdast-util-to-hast`][github-mdast-util-to-hast-default-back-label])
  — label to describe the backreference back to references
* `footnoteLabel`
  (`string`, default: `'Footnotes'`)
  — label to use for the footnotes section (affects screen readers)
* `footnoteLabelProperties`
  ([`Properties` from `@types/hast`][github-hast-properties], default:
  `{className: ['sr-only']}`)
  — properties to use on the footnote label
  (note that `id: 'footnote-label'` is always added as footnote calls use it
  with `aria-describedby` to provide an accessible label)
* `footnoteLabelTagName`
  (`string`, default: `h2`)
  — tag name to use for the footnote label
* `handlers`
  ([`Handlers` from
  `mdast-util-to-hast`][github-mdast-util-to-hast-handlers], optional)
  — extra handlers for nodes
* `passThrough`
  (`Array<Nodes['type']>`, optional)
  — list of custom mdast node types to pass through (keep) in hast (note that
  the node itself is passed, but eventual children are transformed)
* `unknownHandler`
  ([`Handler` from
  `mdast-util-to-hast`][github-mdast-util-to-hast-handler], optional)
  — handle all unknown nodes

## Examples

### Example: supporting HTML in markdown naïvely

If you completely trust the authors of the input markdown and want to allow them
to write HTML inside markdown,
you can pass `allowDangerousHtml` to `remark-rehype` and `rehype-stringify`:

```js
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeStringify, {allowDangerousHtml: true})
  .process('<a href="/wiki/Dysnomia_(moon)" onclick="alert(1)">Dysnomia</a>')

console.log(String(file))
```

Yields:

```html
<p><a href="/wiki/Dysnomia_(moon)" onclick="alert(1)">Dysnomia</a></p>
```

> ⚠️ **Danger**:
> observe that the XSS attack through `onclick` is present.

### Example: supporting HTML in markdown properly

If you do not trust the authors of the input markdown,
or if you want to make sure that rehype plugins can see HTML embedded in
markdown,
use [`rehype-raw`][github-rehype-raw].
The following example passes `allowDangerousHtml` to `remark-rehype`,
then turns the raw embedded HTML into proper HTML nodes with `rehype-raw`,
and finally sanitizes the HTML by only allowing safe things with
`rehype-sanitize`:

```js
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify)
  .process('<a href="/wiki/Dysnomia_(moon)" onclick="alert(1)">Dysnomia</a>')

console.log(String(file))
```

Running that code yields:

```html
<p><a href="/wiki/Dysnomia_(moon)">Dysnomia</a></p>
```

> ⚠️ **Danger**:
> observe that the XSS attack through `onclick` is **not** present.

### Example: footnotes in languages other than English

If you know that the markdown is authored in a language other than English,
and you’re using `remark-gfm` to match how GitHub renders markdown,
and you know that footnotes are (or can?) be used,
you should translate the labels associated with them.

Let’s first set the stage:

```js
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const doc = `
Ceres ist nach der römischen Göttin des Ackerbaus benannt;
ihr astronomisches Symbol ist daher eine stilisierte Sichel: ⚳.[^nasa-2015]

[^nasa-2015]: JPL/NASA:
    [*What is a Dwarf Planet?*](https://www.jpl.nasa.gov/infographics/what-is-a-dwarf-planet)
    In: Jet Propulsion Laboratory.
    22. April 2015,
    abgerufen am 19. Januar 2022 (englisch).
`

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(doc)

console.log(String(file))
```

Yields:

```html
<p>Ceres ist nach der römischen Göttin des Ackerbaus benannt;
ihr astronomisches Symbol ist daher eine stilisierte Sichel: ⚳.<sup><a href="#user-content-fn-nasa-2015" id="user-content-fnref-nasa-2015" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
<ol>
<li id="user-content-fn-nasa-2015">
<p>JPL/NASA:
<a href="https://www.jpl.nasa.gov/infographics/what-is-a-dwarf-planet"><em>What is a Dwarf Planet?</em></a>
In: Jet Propulsion Laboratory.
22. April 2015,
abgerufen am 19. Januar 2022 (englisch). <a href="#user-content-fnref-nasa-2015" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
</li>
</ol>
</section>
```

This is a mix of English and German that isn’t very accessible,
such as that screen readers can’t handle it nicely.
Let’s say our program *does* know that the markdown is in German.
In that case,
it’s important to translate and define the labels relating to footnotes so that
screen reader users can properly pronounce the page:

```diff
@@ -18,7 +18,16 @@ ihr astronomisches Symbol ist daher eine stilisierte Sichel: ⚳.[^nasa-2015]
 const file = await unified()
   .use(remarkParse)
   .use(remarkGfm)
-  .use(remarkRehype)
+  .use(remarkRehype, {
+    footnoteBackLabel(referenceIndex, rereferenceIndex) {
+      return (
+        'Hochspringen nach: ' +
+        (referenceIndex + 1) +
+        (rereferenceIndex > 1 ? '-' + rereferenceIndex : '')
+      )
+    },
+    footnoteLabel: 'Fußnoten'
+  })
   .use(rehypeStringify)
   .process(doc)
```

Running the code with the above patch applied,
yields:

```diff
@@ -1,13 +1,13 @@
 <p>Ceres ist nach der römischen Göttin des Ackerbaus benannt;
 ihr astronomisches Symbol ist daher eine stilisierte Sichel: ⚳.<sup><a href="#user-content-fn-nasa-2015" id="user-content-fnref-nasa-2015" data-footnote-ref aria-describedby="footnote-label">1</a></sup></p>
-<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>
+<section data-footnotes class="footnotes"><h2 class="sr-only" id="footnote-label">Fußnoten</h2>
 <ol>
 <li id="user-content-fn-nasa-2015">
 <p>JPL/NASA:
 <a href="https://www.jpl.nasa.gov/infographics/what-is-a-dwarf-planet"><em>What is a Dwarf Planet?</em></a>
 In: Jet Propulsion Laboratory.
 22. April 2015,
-abgerufen am 19. Januar 2022 (englisch). <a href="#user-content-fnref-nasa-2015" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩</a></p>
+abgerufen am 19. Januar 2022 (englisch). <a href="#user-content-fnref-nasa-2015" data-footnote-backref="" aria-label="Hochspringen nach: 1" class="data-footnote-backref">↩</a></p>
 </li>
 </ol>
 </section>
```

## HTML

See [*Algorithm* in
`mdast-util-to-hast`](https://github.com/syntax-tree/mdast-util-to-hast#algorithm)
for info on how mdast (markdown) nodes are transformed to hast (HTML).

## CSS

Assuming you know how to use (semantic) HTML and CSS,
then it should generally be straightforward to style the HTML produced by this
plugin.
With CSS,
you can get creative and style the results as you please.

Some semistandard features,
notably GFMs tasklists and footnotes,
generate HTML that be unintuitive,
as it matches exactly what GitHub produces for their website.
There is a project,
[`sindresorhus/github-markdown-css`][github-markdown-css],
that exposes the stylesheet that GitHub uses for rendered markdown,
which might either be inspirational for more complex features,
or can be used as-is to exactly match how GitHub styles rendered markdown.

The following CSS is needed to make footnotes look a bit like GitHub:

```css
/* Style the footnotes section. */
.footnotes {
  font-size: smaller;
  color: #8b949e;
  border-top: 1px solid #30363d;
}

/* Hide the section label for visual users. */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  word-wrap: normal;
  border: 0;
}

/* Place `[` and `]` around footnote calls. */
[data-footnote-ref]::before {
  content: '[';
}

[data-footnote-ref]::after {
  content: ']';
}
```

## Syntax tree

This projects turns [mdast][github-mdast] (markdown) into [hast][github-hast]
(HTML).

It extends mdast by supporting `data` fields on mdast nodes to specify how they
should be transformed.
See [*Fields on nodes* in
`mdast-util-to-hast`](https://github.com/syntax-tree/mdast-util-to-hast#fields-on-nodes)
for info on how these fields work.

It extends hast by using a semistandard raw nodes for raw HTML.
See the [*HTML* note above](#html) for more info.

## Types

This package is fully typed with [TypeScript][].
It exports the types
[`Options`][api-options].

The types of `mdast-util-to-hast` can be referenced to register data fields
with `@types/mdast` and `Raw` nodes with `@types/hast`.

```js
/**
 * @import {Root as HastRoot} from 'hast'
 * @import {Root as MdastRoot} from 'mdast'
 * @import {} from 'mdast-util-to-hast'
 */

import {visit} from 'unist-util-visit'

const mdastNode = /** @type {MdastRoot} */ ({/* … */})
console.log(mdastNode.data?.hName) // Typed as `string | undefined`.

const hastNode = /** @type {HastRoot} */ ({/* … */})

visit(hastNode, function (node) {
  // `node` can now be `raw`.
})
```

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release,
we drop support for unmaintained versions of Node.
This means we try to keep the current release line,
`remark-rehype@11`,
compatible with Node.js 16.

This plugin works with `unified` version 6+,
`remark-parse` version 3+
(used in `remark` version 7),
and `rehype-stringify` version 3+
(used in `rehype` version 5).

## Security

Use of `remark-rehype` can open you up to a
[cross-site scripting (XSS)][wikipedia-xss] attack.
Embedded **[hast][github-hast]** properties
(`hName`, `hProperties`, `hChildren`)
in [mdast][github-mdast],
custom handlers,
and the `allowDangerousHtml` option all provide openings.
Use [`rehype-sanitize`][github-rehype-sanitize] to make the tree safe.

## Related

* [`rehype-raw`][github-rehype-raw]
  — rehype plugin to parse the tree again and support `raw` nodes
* [`rehype-sanitize`][github-rehype-sanitize]
  — rehype plugin to sanitize HTML
* [`rehype-remark`][github-rehype-remark]
  — rehype plugin to turn HTML into markdown
* [`rehype-retext`](https://github.com/rehypejs/rehype-retext)
  — rehype plugin to support retext
* [`remark-retext`](https://github.com/remarkjs/remark-retext)
  — remark plugin to support retext

## Contribute

See [`contributing.md`][health-contributing] in [`remarkjs/.github`][health]
for ways to get started.
See [`support.md`][health-support] for ways to get help.

This project has a [code of conduct][health-coc].
By interacting with this repository,
organization,
or community you agree to abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[api-default-footnote-back-content]: #defaultfootnotebackcontentreferenceindex-rereferenceindex

[api-default-footnote-back-label]: #defaultfootnotebacklabelreferenceindex-rereferenceindex

[api-default-handlers]: #defaulthandlers

[api-options]: #options

[api-remark-rehype]: #unifieduseremarkrehype-destination-options

[badge-build-image]: https://github.com/remarkjs/remark-rehype/workflows/main/badge.svg

[badge-build-url]: https://github.com/remarkjs/remark-rehype/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/remarkjs/remark-rehype.svg

[badge-coverage-url]: https://codecov.io/github/remarkjs/remark-rehype

[badge-downloads-image]: https://img.shields.io/npm/dm/remark-rehype.svg

[badge-downloads-url]: https://www.npmjs.com/package/remark-rehype

[badge-size-image]: https://img.shields.io/bundlejs/size/remark-rehype

[badge-size-url]: https://bundlejs.com/?q=remark-rehype

[esmsh]: https://esm.sh

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-hast]: https://github.com/syntax-tree/hast

[github-hast-properties]: https://github.com/syntax-tree/hast#properties

[github-markdown-css]: https://github.com/sindresorhus/github-markdown-css

[github-mdast]: https://github.com/syntax-tree/mdast

[github-mdast-html]: https://github.com/syntax-tree/mdast#html

[github-mdast-util-to-hast]: https://github.com/syntax-tree/mdast-util-to-hast

[github-mdast-util-to-hast-back-content-template]: https://github.com/syntax-tree/mdast-util-to-hast#footnotebackcontenttemplate

[github-mdast-util-to-hast-back-label-template]: https://github.com/syntax-tree/mdast-util-to-hast#footnotebacklabeltemplate

[github-mdast-util-to-hast-default-back-content]: https://github.com/syntax-tree/mdast-util-to-hast#defaultfootnotebackcontentreferenceindex-rereferenceindex

[github-mdast-util-to-hast-default-back-label]: https://github.com/syntax-tree/mdast-util-to-hast#defaultfootnotebacklabelreferenceindex-rereferenceindex

[github-mdast-util-to-hast-default-handlers]: https://github.com/syntax-tree/mdast-util-to-hast#defaulthandlers

[github-mdast-util-to-hast-handler]: https://github.com/syntax-tree/mdast-util-to-hast#handler

[github-mdast-util-to-hast-handlers]: https://github.com/syntax-tree/mdast-util-to-hast#handlers

[github-rehype]: https://github.com/rehypejs/rehype

[github-rehype-format]: https://github.com/rehypejs/rehype-format

[github-rehype-meta]: https://github.com/rehypejs/rehype-meta

[github-rehype-minify]: https://github.com/rehypejs/rehype-minify

[github-rehype-raw]: https://github.com/rehypejs/rehype-raw

[github-rehype-remark]: https://github.com/rehypejs/rehype-remark

[github-rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[github-rehype-sanitize-clobber]: https://github.com/rehypejs/rehype-sanitize#example-headings-dom-clobbering

[github-rehype-starry-night]: https://github.com/rehypejs/rehype-starry-night

[github-rehype-stringify]: https://github.com/rehypejs/rehype/tree/main/packages/rehype-stringify

[github-remark]: https://github.com/remarkjs/remark

[github-remark-gfm]: https://github.com/remarkjs/remark-gfm

[github-unified]: https://github.com/unifiedjs/unified

[github-unified-mode]: https://github.com/unifiedjs/unified#transforming-between-ecosystems

[github-unified-processor]: https://github.com/unifiedjs/unified#processor

[github-unified-transformer]: https://github.com/unifiedjs/unified#transformer

[health]: https://github.com/remarkjs/.github

[health-coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[health-contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[health-support]: https://github.com/remarkjs/.github/blob/main/support.md

[npmjs-install]: https://docs.npmjs.com/cli/install

[typescript]: https://www.typescriptlang.org

[wikipedia-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[wooorm]: https://wooorm.com


# hast-util-to-jsx-runtime

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

hast utility to transform a tree to
preact, react, solid, svelte, vue, etcetera,
with an automatic JSX runtime.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`toJsxRuntime(tree, options)`](#tojsxruntimetree-options)
  * [`Components`](#components)
  * [`CreateEvaluater`](#createevaluater)
  * [`ElementAttributeNameCase`](#elementattributenamecase)
  * [`EvaluateExpression`](#evaluateexpression)
  * [`EvaluateProgram`](#evaluateprogram)
  * [`Evaluater`](#evaluater)
  * [`ExtraProps`](#extraprops)
  * [`Fragment`](#fragment)
  * [`Jsx`](#jsx)
  * [`JsxDev`](#jsxdev)
  * [`Options`](#options)
  * [`Props`](#props)
  * [`Source`](#source)
  * [`Space`](#space)
  * [`StylePropertyNameCase`](#stylepropertynamecase)
* [Errors](#errors)
* [Examples](#examples)
  * [Example: Preact](#example-preact)
  * [Example: Solid](#example-solid)
  * [Example: Svelte](#example-svelte)
  * [Example: Vue](#example-vue)
* [Syntax](#syntax)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a utility that takes a [hast][github-hast] tree and an
[automatic JSX runtime][reactjs-jsx-runtime] and turns the tree into anything
you wish.

## When should I use this?

You can use this package when you have a hast syntax tree and want to use it
with whatever framework.

This package uses an automatic JSX runtime,
which is a sort of lingua franca for frameworks to support JSX.

Notably,
automatic runtimes have support for passing extra information in development,
and have guaranteed support for fragments.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npmjs-install]:

```sh
npm install hast-util-to-jsx-runtime
```

In Deno with [`esm.sh`][esmsh]:

```js
import {toJsxRuntime} from 'https://esm.sh/hast-util-to-jsx-runtime@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {toJsxRuntime} from 'https://esm.sh/hast-util-to-jsx-runtime@2?bundle'
</script>
```

## Use

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsxs, jsx} from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'

const tree = h('h1', 'Hello, world!')

const doc = renderToStaticMarkup(toJsxRuntime(tree, {Fragment, jsxs, jsx}))

console.log(doc)
```

Yields:

```html
<h1>Hello, world!</h1>
```

> **Note**:
> to add better type support,
> register a global JSX namespace:
>
> ```ts
> import type {JSX as Jsx} from 'react/jsx-runtime'
>
> declare global {
>   namespace JSX {
>     type ElementClass = Jsx.ElementClass
>     type Element = Jsx.Element
>     type IntrinsicElements = Jsx.IntrinsicElements
>   }
> }
> ```

## API

This package exports the identifier [`toJsxRuntime`][api-to-jsx-runtime].
It exports the [TypeScript][] types
[`Components`][api-components],
[`CreateEvaluater`][api-create-evaluater],
[`ElementAttributeNameCase`][api-element-attribute-name-case],
[`EvaluateExpression`][api-evaluate-expression],
[`EvaluateProgram`][api-evaluate-program],
[`Evaluater`][api-evaluater],
[`ExtraProps`][api-extra-props],
[`Fragment`][api-fragment],
[`Jsx`][api-jsx],
[`JsxDev`][api-jsx-dev],
[`Options`][api-options],
[`Props`][api-props],
[`Source`][api-source],
[`Space`][api-Space],
and
[`StylePropertyNameCase`][api-style-property-name-case].
There is no default export.

### `toJsxRuntime(tree, options)`

Transform a hast tree to
preact, react, solid, svelte, vue, etcetera,
with an automatic JSX runtime.

##### Parameters

* `tree`
  ([`Node`][github-hast-nodes])
  — tree to transform
* `options`
  ([`Options`][api-options], required)
  — configuration

##### Returns

Result from your configured JSX runtime
(`JSX.Element` if defined,
otherwise `unknown` which you can cast yourself).

### `Components`

Possible components to use (TypeScript type).

Each key is a tag name typed in `JSX.IntrinsicElements`,
if defined.
Each value is either a different tag name
or a component accepting the corresponding props
(and an optional `node` prop if `passNode` is on).

You can access props at `JSX.IntrinsicElements`.
For example,
to find props for `a`,
use `JSX.IntrinsicElements['a']`.

###### Type

```ts
import type {Element} from 'hast'

type ExtraProps = {node?: Element | undefined}

type Components = {
  [TagName in keyof JSX.IntrinsicElements]:
    | Component<JSX.IntrinsicElements[TagName] & ExtraProps>
    | keyof JSX.IntrinsicElements
}

type Component<ComponentProps> =
  // Class component:
  | (new (props: ComponentProps) => JSX.ElementClass)
  // Function component:
  | ((props: ComponentProps) => JSX.Element | string | null | undefined)
```

### `CreateEvaluater`

Create an evaluator that turns ESTree ASTs from embedded MDX into values
(TypeScript type).

###### Parameters

There are no parameters.

###### Returns

Evaluater ([`Evaluater`][api-evaluater]).

### `ElementAttributeNameCase`

Casing to use for attribute names (TypeScript type).

HTML casing is for example
`class`, `stroke-linecap`, `xml:lang`.
React casing is for example
`className`, `strokeLinecap`, `xmlLang`.

###### Type

```ts
type ElementAttributeNameCase = 'html' | 'react'
```

### `EvaluateExpression`

Turn an MDX expression into a value (TypeScript type).

###### Parameters

* `expression` (`Expression` from `@types/estree`)
  — estree expression

###### Returns

Result of expression (`unknown`).

### `EvaluateProgram`

Turn an MDX program (export/import statements) into a value (TypeScript type).

###### Parameters

* `program` (`Program` from `@types/estree`)
  — estree program

###### Returns

Result of program (`unknown`);
should likely be `undefined` as ESM changes the scope but doesn’t yield
something.

### `Evaluater`

Evaluator that turns ESTree ASTs from embedded MDX into values (TypeScript
type).

###### Fields

* `evaluateExpression` ([`EvaluateExpression`][api-evaluate-expression])
  — evaluate an expression
* `evaluateProgram` ([`EvaluateProgram`][api-evaluate-program])
  — evaluate a program

### `ExtraProps`

Extra fields we pass (TypeScript type).

###### Type

```ts
type ExtraProps = {node?: Element | undefined}
```

### `Fragment`

Represent the children,
typically a symbol (TypeScript type).

###### Type

```ts
type Fragment = unknown
```

### `Jsx`

Create a production element (TypeScript type).

###### Parameters

* `type` (`unknown`)
  — element type:
  `Fragment` symbol,
  tag name (`string`),
  component
* `props` ([`Props`][api-props])
  — element props,
  `children`,
  and maybe `node`
* `key` (`string` or `undefined`)
  — dynamicly generated key to use

###### Returns

Element from your framework
(`JSX.Element` if defined,
otherwise `unknown` which you can cast yourself).

### `JsxDev`

Create a development element (TypeScript type).

###### Parameters

* `type` (`unknown`)
  — element type:
  `Fragment` symbol,
  tag name (`string`),
  component
* `props` ([`Props`][api-props])
  — element props,
  `children`,
  and maybe `node`
* `key` (`string` or `undefined`)
  — dynamicly generated key to use
* `isStaticChildren` (`boolean`)
  — whether two or more children are passed (in an array),
  which is whether `jsxs` or `jsx` would be used
* `source` ([`Source`][api-source])
  — info about source
* `self` (`undefined`)
  — nothing (this is used by frameworks that have components,
  we don’t)

###### Returns

Element from your framework
(`JSX.Element` if defined,
otherwise `unknown` which you can cast yourself).

### `Options`

Configuration (TypeScript type).

###### Fields

* `Fragment` ([`Fragment`][api-fragment], required)
  — fragment
* `jsxDEV` ([`JsxDev`][api-jsx-dev], required in development)
  — development JSX
* `jsxs` ([`Jsx`][api-jsx], required in production)
  — static JSX
* `jsx` ([`Jsx`][api-jsx], required in production)
  — dynamic JSX
* `components` ([`Partial<Components>`][api-components], optional)
  — components to use
* `createEvaluater` ([`CreateEvaluater`][api-create-evaluater], optional)
  — create an evaluator that turns ESTree ASTs into values
* `development` (`boolean`, default: `false`)
  — whether to use `jsxDEV` when on or `jsx` and `jsxs` when off
* `elementAttributeNameCase`
  ([`ElementAttributeNameCase`][api-element-attribute-name-case],
  default: `'react'`)
  — specify casing to use for attribute names
* `filePath` (`string`, optional)
  — file path to the original source file,
  passed in source info to `jsxDEV` when using the automatic runtime with
  `development: true`
* `passNode` (`boolean`, default: `false`)
  — pass the hast element node to components
* `space` ([`Space`][api-space], default: `'html'`)
  — whether `tree` is in the `'html'` or `'svg'` space, when an `<svg>`
  element is found in the HTML space,
  this package already automatically switches to and from the SVG space when
  entering and exiting it
* `stylePropertyNameCase`
  ([`StylePropertyNameCase`][api-style-property-name-case],
  default: `'dom'`)
  — specify casing to use for property names in `style` objects
* `tableCellAlignToStyle`
  (`boolean`, default: `true`)
  — turn obsolete `align` props on `td` and `th` into CSS `style` props

### `Props`

Properties and children (TypeScript type).

###### Type

```ts
import type {Element} from 'hast'

type Props = {
  [prop: string]:
    | Array<JSX.Element | string | null | undefined> // For `children`.
    | Record<string, string> // For `style`.
    | Element // For `node`.
    | boolean
    | number
    | string
    | undefined
  children: Array<JSX.Element | string | null | undefined> | undefined
  node?: Element | undefined
}
```

### `Source`

Info about source (TypeScript type).

###### Fields

* `columnNumber` (`number` or `undefined`)
  — column where thing starts (0-indexed)
* `fileName` (`string` or `undefined`)
  — name of source file
* `lineNumber` (`number` or `undefined`)
  — line where thing starts (1-indexed)

### `Space`

Namespace (TypeScript type).

> 👉 **Note**:
> hast is not XML;
> it supports SVG as embedded in HTML;
> it does not support the features available in XML;
> passing SVG might break but fragments of modern SVG should be fine;
> use `xast` if you need to support SVG as XML.

###### Type

```ts
type Space = 'html' | 'svg'
```

### `StylePropertyNameCase`

Casing to use for property names in `style` objects (TypeScript type).

CSS casing is for example `background-color` and `-webkit-line-clamp`.
DOM casing is for example `backgroundColor` and `WebkitLineClamp`.

###### Type

```ts
type StylePropertyNameCase = 'css' | 'dom'
```

## Errors

The following errors are thrown:

###### ``Expected `Fragment` in options``

This error is thrown when either `options` is not passed at all or
when `options.Fragment` is `undefined`.

The automatic JSX runtime needs a symbol for a fragment to work.

To solve the error,
make sure you are passing the correct fragment symbol from your framework.

###### `` Expected `jsxDEV` in options when `development: true` ``

This error is thrown when `options.development` is turned on (`true`),
but when `options.jsxDEV` is not a function.

The automatic JSX runtime,
in development,
needs this function.

To solve the error,
make sure you are importing the correct runtime functions
(for example, `'react/jsx-dev-runtime'`),
and pass `jsxDEV`.

###### ``Expected `jsx` in production options``

###### ``Expected `jsxs` in production options``

These errors are thrown when `options.development` is *not* turned on
(`false` or not defined),
and when `options.jsx` or `options.jsxs` are not functions.

The automatic JSX runtime,
in production,
needs these functions.

To solve the error,
make sure you are importing the correct runtime functions
(for example, `'react/jsx-runtime'`),
and pass `jsx` and `jsxs`.

###### `` Cannot handle MDX estrees without `createEvaluater` ``

This error is thrown when MDX nodes are passed that represent JavaScript
programs or expressions.

Supporting JavaScript can be unsafe and requires a different project.
To support JavaScript,
pass a `createEvaluater` function in `options`.

###### ``Cannot parse `style` attribute``

This error is thrown when a `style` attribute is found on an element,
which cannot be parsed as CSS.

Most frameworks don’t accept `style` as a string,
so we need to parse it as CSS,
and pass it as an object.
But when broken CSS is used,
such as `style="color:red; /*"`,
we crash.

To solve the error,
make sure authors write valid CSS.
Alternatively,
pass `options.ignoreInvalidStyle: true` to swallow these errors.

## Examples

### Example: Preact

> 👉 **Note**:
> you must set `elementAttributeNameCase: 'html'` for preact.

In Node.js,
do:

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'preact/jsx-runtime'
import {render} from 'preact-render-to-string'

const result = render(
  toJsxRuntime(h('h1', 'hi!'), {
    Fragment,
    jsx,
    jsxs,
    elementAttributeNameCase: 'html'
  })
)

console.log(result)
```

Yields:

```html
<h1>hi!</h1>
```

In a browser,
do:

```js
import {h} from 'https://esm.sh/hastscript@9'
import {toJsxRuntime} from 'https://esm.sh/hast-util-to-jsx-runtime@2'
import {Fragment, jsx, jsxs} from 'https://esm.sh/preact@10/jsx-runtime'
import {render} from 'https://esm.sh/preact@10'

render(
  toJsxRuntime(h('h1', 'hi!'), {
    Fragment,
    jsx,
    jsxs,
    elementAttributeNameCase: 'html'
  }),
  document.getElementById('root')
)
```

To add better type support,
register a global JSX namespace:

```ts
import type {JSX as Jsx} from 'preact/jsx-runtime'

declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass
    type Element = Jsx.Element
    type IntrinsicElements = Jsx.IntrinsicElements
  }
}
```

### Example: Solid

> 👉 **Note**:
> you must set `elementAttributeNameCase: 'html'` and
> `stylePropertyNameCase: 'css'` for Solid.

In Node.js,
do:

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'solid-jsx/jsx-runtime'

console.log(
  toJsxRuntime(h('h1', 'hi!'), {
    Fragment,
    jsx,
    jsxs,
    elementAttributeNameCase: 'html',
    stylePropertyNameCase: 'css'
  }).t
)
```

Yields:

```html
<h1 >hi!</h1>
```

In a browser,
do:

```js
import {h} from 'https://esm.sh/hastscript@9'
import {toJsxRuntime} from 'https://esm.sh/hast-util-to-jsx-runtime@2'
import {Fragment, jsx, jsxs} from 'https://esm.sh/solid-js@1/h/jsx-runtime'
import {render} from 'https://esm.sh/solid-js@1/web'

render(Component, document.getElementById('root'))

function Component() {
  return toJsxRuntime(h('h1', 'hi!'), {
    Fragment,
    jsx,
    jsxs,
    elementAttributeNameCase: 'html',
    stylePropertyNameCase: 'css'
  })
}
```

To add better type support,
register a global JSX namespace:

```ts
import type {JSX as Jsx} from 'solid-js/jsx-runtime'

declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass
    type Element = Jsx.Element
    type IntrinsicElements = Jsx.IntrinsicElements
  }
}
```

### Example: Svelte

<!-- To do: improve svelte when it fixes a bunch of bugs. -->

I have no clue how to render a Svelte component in Node,
but you can get that component with:

```js
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'svelte-jsx'

const svelteComponent = toJsxRuntime(h('h1', 'hi!'), {Fragment, jsx, jsxs})

console.log(svelteComponent)
```

Yields:

```text
[class Component extends SvelteComponent]
```

Types for Svelte are broken.
Raise it with Svelte.

### Example: Vue

> 👉 **Note**:
> you must set `elementAttributeNameCase: 'html'` for Vue.

In Node.js,
do:

```js
import serverRenderer from '@vue/server-renderer'
import {h} from 'hastscript'
import {toJsxRuntime} from 'hast-util-to-jsx-runtime'
import {Fragment, jsx, jsxs} from 'vue/jsx-runtime' // Available since `vue@3.3`.

console.log(
  await serverRenderer.renderToString(
    toJsxRuntime(h('h1', 'hi!'), {
      Fragment,
      jsx,
      jsxs,
      elementAttributeNameCase: 'html'
    })
  )
)
```

Yields:

```html
<h1>hi!</h1>
```

In a browser,
do:

```js
import {h} from 'https://esm.sh/hastscript@9'
import {toJsxRuntime} from 'https://esm.sh/hast-util-to-jsx-runtime@2'
import {createApp} from 'https://esm.sh/vue@3'
import {Fragment, jsx, jsxs} from 'https://esm.sh/vue@3/jsx-runtime'

createApp(Component).mount('#root')

function Component() {
  return toJsxRuntime(h('h1', 'hi!'), {
    Fragment,
    jsx,
    jsxs,
    elementAttributeNameCase: 'html'
  })
}
```

To add better type support,
register a global JSX namespace:

```ts
import type {JSX as Jsx} from 'vue/jsx-runtime'

declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass
    type Element = Jsx.Element
    type IntrinsicElements = Jsx.IntrinsicElements
  }
}
```

## Syntax

HTML is parsed according to WHATWG HTML (the living standard),
which is also followed by browsers such as Chrome,
Firefox,
and Safari.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release,
we drop support for unmaintained versions of Node.
This means we try to keep the current release line,
`hast-util-to-jsx-runtime@2`,
compatible with Node.js 16.

## Security

Be careful with user input in your hast tree.
Use [`hast-util-santize`][github-hast-util-sanitize] to make hast trees safe.

## Related

* [`hastscript`](https://github.com/syntax-tree/hastscript)
  — build hast trees
* [`hast-util-to-html`](https://github.com/syntax-tree/hast-util-to-html)
  — serialize hast as HTML
* [`hast-util-sanitize`][github-hast-util-sanitize]
  — sanitize hast

## Contribute

See [`contributing.md`][health-contributing]
in
[`syntax-tree/.github`][health]
for ways to get started.
See [`support.md`][health-support] for ways to get help.

This project has a [code of conduct][health-coc].
By interacting with this repository,
organization,
or community you agree to abide by its terms.

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[api-components]: #components

[api-create-evaluater]: #createevaluater

[api-element-attribute-name-case]: #elementattributenamecase

[api-evaluate-expression]: #evaluateexpression

[api-evaluate-program]: #evaluateprogram

[api-evaluater]: #evaluater

[api-extra-props]: #extraprops

[api-fragment]: #fragment

[api-jsx]: #jsx

[api-jsx-dev]: #jsxdev

[api-options]: #options

[api-props]: #props

[api-source]: #source

[api-space]: #space

[api-style-property-name-case]: #stylepropertynamecase

[api-to-jsx-runtime]: #tojsxruntimetree-options

[badge-build-image]: https://github.com/syntax-tree/hast-util-to-jsx-runtime/workflows/main/badge.svg

[badge-build-url]: https://github.com/syntax-tree/hast-util-to-jsx-runtime/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-jsx-runtime.svg

[badge-coverage-url]: https://codecov.io/github/syntax-tree/hast-util-to-jsx-runtime

[badge-downloads-image]: https://img.shields.io/npm/dm/hast-util-to-jsx-runtime.svg

[badge-downloads-url]: https://www.npmjs.com/package/hast-util-to-jsx-runtime

[badge-size-image]: https://img.shields.io/bundlejs/size/hast-util-to-jsx-runtime

[badge-size-url]: https://bundlejs.com/?q=hast-util-to-jsx-runtime

[esmsh]: https://esm.sh

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-hast]: https://github.com/syntax-tree/hast

[github-hast-nodes]: https://github.com/syntax-tree/hast#nodes

[github-hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[health]: https://github.com/syntax-tree/.github

[health-coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[health-contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[health-support]: https://github.com/syntax-tree/.github/blob/main/support.md

[npmjs-install]: https://docs.npmjs.com/cli/install

[reactjs-jsx-runtime]: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com


<h1>
  <img src="https://raw.githubusercontent.com/vfile/vfile/fc8164b/logo.svg?sanitize=true" alt="vfile" />
</h1>

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**vfile** is a small and browser friendly virtual file format that tracks
metadata about files (such as its `path` and `value`) and lint
[messages][api-vfile-messages].

## Contents

* [unified](#unified)
* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`VFile(options?)`](#vfileoptions)
  * [`file.cwd`](#filecwd)
  * [`file.data`](#filedata)
  * [`file.history`](#filehistory)
  * [`file.messages`](#filemessages)
  * [`file.value`](#filevalue)
  * [`file.basename`](#filebasename)
  * [`file.dirname`](#filedirname)
  * [`file.extname`](#fileextname)
  * [`file.path`](#filepath)
  * [`file.stem`](#filestem)
  * [`VFile#fail(reason[, options])`](#vfilefailreason-options)
  * [`VFile#info(reason[, options])`](#vfileinforeason-options)
  * [`VFile#message(reason[, options])`](#vfilemessagereason-options)
  * [`VFile#toString(encoding?)`](#vfiletostringencoding)
  * [`Compatible`](#compatible)
  * [`Data`](#data)
  * [`DataMap`](#datamap)
  * [`Map`](#map)
  * [`MessageOptions`](#messageoptions)
  * [`Options`](#options)
  * [`Reporter`](#reporter)
  * [`ReporterSettings`](#reportersettings)
  * [`Value`](#value)
  * [Well-known](#well-known)
* [List of utilities](#list-of-utilities)
* [Reporters](#reporters)
* [Types](#types)
* [Compatibility](#compatibility)
* [Contribute](#contribute)
* [Sponsor](#sponsor)
* [Acknowledgments](#acknowledgments)
* [License](#license)

## unified

**vfile** is part of the unified collective.

* for more about us, see [`unifiedjs.com`][site]
* for how the collective is governed, see [`unifiedjs/collective`][governance]
* for updates, see [@unifiedjs][twitter] on Twitter

## What is this?

This package provides a virtual file format.
It exposes an API to access the file value, path, metadata about the file, and
specifically supports attaching lint messages and errors to certain places in
these files.

## When should I use this?

The virtual file format is useful when dealing with the concept of files in
places where you might not be able to access the file system.
The message API is particularly useful when making things that check files (as
in, linting).

vfile is made for [unified][], which amongst other things checks files.
However, vfile can be used in other projects that deal with parsing,
transforming, and serializing data, to build linters, compilers, static site
generators, and other build tools.

This is different from the excellent [`vinyl`][vinyl] in that vfile has a
smaller API, a smaller size, and focuses on messages.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install vfile
```

In Deno with [`esm.sh`][esmsh]:

```js
import {VFile} from 'https://esm.sh/vfile@6'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {VFile} from 'https://esm.sh/vfile@6?bundle'
</script>
```

## Use

```js
import {VFile} from 'vfile'

const file = new VFile({
  path: '~/example.txt',
  value: 'Alpha *braavo* charlie.'
})

console.log(file.path) // => '~/example.txt'
console.log(file.dirname) // => '~'

file.extname = '.md'

console.log(file.basename) // => 'example.md'

file.basename = 'index.text'

console.log(file.history) // => ['~/example.txt', '~/example.md', '~/index.text']

file.message('Unexpected unknown word `braavo`, did you mean `bravo`?', {
  place: {line: 1, column: 8},
  source: 'spell',
  ruleId: 'typo'
})

console.log(file.messages)
```

Yields:

```txt
[
  [~/index.text:1:8: Unexpected unknown word `braavo`, did you mean `bravo`?] {
    ancestors: undefined,
    cause: undefined,
    column: 8,
    fatal: false,
    line: 1,
    place: { line: 1, column: 8 },
    reason: 'Unexpected unknown word `braavo`, did you mean `bravo`?',
    ruleId: 'typo',
    source: 'spell',
    file: '~/index.text'
  }
]
```

## API

This package exports the identifier [`VFile`][api-vfile].
There is no default export.

### `VFile(options?)`

Create a new virtual file.

`options` is treated as:

* `string` or [`Uint8Array`][mdn-uint8-array] — `{value: options}`
* `URL` — `{path: options}`
* `VFile` — shallow copies its data over to the new file
* `object` — all fields are shallow copied over to the new file

Path related fields are set in the following order (least specific to
most specific): `history`, `path`, `basename`, `stem`, `extname`,
`dirname`.

You cannot set `dirname` or `extname` without setting either `history`,
`path`, `basename`, or `stem` too.

###### Parameters

* `options` ([`Compatible`][api-compatible], optional)
  — file value

###### Returns

New instance (`VFile`).

###### Example

```js
new VFile()
new VFile('console.log("alpha");')
new VFile(new Uint8Array([0x65, 0x78, 0x69, 0x74, 0x20, 0x31]))
new VFile({path: path.join('path', 'to', 'readme.md')})
new VFile({stem: 'readme', extname: '.md', dirname: path.join('path', 'to')})
new VFile({other: 'properties', are: 'copied', ov: {e: 'r'}})
```

### `file.cwd`

Base of `path` (`string`, default: `process.cwd()` or `'/'` in browsers).

### `file.data`

Place to store custom info (`Record<string, unknown>`, default: `{}`).

It’s OK to store custom data directly on the file but moving it to `data` is
recommended.

### `file.history`

List of file paths the file moved between (`Array<string>`).

The first is the original path and the last is the current path.

### `file.messages`

List of messages associated with the file
([`Array<VFileMessage>`][api-vfile-message]).

### `file.value`

Raw value ([`Uint8Array`][mdn-uint8-array], `string`, `undefined`).

### `file.basename`

Get or set the basename (including extname) (`string?`, example: `'index.min.js'`).

Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'` on
windows).
Cannot be nullified (use `file.path = file.dirname` instead).

### `file.dirname`

Get or set the parent path (`string?`, example: `'~'`).

Cannot be set if there’s no `path` yet.

### `file.extname`

Get or set the extname (including dot) (`string?`, example: `'.js'`).

Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'` on
windows).
Cannot be set if there’s no `path` yet.

### `file.path`

Get or set the full path (`string?`, example: `'~/index.min.js'`).

Cannot be nullified.
You can set a file URL (a `URL` object with a `file:` protocol) which will be
turned into a path with [`url.fileURLToPath`][file-url-to-path].

### `file.stem`

Get or set the stem (basename w/o extname) (`string?`, example: `'index.min'`).

Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'` on
windows).
Cannot be nullified.

### `VFile#fail(reason[, options])`

Create a fatal message for `reason` associated with the file.

The `fatal` field of the message is set to `true` (error; file not usable) and
the `file` field is set to the current file path.
The message is added to the `messages` field on `file`.

> 🪦 **Note**: also has obsolete signatures.

###### Parameters

* `reason` (`string`)
  — reason for message, should use markdown
* `options` ([`MessageOptions`][api-message-options], optional)
  — configuration

###### Returns

Nothing (`never`).

###### Throws

Message ([`VFileMessage`][vmessage]).

### `VFile#info(reason[, options])`

Create an info message for `reason` associated with the file.

The `fatal` field of the message is set to `undefined` (info; change likely not
needed) and the `file` field is set to the current file path.
The message is added to the `messages` field on `file`.

> 🪦 **Note**: also has obsolete signatures.

###### Parameters

* `reason` (`string`)
  — reason for message, should use markdown
* `options` ([`MessageOptions`][api-message-options], optional)
  — configuration

###### Returns

Message ([`VFileMessage`][vmessage]).

### `VFile#message(reason[, options])`

Create a message for `reason` associated with the file.

The `fatal` field of the message is set to `false` (warning; change may be
needed) and the `file` field is set to the current file path.
The message is added to the `messages` field on `file`.

> 🪦 **Note**: also has obsolete signatures.

###### Parameters

* `reason` (`string`)
  — reason for message, should use markdown
* `options` ([`MessageOptions`][api-message-options], optional)
  — configuration

###### Returns

Message ([`VFileMessage`][vmessage]).

### `VFile#toString(encoding?)`

Serialize the file.

> **Note**: which encodings are supported depends on the engine.
> For info on Node.js, see:
> <https://nodejs.org/api/util.html#whatwg-supported-encodings>.

###### Parameters

* `encoding` (`string`, default: `'utf8'`)
  — character encoding to understand `value` as when it’s a
  [`Uint8Array`][mdn-uint8-array]

###### Returns

Serialized file (`string`).

### `Compatible`

Things that can be passed to the constructor (TypeScript type).

###### Type

```ts
type Compatible = Options | URL | VFile | Value
```

### `Data`

Custom info (TypeScript type).

Known attributes can be added to [`DataMap`][api-data-map].

###### Type

```ts
type Data = Record<string, unknown> & Partial<DataMap>
```

### `DataMap`

This map registers the type of the `data` key of a `VFile` (TypeScript type).

This type can be augmented to register custom `data` types.

###### Type

```ts
interface DataMap {}
```

###### Example

```ts
declare module 'vfile' {
  interface DataMap {
    // `file.data.name` is typed as `string`
    name: string
  }
}
```

### `Map`

Raw source map (TypeScript type).

See [`source-map`][source-map].

###### Fields

* `version` (`number`)
  — which version of the source map spec this map is following
* `sources` (`Array<string>`)
  — an array of URLs to the original source files
* `names` (`Array<string>`)
  — an array of identifiers which can be referenced by individual mappings
* `sourceRoot` (`string`, optional)
  — the URL root from which all sources are relative
* `sourcesContent` (`Array<string>`, optional)
  — an array of contents of the original source files
* `mappings` (`string`)
  — a string of base64 VLQs which contain the actual mappings
* `file` (`string`)
  — the generated file this source map is associated with

### `MessageOptions`

Options to create messages (TypeScript type).

See [`Options` in `vfile-message`][vfile-message-options].

### `Options`

An object with arbitrary fields and the following known fields (TypeScript
type).

###### Fields

* `basename` (`string`, optional)
  — set `basename` (name)
* `cwd` (`string`, optional)
  — set `cwd` (working directory)
* `data` ([`Data`][api-data], optional)
  — set `data` (associated info)
* `dirname` (`string`, optional)
  — set `dirname` (path w/o basename)
* `extname` (`string`, optional)
  — set `extname` (extension with dot)
* `history` (`Array<string>`, optional)
  — set `history` (paths the file moved between)
* `path` (`URL | string`, optional)
  — set `path` (current path)
* `stem` (`string`, optional)
  — set `stem` (name without extension)
* `value` ([`Value`][api-value], optional)
  — set `value` (the contents of the file)

### `Reporter`

Type for a reporter (TypeScript type).

###### Type

```ts
type Reporter<Settings = ReporterSettings> = (
  files: Array<VFile>,
  options: Settings
) => string
```

### `ReporterSettings`

Configuration for reporters (TypeScript type).

###### Type

```ts
type ReporterSettings = Record<string, unknown>
```

### `Value`

Contents of the file (TypeScript type).

Can either be text or a [`Uint8Array`][mdn-uint8-array] structure.

###### Type

```ts
type Value = Uint8Array | string
```

### Well-known

The following fields are considered “non-standard”, but they are allowed, and
some utilities use them:

* `map` ([`Map`][api-map])
  — source map; this type is equivalent to the `RawSourceMap` type from the
  `source-map` module
* `result` (`unknown`)
  — custom, non-string, compiled, representation; this is used by unified to
  store non-string results; one example is when turning markdown into React
  nodes
* `stored` (`boolean`)
  — whether a file was saved to disk; this is used by vfile reporters

There are also well-known fields on messages, see
[them in a similar section of
`vfile-message`](https://github.com/vfile/vfile-message#well-known).

<a name="utilities"></a>

## List of utilities

* [`convert-vinyl-to-vfile`](https://github.com/dustinspecker/convert-vinyl-to-vfile)
  — transform from [Vinyl][]
* [`to-vfile`](https://github.com/vfile/to-vfile)
  — create a file from a file path and read and write to the file system
* [`vfile-find-down`](https://github.com/vfile/vfile-find-down)
  — find files by searching the file system downwards
* [`vfile-find-up`](https://github.com/vfile/vfile-find-up)
  — find files by searching the file system upwards
* [`vfile-glob`](https://github.com/shinnn/vfile-glob)
  — find files by glob patterns
* [`vfile-is`](https://github.com/vfile/vfile-is)
  — check if a file passes a test
* [`vfile-location`](https://github.com/vfile/vfile-location)
  — convert between positional and offset locations
* [`vfile-matter`](https://github.com/vfile/vfile-matter)
  — parse the YAML front matter
* [`vfile-message`](https://github.com/vfile/vfile-message)
  — create a file message
* [`vfile-messages-to-vscode-diagnostics`](https://github.com/shinnn/vfile-messages-to-vscode-diagnostics)
  — transform file messages to VS Code diagnostics
* [`vfile-mkdirp`](https://github.com/vfile/vfile-mkdirp)
  — make sure the directory of a file exists on the file system
* [`vfile-rename`](https://github.com/vfile/vfile-rename)
  — rename the path parts of a file
* [`vfile-sort`](https://github.com/vfile/vfile-sort)
  — sort messages by line/column
* [`vfile-statistics`](https://github.com/vfile/vfile-statistics)
  — count messages per category: failures, warnings, etc
* [`vfile-to-eslint`](https://github.com/vfile/vfile-to-eslint)
  — convert to ESLint formatter compatible output

> 👉 **Note**: see [unist][] for projects that work with nodes.

## Reporters

* [`vfile-reporter`][reporter]
  — create a report
* [`vfile-reporter-json`](https://github.com/vfile/vfile-reporter-json)
  — create a JSON report
* [`vfile-reporter-folder-json`](https://github.com/vfile/vfile-reporter-folder-json)
  — create a JSON representation of vfiles
* [`vfile-reporter-pretty`](https://github.com/vfile/vfile-reporter-pretty)
  — create a pretty report
* [`vfile-reporter-junit`](https://github.com/kellyselden/vfile-reporter-junit)
  — create a jUnit report
* [`vfile-reporter-position`](https://github.com/Hocdoc/vfile-reporter-position)
  — create a report with content excerpts

> 👉 **Note**: want to make your own reporter?
> Reporters *must* accept `Array<VFile>` as their first argument, and return
> `string`.
> Reporters *may* accept other values too, in which case it’s suggested to stick
> to `vfile-reporter`s interface.

## Types

This package is fully typed with [TypeScript][].
It exports the additional types
[`Compatible`][api-compatible],
[`Data`][api-data],
[`DataMap`][api-data-map],
[`Map`][api-map],
[`MessageOptions`][api-message-options],
[`Options`][api-options],
[`Reporter`][api-reporter],
[`ReporterSettings`][api-reporter-settings], and
[`Value`][api-value].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `vfile@^6`,
compatible with Node.js 16.

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## Sponsor

Support this effort and give back by sponsoring on [OpenCollective][collective]!

<table>
<tr valign="middle">
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://vercel.com">Vercel</a><br><br>
  <a href="https://vercel.com"><img src="https://avatars1.githubusercontent.com/u/14985020?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://motif.land">Motif</a><br><br>
  <a href="https://motif.land"><img src="https://avatars1.githubusercontent.com/u/74457950?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.hashicorp.com">HashiCorp</a><br><br>
  <a href="https://www.hashicorp.com"><img src="https://avatars1.githubusercontent.com/u/761456?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.gitbook.com">GitBook</a><br><br>
  <a href="https://www.gitbook.com"><img src="https://avatars1.githubusercontent.com/u/7111340?s=256&v=4" width="128"></a>
</td>
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.gatsbyjs.org">Gatsby</a><br><br>
  <a href="https://www.gatsbyjs.org"><img src="https://avatars1.githubusercontent.com/u/12551863?s=256&v=4" width="128"></a>
</td>
</tr>
<tr valign="middle">
</tr>
<tr valign="middle">
<td width="20%" align="center" rowspan="2" colspan="2">
  <a href="https://www.netlify.com">Netlify</a><br><br>
  <!--OC has a sharper image-->
  <a href="https://www.netlify.com"><img src="https://images.opencollective.com/netlify/4087de2/logo/256.png" width="128"></a>
</td>
<td width="10%" align="center">
  <a href="https://www.coinbase.com">Coinbase</a><br><br>
  <a href="https://www.coinbase.com"><img src="https://avatars1.githubusercontent.com/u/1885080?s=256&v=4" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://themeisle.com">ThemeIsle</a><br><br>
  <a href="https://themeisle.com"><img src="https://avatars1.githubusercontent.com/u/58979018?s=128&v=4" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://expo.io">Expo</a><br><br>
  <a href="https://expo.io"><img src="https://avatars1.githubusercontent.com/u/12504344?s=128&v=4" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://boostnote.io">Boost Note</a><br><br>
  <a href="https://boostnote.io"><img src="https://images.opencollective.com/boosthub/6318083/logo/128.png" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://markdown.space">Markdown Space</a><br><br>
  <a href="https://markdown.space"><img src="https://images.opencollective.com/markdown-space/e1038ed/logo/128.png" width="64"></a>
</td>
<td width="10%" align="center">
  <a href="https://www.holloway.com">Holloway</a><br><br>
  <a href="https://www.holloway.com"><img src="https://avatars1.githubusercontent.com/u/35904294?s=128&v=4" width="64"></a>
</td>
<td width="10%"></td>
<td width="10%"></td>
</tr>
<tr valign="middle">
<td width="100%" align="center" colspan="8">
  <br>
  <a href="https://opencollective.com/unified"><strong>You?</strong></a>
  <br><br>
</td>
</tr>
</table>

## Acknowledgments

The initial release of this project was authored by
[**@wooorm**](https://github.com/wooorm).

Thanks to [**@contra**](https://github.com/contra),
[**@phated**](https://github.com/phated), and others for their work on
[Vinyl][], which was a huge inspiration.

Thanks to
[**@brendo**](https://github.com/brendo),
[**@shinnn**](https://github.com/shinnn),
[**@KyleAMathews**](https://github.com/KyleAMathews),
[**@sindresorhus**](https://github.com/sindresorhus), and
[**@denysdovhan**](https://github.com/denysdovhan)
for contributing commits since!

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/vfile/vfile/workflows/main/badge.svg

[build]: https://github.com/vfile/vfile/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile.svg

[coverage]: https://codecov.io/github/vfile/vfile

[downloads-badge]: https://img.shields.io/npm/dm/vfile.svg

[downloads]: https://www.npmjs.com/package/vfile

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=vfile

[size]: https://bundlejs.com/?q=vfile

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/vfile/vfile/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/vfile/.github

[contributing]: https://github.com/vfile/.github/blob/main/contributing.md

[support]: https://github.com/vfile/.github/blob/main/support.md

[coc]: https://github.com/vfile/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[vinyl]: https://github.com/gulpjs/vinyl

[site]: https://unifiedjs.com

[twitter]: https://twitter.com/unifiedjs

[unist]: https://github.com/syntax-tree/unist#list-of-utilities

[reporter]: https://github.com/vfile/vfile-reporter

[vmessage]: https://github.com/vfile/vfile-message

[vfile-message-options]: https://github.com/vfile/vfile-message#options

[mdn-uint8-array]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array

[source-map]: https://github.com/mozilla/source-map/blob/58819f0/source-map.d.ts#L15-L23

[file-url-to-path]: https://nodejs.org/api/url.html#url_url_fileurltopath_url

[governance]: https://github.com/unifiedjs/collective

[api-vfile-messages]: #filemessages

[api-vfile-message]: #vfilemessagereason-options

[api-vfile]: #vfileoptions

[api-compatible]: #compatible

[api-data]: #data

[api-data-map]: #datamap

[api-map]: #map

[api-message-options]: #messageoptions

[api-options]: #options

[api-reporter]: #reporter

[api-reporter-settings]: #reportersettings

[api-value]: #value


