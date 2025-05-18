# Stable Wrapper Function with and without arguments

The wrapper function approach for event handlers in React—especially useful when you want to pass arguments to a handler without hurting performance.


# The Problem with Inline Functions in JSX

When you write something like:

```jsx
<button onClick={() => handleClick("Hello")}>Click</button>
```

You're creating a new anonymous function on every render. While this is okay for small apps, it can become a performance issue in large apps or when passing props to child components, because:

* It causes unnecessary re-renders.

* Memoized child components (using React.memo) will re-render anyway, because the function reference is always new.

> Step-by-step approach:

- Create a stable wrapper function in your component

- The wrapper internally calls your handler with the required argument

Functions like handleIncrementWithArgs and handleIncrementWithoutArgs are defined once, not recreated every render.

They're referentially stable — especially useful when passed as props to children.

Makes your code cleaner and easier to debug.

## Dynamic Wrappers with useCallback (Advanced)

If you really need to pass dynamic arguments, and want performance optimization, use useCallback with memoization:

```jsx
const handleGreeting = useCallback((message) => {
  console.log("Greeting:", message);
}, []);

return (
  <div>
    <button onClick={() => handleGreeting("Hello")}>Say Hello</button>
  </div>
);
```

But still, this creates a new inline function, so for dynamic arguments in performant apps, this is preferred only if handleGreeting itself is heavy or passed down. (i.e from Parent to Child)

### Best Practice

| Situation               | Best Practice                                             |
| ----------------------- | --------------------------------------------------------- |
| Simple handler, no args | `onClick={handleClick}`                                   |
| Needs arguments         | Define wrapper: `const handleClickX = () => handler(arg)` |
| Many dynamic handlers   | Consider `useCallback` if handler is heavy                |
| Inside child components | Always avoid recreating functions unnecessarily           |

To add furthermore, 

- Inline functions can create memory overhead in large component trees.

- Stable wrapper functions help avoid unintentional memory leaks or over-triggered renders.