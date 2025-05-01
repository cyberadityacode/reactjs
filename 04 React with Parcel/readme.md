**Tree shaking** is a term used in modern JavaScript bundlers (like Webpack, Parcel, Vite, etc.) that refers to **removing unused code** from your final bundle to reduce file size and improve performance.

### Why it's called "tree shaking"?
Imagine your codebase as a **tree** of modules with branches (exports/imports). When you "shake the tree," all the **unused branches (code)** fall off — meaning they get removed from the final build.

---

### Example

#### Suppose you have a file:
```js
// utils.js
export function usedFunction() {
  return 'Used!';
}

export function unusedFunction() {
  return 'I will be removed if not used!';
}
```

#### And you only import one:
```js
// index.js
import { usedFunction } from './utils.js';
console.log(usedFunction());
```

 With **tree shaking**, the `unusedFunction()` will be **excluded** from the final bundle.

---

###  Requirements for tree shaking to work:
1. Code must use **ES6 module syntax** (`import/export`).
2. The bundler must be configured to run in **production mode**.
3. Functions/classes must not have **side effects**.

---

###  Benefits:
- Smaller bundle sizes
- Faster load times
- Less unused code in production

