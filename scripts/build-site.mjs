import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const output = join(root, "_site")
const file = "react-markdown"
const home = resolve(root, "..")

// [id, sibling repository, group, role]. "graph": compiled into @itslil/react-markdown;
// "plugin": what an app adds; "family": the same stack, not used by react-markdown.
const stack = [
  ["unified", "unifiedlil", "graph", "the processor: plugins, parse, run"],
  ["micromark", "micromarklil", "graph", "tokenizer: markdown to events"],
  ["from-markdown", "mdast-util-from-markdownlil", "graph", "events to the mdast tree"],
  ["remark-parse", "remark-parselil", "graph", "unified parser (micromark + from-markdown)"],
  ["to-hast", "mdast-util-to-hastlil", "graph", "mdast to hast"],
  ["remark-rehype", "remark-rehypelil", "graph", "unified bridge (to-hast)"],
  ["remark-gfm", "remark-gfmlil", "plugin", "tables, task lists, strikethrough, autolinks, footnotes"],
  ["remark-breaks", "remark-breakslil", "plugin", "newlines as line breaks"],
  ["remark-math", "remark-mathlil", "plugin", "$math$ syntax"],
  ["rehype-katex", "rehype-katexlil", "plugin", "renders math with KaTeX"],
  ["katex", "katexlil", "plugin", "math typesetting"],
  ["to-html", "hast-util-to-htmllil", "family", "hast to an HTML string"],
  ["rehype-stringify", "rehype-stringifylil", "family", "unified compiler (to-html)"],
  ["remark", "remarklil", "family", "markdown processor (parse + stringify)"],
  ["rehype", "rehypelil", "family", "HTML processor (parse5 + stringify)"],
]
// Where a sibling page's own bar is not the same surface as its package, say so.
const entityTable = "Both sides decode named character references from the 2,125-entry table (upstream's Node graph); the browser graph, which decodes through the DOM instead, is listed with the lanes."
const notes = {
  micromark: entityTable,
  "from-markdown": entityTable,
  "remark-parse": entityTable,
  remark: "Not like for like: the only bar on its page is upstream's browser graph, which decodes entities through the DOM, while @itslil/remark carries the 2,125-entry table (about 8 KB Brotli).",
  "rehype-katex": "Not like for like: @itslil/rehype-katex imports katex and three hast helpers that the bar bundles.",
  katex: "The bar is KaTeX's own Flow sources through esbuild and SWC, the strongest of its official lanes.",
}
const unlike = new Set(["remark", "rehype-katex"])
// The comparison each row shows: the package as delivered against the strongest minified official
// lane of the same surface (no unminified or mangle-off lanes; no browser-graph lanes when the
// package is a Node build).
function pick(size) {
  const lil = size.find((lane) => lane.primary) ?? size.find((lane) => lane.id === "itslil")
  const bars = size.filter((lane) => lane.id.startsWith("official-") && !lane.diagnostic &&
    !lane.id.includes("nomangle") && !lane.id.includes("browser"))
  const bar = bars.reduce((best, lane) => (!best || lane.brotli11 < best.brotli11 ? lane : best), null)
  const lane = (item) => item && { id: item.id, name: item.name, raw: item.raw, gzip9: item.gzip9, brotli11: item.brotli11 }
  return { lil: lane(lil), bar: lane(bar) }
}
// A throughput pair is shown only where the page documents its workload.
function documented(data) {
  const official = (data.throughput ?? []).find((row) => row.id === "official")
  const lil = (data.throughput ?? []).find((row) => row.id === "itslil")
  const workload = data.throughputWorkload ??
    (data.throughputDocument ? `${data.throughputDocument}` : null) ??
    (typeof data.corpus === "number" ? `a ${data.corpus}-expression corpus rendered whole, ${data.rounds ?? "?"} rounds` : null)
  if (!official || !lil || !(official.documentMs > 0) || !(lil.documentMs > 0) || !workload) return null
  return { officialMs: official.documentMs, lilMs: lil.documentMs, workload: typeof workload === "string" ? workload : JSON.stringify(workload), runtime: data.runtime ?? "Node" }
}
// The page a sibling serves, from its published branch when a checkout is present.
function published(dir) {
  const shown = spawnSync("git", ["-C", join(home, dir), "show", "origin/main:site/results.json"], { maxBuffer: 64 * 1024 * 1024 })
  return shown.status === 0 ? shown.stdout.toString() : null
}

