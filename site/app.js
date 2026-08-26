const data = await fetch("./results.json").then((response) => {
  if (!response.ok) throw new Error(`Unable to load results: ${response.status}`)
  return response.json()
})

const stackIndex = await fetch("./stack/index.json")
  .then((response) => (response.ok ? response.json() : { packages: [] }))
  .catch(() => ({ packages: [] }))

const formatter = new Intl.NumberFormat("en-US")

function percentAgainst(value, baseline, better, worse) {
  if (!baseline || value === baseline) {
    return { text: "baseline", amount: "—", word: "baseline", state: "even" }
  }
  const change = (baseline - value) / baseline
  const magnitude = Math.abs(change * 100)
  const digits = magnitude < 10 ? 1 : 0
  const word = change > 0 ? better : worse
  return {
    text: `${magnitude.toFixed(digits)}% ${word}`,
    amount: `${magnitude.toFixed(digits)}%`,
    word,
    state: change > 0 ? "win" : "loss",
  }
}

function smallerThan(value, baseline) {
  return percentAgainst(value, baseline, "smaller", "larger")
}

function fasterThan(value, baseline) {
  return percentAgainst(value, baseline, "faster", "slower")
}

function laneById(id, size = data.size) {
  return size.find((lane) => lane.id === id)
}

function barClass(id) {
  if (id === "itslil") return "bar-lil"
  if (id === "itslil-closed") return "bar-closed"
  return "bar-official"
}

function ms(value) {
  return `${Number(value).toFixed(2)} ms`
}

function renderCodec(metric, size, ids, barId, bodyId) {
  const baseline = size.find((lane) => lane.baseline)
  const lanes = ids.map((id) => laneById(id, size)).filter(Boolean)
  if (!baseline || lanes.length === 0) return
  const max = Math.max(...lanes.map((lane) => lane[metric]))
  document.querySelector(barId).innerHTML = lanes
    .map((lane) => {
      const width = Math.max(18, (lane[metric] / max) * 100)
      return `<div class="${barClass(lane.id)}" style="width:${width}%"><span>${lane.name}</span><strong>${formatter.format(lane[metric])} B</strong></div>`
    })
    .join("")
  document.querySelector(bodyId).innerHTML = lanes
    .map((lane) => {
      const verdict = smallerThan(lane[metric], baseline[metric])
      return `<tr><th scope="row">${lane.name}</th><td>${formatter.format(lane[metric])}</td><td class="verdict ${verdict.state}"><strong>${verdict.text}</strong></td></tr>`
    })
    .join("")
}

