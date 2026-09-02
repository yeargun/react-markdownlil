import {execFileSync} from "node:child_process"
import {createHash} from "node:crypto"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import {dirname, relative, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const graphRoot = resolve(root, "src", "graph")
const lockPath = resolve(root, "source-graph.lock.json")
const writeLock = process.argv.includes("--write-lock")
const sync = writeLock || process.argv.includes("--sync")
const requireSiblings = writeLock || sync || process.argv.includes("--require-siblings")

const definitions = [
  {
    id: "unified",
    env: "UNIFIEDLIL_ROOT",
    sibling: "../unifiedlil",
    packageName: "@itslil/unified",
    packageVersion: "11.0.6",
    upstream: {
      repository: "https://github.com/unifiedjs/unified.git",
      tag: "11.0.5",
      commit: "242105bd6e18c61ca10f37d99529b89f1be37518",
      tree: "82877c0fca91f41bda24de546f79a40d2cfaeae1",
    },
  },
  {
    id: "remark-parse",
    env: "REMARK_PARSELIL_ROOT",
    sibling: "../remark-parselil",
    packageName: "@itslil/remark-parse",
    packageVersion: "11.0.2",
    upstream: {
      repository: "https://github.com/remarkjs/remark.git",
      tag: "remark-parse@11.0.0",
      commit: "de740c7d52c0278bbc36d8eac218ab74995c6420",
      tree: "a0b5bef5d96f49e4aecdd29dc53cda36a785cc30",
    },
  },
  {
    id: "remark-rehype",
    env: "REMARK_REHYPELIL_ROOT",
    sibling: "../remark-rehypelil",
    packageName: "@itslil/remark-rehype",
    packageVersion: "11.1.4",
    upstream: {
      repository: "https://github.com/remarkjs/remark-rehype.git",
      tag: "11.1.2",
      commit: "b5a2e5bb0f14607b6fc79ccbfdf0d518a4f304de",
      tree: "1d50e825c043998a400d0bec47f7f1b50d7c99f7",
    },
  },
]

function sha256(value) {
  return createHash("sha256").update(value).digest("hex")
}

function filesBelow(directory) {
  const result = []
  for (const name of readdirSync(directory).sort()) {
    const path = resolve(directory, name)
    if (statSync(path).isDirectory()) {
      result.push(...filesBelow(path))
    } else if (name.endsWith(".lil")) {
      result.push(path)
    }
  }
  return result
}

function sameArray(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} changed\nexpected: ${expected.join(", ")}\nactual: ${actual.join(", ")}`)
  }
}

function transform(id, path, source) {
  if (id === "unified" && path === "src/host.lil") {
    const before = `export extern JsValue Object;
export extern JsValue Error;
export extern JsValue TypeError;
export extern JsValue Number;
export extern JsValue Symbol;
export extern JsValue String;
export extern class JSONApi {
  JsValue parse;
  JsValue stringify;
}
export extern JSONApi JSON;
export extern JsValue Promise;
export extern JsValue Array;
export extern JsValue TextDecoder;
export extern JsValue globalThis;`
    const after = `import { Array, Error, JSON, Number, Object, Promise, String, Symbol, TextDecoder, TypeError, globalThis } from "../../host.lil";
export { Array, Error, JSON, Number, Object, Promise, String, Symbol, TextDecoder, TypeError, globalThis };`
    if (!source.includes(before)) throw new Error("unified host source no longer matches the audited graph wiring")
    return source.replace(before, after)
  }
  if (id === "remark-parse" && path === "src/micromark/host.lil") {
    const before = `extern JsValue Object;
extern JsValue String;
extern JsValue Number;
extern JsValue Array;
extern JsValue Error;
extern JsValue Math;
extern JsValue TextDecoder;
extern JsValue encodeURIComponent;`
    const after = `import { Array, Error, Math, Number, Object, String, TextDecoder, encodeURIComponent } from "../../../host.lil";`
    if (!source.includes(before)) throw new Error("remark-parse host source no longer matches the audited graph wiring")
    return source.replace(before, after)
  }
  if (id === "remark-parse" && path === "src/micromark/character-entities.lil") {
    const before = "export JsValue characterEntities = JSON.parse("
    const after = 'export JsValue characterEntities = JS.invoke(JSON, "parse", '
    if (!source.startsWith(before)) throw new Error("remark-parse entity table no longer matches the audited host-call wiring")
    return source.replace(before, after)
  }
  if (id === "remark-rehype" && path === "src/entry.lil") {
    const before = "extern JsValue Promise;"
    const after = 'import { Promise } from "../../host.lil";'
    if (!source.includes(before)) throw new Error("remark-rehype entry source no longer matches the audited graph wiring")
    return source.replace(before, after)
  }
  if (id === "remark-rehype" && path === "src/hast/convert.lil") {
    const before = `extern JsValue Error;
extern JsValue Map;`
    const after = 'import { Error, Map } from "../../../host.lil";'
    if (!source.includes(before)) throw new Error("remark-rehype converter source no longer matches the audited graph wiring")
    return source.replace(before, after)
  }
  if (id === "remark-rehype" && path === "src/hast/types.lil") {
    const before = `extern JsValue Object;
extern JsValue String;
extern JsValue structuredClone;`
    const after = 'import { Object, String, structuredClone } from "../../../host.lil";'
    if (!source.includes(before)) throw new Error("remark-rehype host source no longer matches the audited graph wiring")
    return source.replace(before, after)
  }
  return source
}

function upstreamFiles(id, path) {
  if (id === "unified") {
    if (path === "src/entry.lil") return ["unified@11.0.5/lib/index.js"]
    if (path === "src/extend.lil") return ["extend@3.0.2/index.js"]
    if (path === "src/plain.lil") return ["is-plain-obj@4.1.0/index.js"]
    if (path === "src/trough.lil") return ["trough@2.2.0/lib/index.js"]
    if (path === "src/vfile.lil") {
      return [
        "vfile@6.0.3/lib/index.js",
        "vfile-message@4.0.3/lib/index.js",
        "unist-util-stringify-position@4.0.0/lib/index.js",
      ]
    }
    return ["unified@11.0.5/lib/callable-instance.js"]
  }

  if (id === "remark-rehype") {
    if (path === "src/entry.lil") return ["remark-rehype@11.1.2/lib/index.js"]
    if (path === "src/hast/entry.lil") return ["mdast-util-to-hast@13.2.1/lib/index.js"]
    if (path === "src/hast/types.lil") {
      return [
        "mdast-util-to-hast@13.2.1/lib/state.js",
        "mdast-util-to-hast@13.2.1/lib/revert.js",
      ]
    }
    return [
      "mdast-util-to-hast@13.2.1/lib/state.js",
      "mdast-util-to-hast@13.2.1/lib/footer.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/index.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/blockquote.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/break.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/code.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/delete.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/emphasis.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/footnote-reference.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/heading.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/html.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/image-reference.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/image.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/inline-code.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/link-reference.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/link.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/list-item.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/list.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/paragraph.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/root.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/strong.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/table-cell.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/table-row.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/table.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/text.js",
      "mdast-util-to-hast@13.2.1/lib/handlers/thematic-break.js",
    ]
  }

  if (path === "src/entry.lil") return ["remark-parse@11.0.0/lib/index.js"]
  if (path === "src/from-markdown.lil") return ["mdast-util-from-markdown@2.0.3/dev/lib/index.js"]
  if (path === "src/to-string.lil") return ["mdast-util-to-string@4.0.0/lib/index.js"]
  if (path === "src/stringify-position.lil") return ["unist-util-stringify-position@4.0.0/lib/index.js"]
  if (path === "src/micromark/character-entities.lil") return ["character-entities@2.0.2/index.js"]
  if (path === "src/micromark/decode-named.lil") return ["decode-named-character-reference@1.3.0/index.js"]
  const name = path.slice(path.lastIndexOf("/") + 1).replace(/\.lil$/u, ".js")
  if (path.includes("/micromark/core/")) return [`micromark-core-commonmark@2.0.3/dev/lib/${name}`]
  if (path.includes("/micromark/initialize/")) return [`micromark@4.0.2/dev/lib/initialize/${name}`]
  if (path.includes("/micromark/symbol/")) return [`micromark-util-symbol@2.0.1/lib/${name}`]
  const utility = {
    "factory-destination.lil": "micromark-factory-destination@2.0.1/dev/index.js",
    "factory-label.lil": "micromark-factory-label@2.0.1/dev/index.js",
    "factory-space.lil": "micromark-factory-space@2.0.1/dev/index.js",
    "factory-title.lil": "micromark-factory-title@2.0.1/dev/index.js",
    "factory-whitespace.lil": "micromark-factory-whitespace@2.0.1/dev/index.js",
    "splice-buffer.lil": "micromark-util-subtokenize@2.1.0/dev/lib/splice-buffer.js",
    "util-subtokenize.lil": "micromark-util-subtokenize@2.1.0/dev/index.js",
    "util-character.lil": "micromark-util-character@2.1.1/dev/index.js",
    "util-chunked.lil": "micromark-util-chunked@2.0.1/index.js",
    "util-classify-character.lil": "micromark-util-classify-character@2.0.1/dev/index.js",
    "util-combine-extensions.lil": "micromark-util-combine-extensions@2.0.1/index.js",
    "util-decode-numeric.lil": "micromark-util-decode-numeric-character-reference@2.0.2/index.js",
    "util-decode-string.lil": "micromark-util-decode-string@2.0.1/index.js",
    "util-html-tag-name.lil": "micromark-util-html-tag-name@2.0.1/index.js",
    "util-normalize-identifier.lil": "micromark-util-normalize-identifier@2.0.1/index.js",
    "util-resolve-all.lil": "micromark-util-resolve-all@2.0.1/index.js",
  }[path.slice(path.lastIndexOf("/") + 1)]
  if (utility) return [utility]
  if (path === "src/micromark/host.lil") return ["micromark@4.0.2/dev/lib/create-tokenizer.js"]
  return [`micromark@4.0.2/dev/lib/${name}`]
}

function siblingRoot(definition) {
  return resolve(root, process.env[definition.env] ?? definition.sibling)
}

function inspectUpstream(siblingDirectory, specifier) {
  const match = /^((?:@[^/]+\/)?[^@/]+)@([^/]+)\/(.+)$/u.exec(specifier)
  if (!match) throw new Error(`invalid upstream source mapping: ${specifier}`)
  const [, packageName, packageVersion, path] = match
  const candidates = [
    resolve(siblingDirectory, "node_modules", packageName),
    resolve(root, "node_modules", packageName),
  ]
  const packageRoot = candidates.find((candidate) => existsSync(resolve(candidate, "package.json")))
  if (!packageRoot) throw new Error(`mapped upstream package is missing: ${packageName}@${packageVersion}`)
  const packageJson = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"))
  if (packageJson.name !== packageName || packageJson.version !== packageVersion) {
    throw new Error(`${specifier} resolved to ${packageJson.name}@${packageJson.version}`)
  }
  const sourcePath = resolve(packageRoot, path)
  if (!existsSync(sourcePath) || !statSync(sourcePath).isFile()) {
    throw new Error(`mapped upstream filename is missing: ${specifier}`)
  }
  return {path: specifier, sha256: sha256(readFileSync(sourcePath))}
}

function revision(directory) {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {cwd: directory, encoding: "utf8"}).trim()
  } catch {
    return null
  }
}

function inspectSibling(definition) {
  const directory = siblingRoot(definition)
  if (!existsSync(directory)) return null
  const packageJson = JSON.parse(readFileSync(resolve(directory, "package.json"), "utf8"))
  if (packageJson.name !== definition.packageName || packageJson.version !== definition.packageVersion) {
    throw new Error(`${definition.id} is ${packageJson.name}@${packageJson.version}, expected ${definition.packageName}@${definition.packageVersion}`)
  }
  return {
    directory,
    revision: revision(directory),
    files: filesBelow(resolve(directory, "src")).map((sourcePath) => {
      const path = relative(directory, sourcePath).replaceAll("\\", "/")
      const source = readFileSync(sourcePath)
      const graph = transform(definition.id, path, source.toString())
      return {
        path,
        graphPath: `src/graph/${definition.id}/${path.slice(4)}`,
        sha256: sha256(source),
        graphSha256: sha256(graph),
        upstream: upstreamFiles(definition.id, path).map((specifier) => inspectUpstream(directory, specifier)),
      }
    }),
  }
}

function makeLock() {
  return {
    schemaVersion: 1,
    algorithm: "sha256",
    packages: definitions.map((definition) => {
      const sibling = inspectSibling(definition)
      if (!sibling) throw new Error(`${definition.id} sibling is missing at ${siblingRoot(definition)}`)
      const sourceDigest = sha256(sibling.files.map(({path, sha256}) => `${path}\0${sha256}\n`).join(""))
      const graphDigest = sha256(sibling.files.map(({graphPath, graphSha256}) => `${graphPath}\0${graphSha256}\n`).join(""))
      return {
        id: definition.id,
        package: `${definition.packageName}@${definition.packageVersion}`,
        siblingRevision: sibling.revision,
        sourceSha256: sourceDigest,
        graphSha256: graphDigest,
        upstream: definition.upstream,
        files: sibling.files,
      }
    }),
    transforms: [
      {
        kind: "host-import",
        description: "Share one host binding table across the linked graph; algorithm bodies remain byte-identical and the entity table uses the equivalent dynamic JSON.parse call.",
        paths: [
          "unified/src/host.lil",
          "remark-parse/src/micromark/host.lil",
          "remark-parse/src/micromark/character-entities.lil",
          "remark-rehype/src/entry.lil",
          "remark-rehype/src/hast/convert.lil",
          "remark-rehype/src/hast/types.lil",
        ],
      },
    ],
  }
}

if (writeLock) {
  const lock = makeLock()
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`)
}

