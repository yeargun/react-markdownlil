// One app, built once per variant (vite.config.js aliases '@variant'). It is a
// small docs/chat viewer: on load it fetches a markdown document and renders it
// with the variant's Markdown component. `window.bench` lets Playwright drive
// the same component for timing and output capture.
import {StrictMode, useLayoutEffect, useState} from 'react'
import {flushSync} from 'react-dom'
import {createRoot} from 'react-dom/client'
import {Markdown, name, rehypePlugins, remarkPlugins} from '@variant'
import './app.css'

performance.mark('app-module-start')
const params = new URLSearchParams(location.search)
const docName = params.get('doc') || 'readme'
const view = params.get('view') || 'docs'
const corpusBase = '/corpus/'
const firstDoc = view === 'chat'
  ? fetch(corpusBase + 'conversation.json').then((r) => r.json())
  : fetch(corpusBase + docName + '.md').then((r) => r.text())

function Message({role, text}) {
  return (
    <div className={'message ' + role}>
      <div className="avatar">{role === 'user' ? 'U' : 'A'}</div>
      <div className="bubble markdown-body">
        <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{text}</Markdown>
      </div>
    </div>
  )
}

function App({content}) {
  const [theme, setTheme] = useState('light')
  useLayoutEffect(() => {
    performance.mark('md-committed')
    window.__committed = performance.now()
  }, [])
  return (
    <div className={'shell ' + theme}>
      <header>
        <strong>md-viewer</strong>
        <span className="variant">{name}</span>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>theme</button>
      </header>
      <main>
        {view === 'chat'
          ? content.map((text, i) => <Message key={i} role={i % 2 ? 'assistant' : 'user'} text={text} />)
          : (
            <article className="markdown-body">
              <Markdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{content}</Markdown>
            </article>
          )}
      </main>
    </div>
  )
}

firstDoc.then((content) => {
  performance.mark('doc-fetched')
  createRoot(document.getElementById('root')).render(<StrictMode><App content={content} /></StrictMode>)
})

// ---- benchmark / capture API -------------------------------------------------
const benchElement = document.getElementById('bench')
const benchRoot = createRoot(benchElement)
const props = (children) => ({children, remarkPlugins, rehypePlugins})
const docs = new Map()

window.bench = {
  name,
  async load(names) {
    for (const n of names) {
      if (!docs.has(n)) docs.set(n, await (await fetch(corpusBase + n + '.md')).text())
    }
    return names.map((n) => docs.get(n).length)
  },
  doc: (n) => docs.get(n),
  clear() {
    flushSync(() => benchRoot.render(null))
  },
  // Mount a document from scratch: processing + React render + DOM commit.
  mount(text) {
    flushSync(() => benchRoot.render(null))
    const t = performance.now()
    flushSync(() => benchRoot.render(<Markdown {...props(text)} />))
    return performance.now() - t
  },
  // The component body alone (parse, transforms, hast -> JSX elements).
  process(text, iterations) {
    const times = []
    for (let i = 0; i < iterations; i++) {
      const t = performance.now()
      Markdown(props(text))
      times.push(performance.now() - t)
    }
    return times
  },
  // Per-stage split of the component body, with plugins at both ends of the
  // pipeline (plugins are dynamic boundaries in both implementations):
  // parse = processor + file + micromark + mdast; hast = remark plugins +
  // remark-rehype + rehype plugins; jsx = URL pass + hast -> React elements.
  stages(text, iterations) {
    let t1 = 0
    let t2 = 0
    const first = () => () => { t1 = performance.now() }
    const last = () => () => { t2 = performance.now() }
    const staged = {children: text, remarkPlugins: [first, ...remarkPlugins], rehypePlugins: [...rehypePlugins, last]}
    const rows = []
    for (let i = 0; i < iterations; i++) {
      const t0 = performance.now()
      Markdown(staged)
      const t3 = performance.now()
      rows.push([t1 - t0, t2 - t1, t3 - t2])
    }
    return rows
  },
  // Chat-style streaming: re-render the growing message after every chunk.
  stream(text, step) {
    flushSync(() => benchRoot.render(null))
    const times = []
    for (let end = step; end < text.length + step; end += step) {
      const slice = text.slice(0, end)
      const t = performance.now()
      flushSync(() => benchRoot.render(<Markdown {...props(slice)} />))
      times.push(performance.now() - t)
    }
    return times
  },
  // Streaming as a real app does it: setState per chunk on a timer, React
  // schedules the work; measure what the main thread goes through.
  streamRealtime(text, step, intervalMs) {
    return new Promise((resolve) => {
      let setText
      function Live() {
        const [value, set] = useState('')
        setText = set
        return <Markdown {...props(value)} />
      }
      flushSync(() => benchRoot.render(<Live />))
      const frames = []
      let last = performance.now()
      let running = true
      const tick = (now) => {
        frames.push(now - last)
        last = now
        if (running) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      let end = 0
      const start = performance.now()
      const timer = setInterval(() => {
        end += step
        setText(text.slice(0, end))
        if (end >= text.length) {
          clearInterval(timer)
          setTimeout(() => {
            running = false
            resolve({wall: performance.now() - start, frames})
          }, 100)
        }
      }, intervalMs)
    })
  },
  conversation(messages) {
    flushSync(() => benchRoot.render(null))
    const t = performance.now()
    flushSync(() => benchRoot.render(messages.map((text, i) => (
      <Message key={i} role={i % 2 ? 'assistant' : 'user'} text={text} />
    ))))
    return performance.now() - t
  },
  html(text) {
    flushSync(() => benchRoot.render(<Markdown {...props(text)} />))
    return benchElement.innerHTML
  },
}
performance.mark('app-module-end')
