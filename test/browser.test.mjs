import assert from "node:assert/strict"
import test from "node:test"

import {build} from "esbuild"

test("browser graph is pure LilScript with React external", async () => {
  const result = await build({
    bundle: true,
    conditions: ["browser", "import"],
    entryPoints: ["@itslil/react-markdown"],
    external: ["react", "react/jsx-runtime"],
    format: "esm",
    legalComments: "none",
    metafile: true,
    platform: "browser",
    write: false,
  })
  const inputs = Object.keys(result.metafile.inputs)
  assert.equal(result.outputFiles.length, 1)
  assert.equal(inputs.length, 1)
  assert.ok(inputs[0].endsWith("dist/react-markdown.browser.js"))
  assert.deepEqual(result.metafile.outputs[Object.keys(result.metafile.outputs)[0]].imports.map(item => item.path).sort(), ["react", "react/jsx-runtime"])
  for (const dependency of [
    "node_modules/vfile/",
    "node_modules/hast-util-to-jsx-runtime/",
    "node_modules/property-information/",
    "node_modules/style-to-js/",
    "node_modules/unist-util-visit/",
    "node_modules/@itslil/",
  ]) {
    assert.equal(inputs.some((path) => path.includes(dependency)), false, dependency)
  }
})