if (!existsSync(lockPath)) throw new Error("source-graph.lock.json is missing; run with --write-lock")
const lock = JSON.parse(readFileSync(lockPath, "utf8"))
if (lock.schemaVersion !== 1 || lock.algorithm !== "sha256") throw new Error("unsupported source graph lock")
for (const entry of lock.packages.flatMap(({files}) => files)) {
  if (
    !entry.upstream.length ||
    entry.upstream.some(({path, sha256}) => path.includes("*") || !/^[0-9a-f]{64}$/u.test(sha256))
  ) {
    throw new Error(`${entry.graphPath} does not have exact upstream filename mappings`)
  }
}

if (sync) rmSync(graphRoot, {recursive: true, force: true})

let count = 0
for (const definition of definitions) {
  const expectedPackage = lock.packages.find(({id}) => id === definition.id)
  if (!expectedPackage) throw new Error(`${definition.id} is missing from source-graph.lock.json`)
  const sibling = inspectSibling(definition)
  if (!sibling && requireSiblings) throw new Error(`${definition.id} sibling is missing at ${siblingRoot(definition)}`)
  if (sibling) {
    if (expectedPackage.package !== `${definition.packageName}@${definition.packageVersion}`) {
      throw new Error(`${definition.id} package pin changed`)
    }
    if (expectedPackage.siblingRevision && sibling.revision !== expectedPackage.siblingRevision) {
      throw new Error(`${definition.id} revision ${sibling.revision} does not match ${expectedPackage.siblingRevision}`)
    }
    sameArray(sibling.files.map(({path}) => path), expectedPackage.files.map(({path}) => path), `${definition.id} source inventory`)
    const sourceDigest = sha256(sibling.files.map(({path, sha256}) => `${path}\0${sha256}\n`).join(""))
    const graphDigest = sha256(sibling.files.map(({graphPath, graphSha256}) => `${graphPath}\0${graphSha256}\n`).join(""))
    if (sourceDigest !== expectedPackage.sourceSha256 || graphDigest !== expectedPackage.graphSha256) {
      throw new Error(`${definition.id} aggregate source hash changed`)
    }
  }

  for (const expected of expectedPackage.files) {
    let graphSource
    if (sibling) {
      const sourcePath = resolve(sibling.directory, expected.path)
      const source = readFileSync(sourcePath)
      if (sha256(source) !== expected.sha256) throw new Error(`${definition.id}/${expected.path} does not match its locked hash`)
      graphSource = transform(definition.id, expected.path, source.toString())
      if (sha256(graphSource) !== expected.graphSha256) throw new Error(`${definition.id}/${expected.path} graph transform does not match its locked hash`)
      if (sync) {
        const outputPath = resolve(root, expected.graphPath)
        mkdirSync(dirname(outputPath), {recursive: true})
        writeFileSync(outputPath, graphSource)
      }
    }
    const outputPath = resolve(root, expected.graphPath)
    if (!existsSync(outputPath)) throw new Error(`${expected.graphPath} is missing; run npm run graph:sync`)
    if (sha256(readFileSync(outputPath)) !== expected.graphSha256) throw new Error(`${expected.graphPath} does not match its locked hash`)
    count++
  }
}

sameArray(
  filesBelow(graphRoot).map((path) => relative(root, path).replaceAll("\\", "/")).sort(),
  lock.packages.flatMap(({files}) => files.map(({graphPath}) => graphPath)).sort(),
  "materialized graph inventory",
)

console.log(`source graph: ${count} LilScript modules match pinned sibling and upstream mappings`)
