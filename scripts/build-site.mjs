import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const output = join(root, "_site")
const file = "react-markdown"
const home = resolve(root, "..")

const stack = [
  ["unified", "unifiedlil"],
  ["micromark", "micromarklil"],
  ["from-markdown", "mdast-util-from-markdownlil"],
  ["to-hast", "mdast-util-to-hastlil"],
  ["to-html", "hast-util-to-htmllil"],
  ["remark-parse", "remark-parselil"],
  ["remark-rehype", "remark-rehypelil"],
  ["rehype-stringify", "rehype-stringifylil"],
  ["remark", "remarklil"],
  ["rehype", "rehypelil"],
  ["remark-gfm", "remark-gfmlil"],
  ["remark-breaks", "remark-breakslil"],
  ["remark-math", "remark-mathlil"],
  ["katex", "katexlil"],
  ["rehype-katex", "rehype-katexlil"],
]

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
for (const [id, dir] of stack) {
  const sibling = join(home, dir, "site", "results.json")
  const vendored = join(root, "site", "stack", `${id}.json`)
  const results = existsSync(sibling) ? sibling : vendored
  if (!existsSync(results)) continue
  const data = JSON.parse(await readFile(results, "utf8"))
  await writeFile(join(stackOut, `${id}.json`), JSON.stringify(data))
  index.push({
    id,
    dir,
    package: data.package,
    pin: data.pin,
    spec: data.spec,
    size: data.size,
    throughput: data.throughput,
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
// The playground bundles the sibling ports as committed (their released files), not whatever a
// rebuild left in their working trees.
const committedDeps = join(root, ".tmp", "playground-deps")
function committed(dir, file) {
  const built = spawnSync("git", ["-C", join(home, dir), "show", `HEAD:dist/${file}`], { maxBuffer: 64 * 1024 * 1024 })
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
