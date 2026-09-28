// The stack section: one table with every package against its original, and tabs whose detail opens
// right below them. Data: results.json (this package), real-app.json (its browser speed) and
// stack/index.json (each sibling's published page, written by scripts/build-site.mjs).
const formatter = new Intl.NumberFormat("en-US")
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

const groups = {
  graph: "Compiled into @itslil/react-markdown",
  plugin: "Plugins an app adds",
  family: "Same family, not used by react-markdown",
}

function sizeDelta(lil, bar, comparable) {
  if (lil == null || bar == null) return { text: "—", state: "even" }
  const change = (lil - bar) / bar
  const percent = Math.abs(change * 100)
  const text = `${change < 0 ? "−" : "+"}${percent.toFixed(percent < 10 ? 1 : 0)}%`
  return { text: comparable ? text : `${text}*`, state: !comparable ? "even" : change < 0 ? "win" : change > 0 ? "loss" : "even" }
}

function speedDelta(speed) {
  if (!speed) return { text: "—", state: "even", title: "" }
  const ratio = speed.officialMs / speed.lilMs
  const text = ratio >= 1.5
    ? `${ratio.toFixed(1)}× faster`
    : ratio >= 1
      ? `${((1 - speed.lilMs / speed.officialMs) * 100).toFixed(0)}% faster`
      : `${((speed.lilMs / speed.officialMs - 1) * 100).toFixed(0)}% slower`
  return { text, state: ratio > 1.02 ? "win" : ratio < 0.98 ? "loss" : "even", title: `${speed.runtime}: ${speed.workload}` }
}

function mainPackage(results, realApp) {
  const lil = results.size.find((lane) => lane.primary)
  const bar = results.size.find((lane) => lane.baseline)
  const readme = realApp?.render?.find((row) => row.pair === "core" && row.doc === "readme")
  return {
    id: "react-markdown",
    group: "main",
    role: "the component: parse, run plugins, render to React",
    package: results.package,
    pin: results.pin,
    spec: results.spec,
    size: results.size,
    lil,
    bar,
    comparable: true,
    note: "The browser build (named references decoded by the document) against upstream's browser graph. Speed is the rendering pipeline on react-markdown's README in Chromium, from the real-app test below.",
    comparison: results.comparison,
    speed: readme ? { officialMs: readme.up, lilMs: readme.lil, workload: "rendering pipeline, react-markdown's README (26 KB), warm median, Vite 8 production app", runtime: realApp.chromium } : null,
    site: "#top",
    npm: "https://www.npmjs.com/package/@itslil/react-markdown",
  }
}

function row(pkg) {
  const brotli = sizeDelta(pkg.lil?.brotli11, pkg.bar?.brotli11, pkg.comparable)
  const gzip = sizeDelta(pkg.lil?.gzip9, pkg.bar?.gzip9, pkg.comparable)
  const raw = sizeDelta(pkg.lil?.raw, pkg.bar?.raw, pkg.comparable)
  const speed = speedDelta(pkg.speed)
  return `<tr data-id="${escapeHtml(pkg.id)}" tabindex="0">
    <th scope="row">${escapeHtml(pkg.package)}<small>${escapeHtml(pkg.role)}</small></th>
    <td>${pkg.bar ? formatter.format(pkg.bar.brotli11) : "—"}<small>${escapeHtml(pkg.bar?.name?.replace(/^Official · /, "") ?? "")}</small></td>
    <td>${pkg.lil ? formatter.format(pkg.lil.brotli11) : "—"}</td>
    <td class="verdict ${brotli.state}"><strong>${brotli.text}</strong></td>
    <td class="verdict ${gzip.state}">${gzip.text}</td>
    <td class="verdict ${raw.state}">${raw.text}</td>
    <td>${pkg.spec ? `${formatter.format(pkg.spec.pass)}/${formatter.format(pkg.spec.total)}` : "—"}</td>
    <td class="verdict ${speed.state}" title="${escapeHtml(speed.title)}">${speed.text}</td>
  </tr>`
}