if (!existsSync(join(root, "dist", `${file}.esm.js`))) {
  const built = spawnSync(process.execPath, [join(root, "scripts", "build.mjs"), "--compile"], {
    cwd: root,
    stdio: "inherit",
  })
  if (built.status !== 0) process.exit(built.status ?? 1)
}

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
await cp(join(root, "site"), output, { recursive: true })
await cp(join(root, "dist", `${file}.esm.js`), join(output, `${file}.js`))

const stackOut = join(output, "stack")
await mkdir(stackOut, { recursive: true })
const index = []
for (const [id, dir, group, role] of stack) {
  const vendored = join(root, "site", "stack", `${id}.json`)
  const text = published(dir) ?? (existsSync(vendored) ? await readFile(vendored, "utf8") : null)
  if (!text) continue
  const data = JSON.parse(text)
  await writeFile(join(stackOut, `${id}.json`), JSON.stringify(data))
  index.push({
    id,
    dir,
    group,
    role,
    package: data.package,
    pin: data.pin,
    spec: data.spec,
    size: data.size,
    ...pick(data.size),
    comparable: !unlike.has(id),
    note: notes[id] ?? null,
    comparison: data.comparison ?? null,
    speed: documented(data),
    measuredAt: data.sizeMeasuredAt ?? data.measuredAt ?? null,
    site: `https://yeargun.github.io/${dir}/`,
    npm: `https://www.npmjs.com/package/${data.package}`,
  })
}
if (index.length) {
  const listing = JSON.stringify({ packages: index }, null, 2)
  await writeFile(join(stackOut, "index.json"), listing)
  await mkdir(join(root, "site", "stack"), { recursive: true })
  await writeFile(join(root, "site", "stack", "index.json"), listing)
  for (const item of index) {
    await writeFile(join(root, "site", "stack", `${item.id}.json`), await readFile(join(stackOut, `${item.id}.json`)))
  }
}

const playground = join(root, "site", "playground-entry.js")
const siblingsReady = existsSync(join(home, "unifiedlil/dist/unified.esm.js"))
// The playground bundles the sibling ports as published (their origin/main files), not whatever a
// rebuild left in their working trees.
const committedDeps = join(root, ".tmp", "playground-deps")
function committed(dir, file) {
  const built = spawnSync("git", ["-C", join(home, dir), "show", `origin/main:dist/${file}`], { maxBuffer: 64 * 1024 * 1024 })
  if (built.status !== 0) return join(home, dir, "dist", file)
  const target = join(committedDeps, dir, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, built.stdout)
  return target
}
// A committed copy resolves its own imports from its sibling's directory, as the working file would.
const committedSiblings = {
  name: "committed-siblings",
  setup(build) {
    build.onResolve({ filter: /^[^./]/ }, (args) => {
      if (!args.importer.startsWith(`${committedDeps}/`)) return undefined
      const dir = args.importer.slice(committedDeps.length + 1).split("/")[0]
      return build.resolve(args.path, { kind: args.kind, resolveDir: join(home, dir, "dist") })
    })
  },
}
if (existsSync(playground) && siblingsReady) {
  const { build: esbuild } = await import("esbuild")
  await rm(committedDeps, { recursive: true, force: true })
  await esbuild({
    absWorkingDir: root,
    entryPoints: [playground],
    outfile: join(output, "playground.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    jsx: "automatic",
    legalComments: "none",
    minifyWhitespace: true,
    plugins: [committedSiblings],
    alias: {
      "@itslil/unified/vfile": committed("unifiedlil", "vfile.esm.js"),
      "@itslil/unified": committed("unifiedlil", "unified.esm.js"),
      "@itslil/remark-parse": committed("remark-parselil", "remark-parse.esm.js"),
      "@itslil/remark-rehype": committed("remark-rehypelil", "remark-rehype.esm.js"),
      "@itslil/remark-gfm": committed("remark-gfmlil", "remark-gfm.esm.js"),
      "@itslil/remark-breaks": committed("remark-breakslil", "remark-breaks.esm.js"),
      "@itslil/remark-math": committed("remark-mathlil", "remark-math.esm.js"),
      "@itslil/rehype-katex": committed("rehype-katexlil", "rehype-katex.esm.js"),
      "@itslil/katex": committed("katexlil", "katex.esm.js"),
      // The lab runs in a browser, so it runs the package's browser build.
      "@itslil/react-markdown": join(root, "dist/react-markdown.browser.js"),
    },
    logLevel: "error",
  })
  await cp(join(output, "playground.js"), join(root, "site", "playground.js"))
}

await writeFile(join(output, ".nojekyll"), "")
console.log(`Built GitHub Pages site at ${output}`)

// Publish current build facts using the existing page typography.
await import("./build-comparison.mjs").then(({writeComparison}) => writeComparison({root, output}));