function renderFrom(results) {
  const baseline = results.size.find((lane) => lane.baseline)
  const itslil = laneById("itslil", results.size)
  if (baseline && itslil) {
    const smaller = smallerThan(itslil.brotli11, baseline.brotli11)
    document.querySelector("#hero-ratio").innerHTML = `${smaller.amount}<span>${smaller.word}</span>`
    document.querySelector("#hero-bytes").textContent =
      `${formatter.format(baseline.brotli11)} B → ${formatter.format(itslil.brotli11)} B Brotli-11`
    document.querySelector("#hero-shipped").textContent = smaller.text
    document.querySelector("#hero-gzip").textContent = smallerThan(itslil.gzip9, baseline.gzip9).text
    document.querySelector("#hero-raw").textContent = smallerThan(itslil.raw, baseline.raw).text
  }
  document.querySelector("#hero-spec").textContent = results.spec
    ? `${results.spec.pass}/${results.spec.total}`
    : "—"

  const officialIds = results.size.filter((lane) => lane.id.startsWith("official")).map((lane) => lane.id)
  renderCodec("brotli11", results.size, [...officialIds, "itslil", "itslil-closed"], "#bar-brotli", "#body-brotli")
  renderCodec("gzip9", results.size, [...officialIds, "itslil", "itslil-closed"], "#bar-gzip", "#body-gzip")
  renderCodec("raw", results.size, [...officialIds, "itslil", "itslil-closed"], "#bar-raw", "#body-raw")
  document.querySelector("#body-matched").innerHTML = results.size
    .map((lane) => {
      const verdict = baseline ? smallerThan(lane.brotli11, baseline.brotli11) : { text: "—", state: "even" }
      return `<tr><th scope="row">${lane.name}</th><td>${formatter.format(lane.raw)}</td><td>${formatter.format(lane.gzip9)}</td><td>${formatter.format(lane.brotli11)}</td><td class="verdict ${verdict.state}"><strong>${verdict.text}</strong></td></tr>`
    })
    .join("")

  const suites = results.throughput ?? []
  const lil = suites.find((row) => row.id === "itslil")
  const official = suites.find((row) => row.id === "official")
  const speed = lil && official ? fasterThan(lil.documentMs, official.documentMs) : null
  const cards = [
    {
      label: results.perfLead ?? "same work, against the official runtime graph",
      value: speed ? speed.text : "—",
      win: speed?.state === "win",
    },
    { label: "LilScript median", value: lil ? ms(lil.documentMs) : "—" },
    { label: "official median", value: official ? ms(official.documentMs) : "—" },
    {
      label: results.spec?.label ?? "tests passing",
      value: results.spec ? `${results.spec.pass}/${results.spec.total}` : "—",
      geo: true,
    },
  ]
  document.querySelector("#perf-cards").innerHTML = cards
    .map(
      (card) =>
        `<article class="perf-card${card.win ? " win" : ""}${card.geo ? " geo" : ""}"><strong>${card.value}</strong><span>${card.label}</span></article>`,
    )
    .join("")
  document.querySelector("#perf-body").innerHTML = suites
    .map((row) => {
      const verdict = official ? fasterThan(row.documentMs, official.documentMs) : null
      return `<tr><th scope="row">${row.name}</th><td>${ms(row.documentMs)}</td><td class="verdict ${verdict ? verdict.state : ""}"><strong>${verdict ? verdict.text : "—"}</strong></td></tr>`
    })
    .join("")
  document.querySelector("#perf-note").textContent =
    `${results.runtime ?? "Node"}. ${results.codec ?? ""}. Quiet median after discarding the first ${results.warmupDiscard ?? 3} samples.`
}

function bindCopy() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]")
    if (!button) return
    await navigator.clipboard.writeText(button.dataset.copy)
    button.textContent = "copied"
    window.setTimeout(() => {
      button.textContent = "copy"
    }, 1200)
  })
}

function bindProgress() {
  const bar = document.querySelector(".progress")
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
  }
  window.addEventListener("scroll", update, { passive: true })
  update()
}

function renderStackDetail(pkg) {
  const host = document.querySelector("#stack-detail")
  if (!pkg) {
    host.innerHTML = ""
    return
  }
  host.innerHTML = `<div class="stack-card" style="margin-top:56px">
    <div>
      <h3>${pkg.package}</h3>
      <p>${pkg.pin}. Official suite ${pkg.spec ? `${pkg.spec.pass}/${pkg.spec.total} ${pkg.spec.label}` : "—" }.</p>
      <div class="stack-meta">
        <a href="${pkg.site}">github.io ↗</a>
        <a href="${pkg.npm}">npm ↗</a>
      </div>
    </div>
    <p>This tab is the same size and spec receipt published on that package’s lab. The playground above stays on the whole react-markdown package.</p>
  </div>`
}

async function selectTab(id) {
  const buttons = document.querySelectorAll("#stack-tabs button")
  for (const button of buttons) {
    button.setAttribute("aria-selected", button.dataset.id === id ? "true" : "false")
  }
  if (id === "react-markdown") {
    renderFrom(data)
    renderStackDetail(null)
    document.querySelector("#lab").hidden = false
    return
  }
  const pkg = (stackIndex.packages ?? []).find((item) => item.id === id)
  if (!pkg) return
  const results = await fetch(`./stack/${id}.json`).then((response) => response.json())
  renderFrom(results)
  renderStackDetail(pkg)
  document.querySelector("#lab").hidden = false
}

function bindTabs() {
  const tabs = document.querySelector("#stack-tabs")
  const items = [{ id: "react-markdown", package: "@itslil/react-markdown" }, ...(stackIndex.packages ?? [])]
  tabs.innerHTML = items
    .map(
      (item) =>
        `<button type="button" role="tab" data-id="${item.id}" aria-selected="${item.id === "react-markdown"}">${item.package}</button>`,
    )
    .join("")
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]")
    if (!button) return
    selectTab(button.dataset.id)
  })
}

bindCopy()
bindProgress()
bindTabs()
renderFrom(data)

if (document.querySelector("#playground-root")) {
  await import("./playground.js").catch(() => {})
}
