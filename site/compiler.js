// The compiler section: what the one LilScript compiler wrote for this release, how long it took,
// and the release before it. Everything comes from results.json (scripts/record-release.mjs).
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

function delta(before, after) {
  if (before == null || after == null) return { className: "pending", text: "not in the previous release" }
  const change = after - before
  if (change === 0) return { className: "even", text: "no change" }
  const percent = Math.abs(change / before) * 100
  return {
    className: change < 0 ? "win" : "loss",
    text: `${formatter.format(Math.abs(change))} B ${change < 0 ? "smaller" : "larger"} · ${percent.toFixed(1)}%`,
  }
}

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
  const previous = data.previousRelease ?? {}
  const previousFiles = previous.files ?? {}
  const node = delivered.find((entry) => entry.file === "dist/react-markdown.esm.js")
  const browser = delivered.find((entry) => entry.file === "dist/react-markdown.browser.js")
  const before = previousFiles["dist/react-markdown.esm.js"]
  const change = delta(before?.brotli11, node?.brotli11)
  const shipped = compiler.invocations?.find((entry) => entry.output === "dist/react-markdown.browser.js")
  const previousCompile = previous.compile
  const rows = delivered
    .map((entry) => {
      const old = previousFiles[entry.file]
      // The compiler-written rows share one explanation (the section's lead and the cell's title);
      // anything else says in full what wrote it.
      const written = entry.compilerWritten
        ? `<span title="${escapeHtml(entry.writtenBy)}">${escapeHtml(entry.writtenBy.split(" (")[0])}</span>`
        : `<strong>${escapeHtml(entry.writtenBy)}</strong>`
      return `<tr><th scope="row"><code>${escapeHtml(entry.file)}</code><small>${escapeHtml(entry.role)}</small></th><td>${formatter.format(entry.raw)}</td><td>${formatter.format(entry.gzip9)}</td><td>${formatter.format(entry.brotli11)}</td><td>${old ? formatter.format(old.brotli11) : "—"}</td><td class="written">${written}</td></tr>`
    })
    .join("")
  const invocationRows = (compiler.invocations ?? [])
    .map(
      (entry) =>
        `<tr><th scope="row"><code>${escapeHtml(entry.output)}</code><small>${escapeHtml(entry.config)}</small></th><td>${entry.wallMs.map(seconds).join(" / ")}</td><td>${seconds(median(entry.wallMs))}</td></tr>`,
    )
    .join("")
  root.innerHTML = `
    <div class="compiler-runline" aria-label="Brotli-11 of the Node ESM, previous release and this one">
      <article>
        <span>Previous release · ${escapeHtml(previous.date ?? "")}</span>
        <strong>${bytes(before?.brotli11)}</strong>
        <small>${escapeHtml(previous.label ?? "")}</small>
      </article>
      <div class="compiler-arrow" aria-hidden="true">→</div>
      <article class="current">
        <span>This release · ${escapeHtml(compiler.date)}</span>
        <strong>${bytes(node?.brotli11)}</strong>
        <small>dist/react-markdown.esm.js, LilScript ${escapeHtml(compiler.revision)}; the new browser build is ${bytes(browser?.brotli11)}</small>
      </article>
    </div>
    <div class="compiler-facts">
      <article class="${change.className}"><span>Node ESM, Brotli-11</span><strong>${escapeHtml(change.text)}</strong></article>
      <article><span>Compile time, the shipped browser build</span><strong>${shipped ? `${seconds(median(shipped.wallMs))} median of ${shipped.wallMs.length} builds` : "not recorded"}</strong></article>
      <article><span>All ${compiler.invocations?.length ?? ""} compiles of one build</span><strong>${seconds(median(compiler.compileWallMs))} median${previousCompile ? ` · previous release ${escapeHtml(previousCompile.summary)}` : ""}</strong></article>
    </div>
    <div class="table-wrap light compiler-table">
      <table>
        <thead><tr><th>Compiler invocation</th><th>wall time per build</th><th>median</th></tr></thead>
        <tbody>${invocationRows}</tbody>
      </table>
    </div>
    <div class="table-wrap light compiler-table">
      <table>
        <thead><tr><th>Delivered file</th><th>raw</th><th>gzip-9</th><th>Brotli-11</th><th>previous Brotli-11</th><th>written by</th></tr></thead>
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
          ${valueRow("previous release", previous.label)}
          ${valueRow("previous compile time", previousCompile?.detail)}
        </dl>
      </details>
    </div>`
}
