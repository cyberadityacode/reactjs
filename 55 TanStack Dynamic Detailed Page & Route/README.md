# TanStack React Query - Dynamic Detailed Page & Route 

```jsx
queryKey: ["post", params.id],
```

pass the id along queryKey to prevent caching discrepencies. 



---

## 🔍 The Purpose of Wrapping in an Arrow Function

When you write:

```js
queryFn: fetchIndividualData(params.id),
```

You are **calling the function immediately** when React renders the component. That means:

* The network request is triggered **outside of React Query’s control**.
* The return value (a `Promise`) is passed to `queryFn`, which is **not valid**, because React Query expects a **function**, not a **promise**.

---

### ✅ What React Query Expects

React Query wants:

```js
queryFn: () => fetchIndividualData(params.id)
```

This means:

* You are **giving React Query a function** that it can call **when needed** (like during initial load, refetch, or cache invalidation).
* This keeps the fetch **inside the React Query lifecycle**, allowing it to:

  * Handle loading and error states
  * Retry on failure
  * Cache the result
  * Cancel it if unmounted
  * And more...

---

### ⚠️ Analogy

Think of it like giving someone a **recipe** (function) vs giving them a **cooked dish** (promise):

* ❌ You gave React Query the dish (`fetchIndividualData(...)`) — too late, it’s already cooked.
* ✅ You should give it the recipe (`() => fetchIndividualData(...)`) — so it can cook it when needed.

---

### TL;DR

You **must wrap `queryFn` in a function** (like an arrow function) so React Query can **call it itself**, rather than you calling it during render.

Let me know if you'd like a side-by-side live example to illustrate the difference!