function detail(pkg) {
  const bar = pkg.bar
  const lanes = (pkg.size ?? []).map((lane) => {
    const verdict = sizeDelta(lane.brotli11, bar?.brotli11, pkg.comparable)
    const mark = lane.id === bar?.id ? " · the bar" : lane.id === pkg.lil?.id ? " · delivered" : ""
    return `<tr class="${lane.id === bar?.id ? "is-bar" : lane.id === pkg.lil?.id ? "is-lil" : ""}"><th scope="row">${escapeHtml(lane.name)}${mark}</th><td>${formatter.format(lane.raw)}</td><td>${formatter.format(lane.gzip9)}</td><td>${formatter.format(lane.brotli11)}</td><td class="verdict ${lane.id === bar?.id ? "even" : verdict.state}">${lane.id === bar?.id ? "bar" : verdict.text}</td></tr>`
  }).join("")
  const speed = pkg.speed
  const speedLine = speed
    ? `<p><strong>Speed.</strong> ${escapeHtml(speed.workload)} (${escapeHtml(speed.runtime)}): original ${speed.officialMs.toFixed(3)} ms, @itslil ${speed.lilMs.toFixed(3)} ms per document.</p>`
    : `<p><strong>Speed.</strong> Its page publishes no documented benchmark, so none is shown.</p>`
  const links = pkg.id === "react-markdown"
    ? `<a href="#real-app">real-app test ↓</a><a href="${pkg.npm}">npm ↗</a>`
    : `<a href="${pkg.site}">its page ↗</a><a href="${pkg.npm}">npm ↗</a>`
  return `<div class="stack-card">
    <div>
      <h3>${escapeHtml(pkg.package)}</h3>
      <p>${escapeHtml(pkg.pin)} · ${escapeHtml(pkg.role)}. ${pkg.spec ? `Tests: ${formatter.format(pkg.spec.pass)}/${formatter.format(pkg.spec.total)} ${escapeHtml(pkg.spec.label ?? "")}.` : ""}</p>
      ${pkg.note ? `<p class="stack-flag">${escapeHtml(pkg.note)}</p>` : ""}
      ${speedLine}
      <p class="stack-method">${escapeHtml(pkg.comparison ?? "")}</p>
      <div class="stack-meta">${links}</div>
    </div>
    <div class="table-wrap light">
      <table>
        <thead><tr><th>Lane</th><th>raw</th><th>gzip-9</th><th>Brotli-11</th><th>vs bar</th></tr></thead>
        <tbody>${lanes}</tbody>
      </table>
    </div>
  </div>`
}

export function renderStack(results, stackIndex, realApp) {
  const packages = [mainPackage(results, realApp), ...(stackIndex.packages ?? [])]
  const body = document.querySelector("#stack-body")
  const tabs = document.querySelector("#stack-tabs")
  const panel = document.querySelector("#stack-detail")
  if (!body || !tabs || !panel) return
  let html = ""
  let group = null
  for (const pkg of packages) {
    if (pkg.group !== group && groups[pkg.group]) {
      html += `<tr class="group"><th colspan="8">${escapeHtml(groups[pkg.group])}</th></tr>`
    }
    group = pkg.group
    html += row(pkg)
  }
  body.innerHTML = html
  tabs.innerHTML = packages
    .map((pkg) => `<button type="button" role="tab" id="tab-${escapeHtml(pkg.id)}" data-id="${escapeHtml(pkg.id)}" aria-controls="stack-detail" aria-selected="false">${escapeHtml(pkg.package)}</button>`)
    .join("")
  const select = (id, scroll) => {
    const pkg = packages.find((item) => item.id === id)
    if (!pkg) return
    for (const button of tabs.querySelectorAll("button")) button.setAttribute("aria-selected", String(button.dataset.id === id))
    for (const tr of body.querySelectorAll("tr[data-id]")) tr.classList.toggle("selected", tr.dataset.id === id)
    panel.setAttribute("aria-labelledby", `tab-${id}`)
    panel.innerHTML = detail(pkg)
    if (scroll) panel.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]")
    if (button) select(button.dataset.id, false)
  })
  body.addEventListener("click", (event) => {
    const tr = event.target.closest("tr[data-id]")
    if (tr) select(tr.dataset.id, true)
  })
  body.addEventListener("keydown", (event) => {
    const tr = event.target.closest("tr[data-id]")
    if (tr && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault()
      select(tr.dataset.id, true)
    }
  })
  select("react-markdown", false)
}
