// The real-app section. Everything comes from real-app.json, which real-app/scripts/summarize.mjs
// writes from the Playwright results in real-app/results/ (the README section is written from the
// same file, so the two cannot disagree).
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

function cell(value) {
  if (value && typeof value === "object") {
    return `<td class="verdict ${escapeHtml(value.state ?? "")}"${value.title ? ` title="${escapeHtml(value.title)}"` : ""}><strong>${escapeHtml(value.text)}</strong></td>`
  }
  // Words read left-aligned; numbers stay right-aligned in their column.
  const text = typeof value === "string" && !/^[−+\d—]/.test(value)
  return `<td${text ? ' class="text"' : ""}>${escapeHtml(value)}</td>`
}

function table(spec) {
  const head = spec.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")
  const body = spec.rows
    .map((row) => `<tr><th scope="row">${escapeHtml(row[0])}</th>${row.slice(1).map(cell).join("")}</tr>`)
    .join("")
  return `<div class="realapp-block" id="realapp-${escapeHtml(spec.id)}">
    <h3>${escapeHtml(spec.title)}</h3>
    ${spec.lead ? `<p class="realapp-lead">${escapeHtml(spec.lead)}</p>` : ""}
    <div class="table-wrap light"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
  </div>`
}

export async function renderRealApp(selector = "#real-app-body") {
  const root = document.querySelector(selector)
  if (!root) return null
  const data = await fetch("./real-app.json").then((response) => (response.ok ? response.json() : null)).catch(() => null)
  if (!data) {
    root.textContent = "Real-app results are not available."
    return null
  }
  const cards = data.cards
    .map((card) => `<article class="perf-card${card.state === "win" ? " win" : ""}${card.state === "ink" ? " geo" : ""}"><strong>${escapeHtml(card.value)}</strong><span>${escapeHtml(card.label)}</span></article>`)
    .join("")
  const lists = data.lists
    .map((list) => `<div class="realapp-block"><h3>${escapeHtml(list.title)}</h3>${list.lead ? `<p class="realapp-lead">${escapeHtml(list.lead)}</p>` : ""}<ul class="realapp-list">${list.items
      .map((item) => `<li><strong>${escapeHtml(item.title)}</strong> ${escapeHtml(item.text)}</li>`)
      .join("")}</ul></div>`)
    .join("")
  root.innerHTML = `
    <div class="perf-cards">${cards}</div>
    ${data.tables.map(table).join("")}
    ${lists}
    <p class="perf-note">${escapeHtml(data.method)} <a href="https://github.com/yeargun/react-markdownlil/tree/main/real-app">real-app/ ↗</a></p>`
  return data
}
