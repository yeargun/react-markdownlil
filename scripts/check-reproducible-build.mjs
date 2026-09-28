import {execFileSync} from "node:child_process"
import {createHash} from "node:crypto"
import {readFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const artifacts = [
  "dist/react-markdown.esm.js",
  "dist/react-markdown.browser.js",
  "dist/react-markdown.browser.development.js",
  "dist/react-markdown.worker.js",
  "dist/react-markdown.worker.development.js",
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

// React is the only import of the browser and worker programs; the Node program also
// imports what upstream's vfile imports under `node`.
const expectedImports = {
  "dist/react-markdown.esm.js": ["node:path", "node:process", "node:url", "react", "react/jsx-runtime"],
  "dist/react-markdown.browser.js": ["react", "react/jsx-runtime"],
  "dist/react-markdown.worker.js": ["react", "react/jsx-runtime"],
}
for (const [path, expected] of Object.entries(expectedImports)) {
  const source = readFileSync(resolve(root, path), "utf8")
  const imports = Array.from(source.matchAll(/from\s*["']([^"']+)["']/gu), (match) => match[1]).sort()
  if (JSON.stringify(imports) !== JSON.stringify(expected)) {
    throw new Error(`${path} has unexpected imports: ${imports.join(", ")}`)
  }
}

console.log(JSON.stringify({reproducible: true, artifacts: first}, null, 2))
