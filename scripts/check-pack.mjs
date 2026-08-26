import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const json = execFileSync("npm", ["pack", "--dry-run", "--json"], { encoding: "utf8" })
const result = JSON.parse(json)[0]
const file = "react-markdown"
const required = new Set([
  `dist/${file}.esm.js`,
  `dist/${file}.cjs`,
  `dist/${file}.umd.js`,
  `dist/${file}.closed.js`,
  `dist/${file}.d.ts`,
  "LICENSE",
  "NOTICE.md",
  "README.md",
])
const files = new Set(result.files.map(({ path }) => path))
for (const path of required) {
  if (!files.has(path)) throw new Error(`npm tarball is missing ${path}`)
}
const manifest = JSON.parse(readFileSync("package.json", "utf8"))
if (manifest.name !== "@itslil/react-markdown") throw new Error("unexpected package name")
const allowed = new Set(["@itslil/unified", "@itslil/remark-parse", "@itslil/remark-rehype"])
const deps = Object.keys(manifest.dependencies ?? {})
for (const name of deps) {
  if (!allowed.has(name)) throw new Error(`unexpected runtime dependency ${name}`)
}
for (const name of allowed) {
  if (!deps.includes(name)) throw new Error(`missing runtime dependency ${name}`)
}
console.log(`npm pack: ${result.entryCount} files, ${result.size} bytes packed, ${result.unpackedSize} bytes unpacked`)
