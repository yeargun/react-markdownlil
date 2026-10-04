Sure! Here's how to **debounce** a search input in React.

## The idea

Debouncing delays a call until the user *stops typing* for a set time. That keeps
you from firing a request on every keystroke.

1. Keep the raw input in state.
2. Derive a debounced value with a timer.
3. Fetch only when the debounced value changes.

```tsx
function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}
```

Then use it in your component:

```tsx
const query = useDebounced(input)
useEffect(() => { if (query) search(query) }, [query])
```

> **Tip:** 250–400 ms feels responsive for most search boxes.

A few things to watch out for:

- Cancel stale requests with an `AbortController`, or late responses can
  overwrite newer results.
- Don't debounce the *input value itself* — the field would feel laggy.
- See the [React docs on `useEffect`](https://react.dev/reference/react/useEffect)
  for cleanup semantics.

Let me know if you want a version with `useDeferredValue` instead!
