// The compiler section: what the one LilScript compiler wrote for this release and how long it took.
// Everything comes from results.json (scripts/record-release.mjs).
const formatter = new Intl.NumberFormat("en-US")

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character])
}

const bytes = (value) => (value == null ? "—" : `${formatter.format(value)} B`)
const median = (values) => [...values].sort((left, right) => left - right)[Math.floor(values.length / 2)]
const seconds = (ms) => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`)

function valueRow(term, value) {
  return `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value ?? "not recorded")}</dd></div>`
}

export function renderCompiler(data, selector = "#compiler-release") {
  const root = document.querySelector(selector)
  if (!root) return
  const compiler = data.compiler
  const delivered = data.delivered ?? []
  if (!compiler || delivered.length === 0) {
    root.textContent = "Compiler data is not available."
    return
  }
  const browser = delivered.find((entry) => entry.file === "dist/react-markdown.browser.js")
  const node = delivered.find((entry) => entry.file === "dist/react-markdown.esm.js")
  const shipped = compiler.invocations?.find((entry) => entry.output === "dist/react-markdown.browser.js")
  const rows = delivered
    .map((entry) => {
      // The compiler-written rows share one explanation (the section's lead and the cell's title);
      // anything else says in full what wrote it.
      const written = entry.compilerWritten
        ? `<span title="${escapeHtml(entry.writtenBy)}">${escapeHtml(entry.writtenBy.split(" (")[0])}</span>`
        : `<strong>${escapeHtml(entry.writtenBy)}</strong>`
      return `<tr><th scope="row"><code>${escapeHtml(entry.file)}</code><small>${escapeHtml(entry.role)}</small></th><td>${formatter.format(entry.raw)}</td><td>${formatter.format(entry.gzip9)}</td><td>${formatter.format(entry.brotli11)}</td><td class="written">${written}</td></tr>`
    })
    .join("")
  const invocationRows = (compiler.invocations ?? [])
    .map(
      (entry) =>
        `<tr><th scope="row"><code>${escapeHtml(entry.output)}</code><small>${escapeHtml(entry.config)}</small></th><td>${entry.wallMs.map(seconds).join(" / ")}</td><td>${seconds(median(entry.wallMs))}</td></tr>`,
    )
    .join("")
  root.innerHTML = `
    <div class="compiler-facts">
      <article class="win"><span>Browser build, Brotli-11 · LilScript ${escapeHtml(compiler.revision)} · ${escapeHtml(compiler.date)}</span><strong>${bytes(browser?.brotli11)} · Node ESM ${bytes(node?.brotli11)}</strong></article>
      <article><span>Compile time, the shipped browser build</span><strong>${shipped ? `${seconds(median(shipped.wallMs))} median of ${shipped.wallMs.length} builds` : "not recorded"}</strong></article>
      <article><span>All ${compiler.invocations?.length ?? ""} compiles of one build</span><strong>${seconds(median(compiler.compileWallMs))} median</strong></article>
    </div>
    <div class="table-wrap light compiler-table">
      <table>
        <thead><tr><th>Compiler invocation</th><th>wall time per build</th><th>median</th></tr></thead>
        <tbody>${invocationRows}</tbody>
      </table>
    </div>
    <div class="table-wrap light compiler-table">
      <table>
        <thead><tr><th>Delivered file</th><th>raw</th><th>gzip-9</th><th>Brotli-11</th><th>written by</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="compiler-provenance-list">
      <details class="compiler-provenance">
        <summary>Provenance</summary>
        <dl>
          ${valueRow("compiler revision", compiler.revision)}
          ${valueRow("compiler SHA-256", compiler.binarySha256)}
          ${valueRow("codec SHA-256", compiler.codecSha256)}
          ${valueRow("timing", compiler.timingScope)}
          ${valueRow("host", `${compiler.host?.cpus ?? "?"} vCPUs, 1-minute load average ${compiler.host?.loadAverage1m ?? "?"}`)}
        </dl>
      </details>
    </div>`
}
