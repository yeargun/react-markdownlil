## Debouncing a search box in React

Short answer: **keep the input controlled, debounce the *query*, not the keystrokes**, and cancel stale requests. Below is a version that works with React 19 and StrictMode.

### 1. The hook

```tsx
import {useEffect, useState} from 'react'

export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
```

### 2. Using it with `fetch` and `AbortController`

```tsx
function Search() {
  const [text, setText] = useState('')
  const query = useDebouncedValue(text.trim(), 300)
  const [results, setResults] = useState<Result[]>([])

  useEffect(() => {
    if (!query) return setResults([])
    const controller = new AbortController()
    fetch(`/api/search?q=${encodeURIComponent(query)}`, {signal: controller.signal})
      .then((response) => response.json())
      .then(setResults)
      .catch((error) => {
        if (error.name !== 'AbortError') console.error(error)
      })
    return () => controller.abort()
  }, [query])

  return (
    <>
      <input value={text} onChange={(event) => setText(event.target.value)} />
      <ResultList items={results} />
    </>
  )
}
```

> **Note:** the cleanup function aborts the previous request, so a slow response for `"rea"` can never overwrite the results for `"react"`.

### 3. Which delay?

| Input type | Suggested delay | Why |
|---|---:|---|
| Search-as-you-type | 200–300 ms | Feels instant, halves the request count |
| Autosave form | 800–1500 ms | Users pause between fields |
| Window resize | `requestAnimationFrame` | Tie it to paint, not to a timer |
| Analytics events | 2000 ms+ | Batch them instead |

### 4. Common mistakes

1. Creating the debounced function **inside** the component body without `useMemo` — every render makes a new timer, so nothing is ever debounced.
2. Debouncing `onChange` itself. The input then lags, because React needs the value synchronously to keep the caret in place.
3. Forgetting the cleanup:
   - timers keep firing after unmount;
   - `setState` on an unmounted component is a no-op, but the network request still runs.
4. Using `lodash.debounce` and calling `.cancel()` nowhere.

- [x] controlled input
- [x] debounced query
- [x] abort stale requests
- [ ] cache results per query (see [TanStack Query](https://tanstack.com/query/latest))

### 5. With `useDeferredValue` instead

React 18+ can do most of this without timers:

```jsx
const deferred = useDeferredValue(text)
const results = useMemo(() => filterLocally(items, deferred), [items, deferred])
```

`useDeferredValue` does **not** reduce the number of network requests; it only keeps typing responsive while an expensive render catches up. For remote search you still want the debounce above, ~~or a throttle~~ — throttling drops the *last* keystroke, which is usually the one that matters.

Further reading: the React docs on [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue), and MDN on [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController). If you share the component you have now, I can point at the exact line that re-creates the timer.
