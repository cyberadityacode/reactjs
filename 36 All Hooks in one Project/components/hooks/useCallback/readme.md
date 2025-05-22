**Child Button Component will still re-render** , even with `React.memo`.

the **reason** is that a **new instance of the `onClick` function** is created on every render of the parent component, causing the **prop reference to change**. Since `React.memo` only does a shallow comparison, it detects the function prop as different and re-renders the child.

---

### 🔁 What happens when you click the button?

1. `setCount()` updates the state.
2. Parent re-renders.
3. `handleClick` is **re-declared**, creating a **new function reference**.
4. Child receives a **new `onClick` prop**, even though its logic is the same.
5. `React.memo` sees the prop has changed → child **re-renders**.

---

###  How to prevent re-render due to `onClick`?

You can **stabilize the function reference** using `useCallback`:

```jsx
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);
```

This ensures the same `handleClick` function reference is preserved **unless dependencies change**.

If you need to include something like `count` in dependencies:

```jsx
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);
```

Since you're using the functional form of state update (`prev => prev + 1`), you **don’t need to include `count` in dependencies**, so this is safe.

---

###  Summary:

| Situation                                              | Will Child Re-render? | Why?                                     |
| ------------------------------------------------------ | --------------------- | ---------------------------------------- |
| Passing new inline or declared function on each render | ✅ Yes                 | New function reference                   |
| Using `useCallback` to memoize the function            | ❌ No (usually)        | Stable function reference across renders |
| Function declared outside the component                | ❌ No                  | Never recreated, always same reference   |

---

