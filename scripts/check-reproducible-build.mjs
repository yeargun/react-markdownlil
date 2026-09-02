import {execFileSync} from "node:child_process"
import {createHash} from "node:crypto"
import {readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const artifacts = [
  "dist/react-markdown.esm.js",
  "dist/react-markdown.development.js",
  "dist/react-markdown.cjs",
  "dist/react-markdown.development.cjs",
  "dist/react-markdown.closed.js",
]

function sha256(path) {
  return createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex")
}

function build() {
  execFileSync(process.execPath, [resolve(root, "scripts", "build.mjs"), "--compile"], {
    cwd: root,
    stdio: "inherit",
  })
  return Object.fromEntries(artifacts.map((path) => [path, sha256(path)]))
}

const first = build()
const second = build()
if (JSON.stringify(first) !== JSON.stringify(second)) throw new Error("two clean graph builds produced different artifacts")

const esm = readFileSync(resolve(root, artifacts[0]), "utf8")
const imports = Array.from(esm.matchAll(/from\s*["']([^"']+)["']/gu), (match) => match[1]).sort()
if (JSON.stringify(imports) !== JSON.stringify(["react", "react/jsx-runtime"])) {
  throw new Error(`standalone ESM has unexpected imports: ${imports.join(", ")}`)
}

console.log(JSON.stringify({reproducible: true, artifacts: first}, null, 2))
