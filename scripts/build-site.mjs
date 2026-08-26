import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { build as esbuild } from "esbuild"

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
if (existsSync(playground) && siblingsReady) {
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
    alias: {
      "@itslil/unified": join(home, "unifiedlil/dist/unified.esm.js"),
      "@itslil/remark-parse": join(home, "remark-parselil/dist/remark-parse.esm.js"),
      "@itslil/remark-rehype": join(home, "remark-rehypelil/dist/remark-rehype.esm.js"),
      "@itslil/remark-gfm": join(home, "remark-gfmlil/dist/remark-gfm.esm.js"),
      "@itslil/remark-breaks": join(home, "remark-breakslil/dist/remark-breaks.esm.js"),
      "@itslil/remark-math": join(home, "remark-mathlil/dist/remark-math.esm.js"),
      "@itslil/rehype-katex": join(home, "rehype-katexlil/dist/rehype-katex.esm.js"),
      "@itslil/katex": join(home, "katexlil/dist/katex.esm.js"),
      "@itslil/react-markdown": join(root, "dist/react-markdown.esm.js"),
    },
    logLevel: "error",
  })
  await cp(join(output, "playground.js"), join(root, "site", "playground.js"))
}

await writeFile(join(output, ".nojekyll"), "")
console.log(`Built GitHub Pages site at ${output}`)
