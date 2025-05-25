# Full Stack React 19 with Axios

## IIFE

Immediately Invoked Function Expression (IIFE) to allow throw inside the ternary & also executes multiple lines inside ternary operator.

```jsx
condition
  ? (() => {
      console.log("hello");
      return res;
    })()
  : (() => {
      console.log("bye");
    })();
```


# Currying Function

The curry pattern (or currying) is a concept from functional programming where a function doesn’t take all its arguments at once, but instead returns a new function that takes the next argument, and so on — until all arguments are provided.

In your component:

```jsx
const handleDeletePost = (id) => () => {
  deletePost(id);
};

```
Here:

- handleDeletePost(id) returns a function () => deletePost(id)

- This is currying in practice — you're deferring execution by returning a function.

### Why Use Currying?

- It lets you create specialized versions of functions.

- Great for event handlers, like in React.

- Helps keep your code modular and readable.

- Works well with higher-order functions like map, filter, etc.

> using a curried handler function (like handleDeletePost(id) returning a function) is generally better and more professional than using an inline arrow function directly in the onClick prop.

✔️ Improved readability: Logic is separated from JSX.

✔️ Avoids unnecessary anonymous functions in render.

✔️ More testable and reusable.

✔️ Better for performance if wrapped with useCallback.
---

Use functional setData() (Best Practice)

```jsx
setData(prevData => prevData.filter(post => post.id !== id));
```

### Delete Functionality 

- modularized delete handler well (curry + callback).

### Post Functionality

### Update Functionality

