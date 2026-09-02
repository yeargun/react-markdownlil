import {writeFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {html, svg} from "property-information"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

function serialize(info, includeSpace) {
  const dashed = info.property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  const attribute = info.attribute === info.property
    ? ""
    : info.property.startsWith("aria") && info.attribute === `aria-${info.property.slice(4).toLowerCase()}`
      ? "@"
      : info.attribute === info.property.toLowerCase()
        ? "~"
        : info.attribute === dashed
          ? "-"
          : info.attribute
  const fields = [
    info.property,
    attribute,
    `${includeSpace && info.space ? "s" : ""}${info.commaSeparated ? "c" : ""}`,
  ]
  while (fields.at(-1) === "") fields.pop()
  return fields.join("|")
}

function records(schema) {
  const result = new Map()
  for (const info of Object.values(schema.property)) {
    const key = [info.property, info.attribute, Boolean(info.space), Boolean(info.commaSeparated)].join("\0")
    if (!result.has(key)) result.set(key, info)
  }
  return result
}

const htmlRecords = records(html)
const svgRecords = records(svg)
const common = [...htmlRecords.keys()].filter((key) => svgRecords.has(key))
const commonRows = common.map((key) => serialize(htmlRecords.get(key), true))
for (const key of common) {
  htmlRecords.delete(key)
  svgRecords.delete(key)
}

const source = [
  "// Generated from property-information@7.2.0 by scripts/generate-schema.mjs.",
  `export string commonSchemaBlob = ${JSON.stringify(commonRows.join("\n"))};`,
  `export string htmlSchemaBlob = ${JSON.stringify([...htmlRecords.values()].map((info) => serialize(info, false)).join("\n"))};`,
  `export string svgSchemaBlob = ${JSON.stringify([...svgRecords.values()].map((info) => serialize(info, false)).join("\n"))};`,
  "",
].join("\n")

writeFileSync(resolve(root, "src/property-information/lib/schema-data.lil"), source)
