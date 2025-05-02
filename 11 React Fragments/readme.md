# What are React Fragments

**React Fragments** are a feature in React that allow you to group multiple elements without adding an extra node to the DOM.

### Why Use React Fragments?

Normally in React, a component must return a **single parent element**. If you want to return multiple elements, you'd typically wrap them in a `<div>` — but this adds an unnecessary element to the DOM.

React Fragments solve this by letting you return multiple elements **without** introducing an extra wrapper node.

### Syntax

#### 1. Standard syntax:

```jsx
import React from 'react';

function MyComponent() {
  return (
    <React.Fragment>
      <h1>Title</h1>
      <p>Description</p>
    </React.Fragment>
  );
}
```

#### 2. Shorthand syntax:

```jsx
function MyComponent() {
  return (
    <>
      <h1>Title</h1>
      <p>Description</p>
    </>
  );
}
```

### Key Points:

* **No extra node** is added to the DOM.
* You can **use keys** with `<React.Fragment key={...}>` — but not with the shorthand (`<>`).
* Improves **performance** slightly in large trees by avoiding unnecessary elements.

