 # What is Symbol in JavaScript
 
> Symbol is a primitive data type introduced in ES6 (ECMAScript 2015) that represents a unique and immutable identifier.

# key points

1. Unique by default: Every Symbol() is guaranteed to be different, even if they have the same description.

2. Not enumerable: Symbol-keyed properties are not included in for...in loops or Object.keys(), which makes them useful for "hidden" object properties.

3. Used as object property keys: Symbols are often used to avoid name clashes in objects or libraries.

```js
const sym1 = Symbol();
const sym2 = Symbol('description');  // Optional description (for debugging)
```
```js
console.log(sym1 === sym2); // false — always unique
```

```js
const id = Symbol('id');

const user = {
  name: "John",
  [id]: 123
};

console.log(user[id]);        // 123
console.log(Object.keys(user)); // ["name"] — Symbol is not shown
```

Symbols are like invisible, private labels you can stick on objects, and no one else can guess or copy that label.



Great question! Let’s break it down:

---

### 🔹 Real-world use of `Symbol`

In real-world apps, **`Symbol`** is mostly used for:

1. **Avoiding property name conflicts** in objects (especially in large projects or libraries).
2. Defining **private or hidden properties**.
3. Customizing behavior in built-in JavaScript features (like `Symbol.iterator`, `Symbol.toStringTag`, etc.).

---

### 🔸 Example: When is it useful?

Suppose you're building a **photo gallery app**.

#### ✅ When `Symbol` **could** be useful:

Imagine you want to add **internal meta data** to each photo object that the rest of your app or plugins shouldn't mess with or accidentally overwrite.

```javascript
const _internalId = Symbol("internalId");

let photo = {
  title: "Sunset",
  url: "sunset.jpg",
  [_internalId]: 987654321 // hidden or internal tracking ID
};
```

* You can use `_internalId` to store app-internal data (like unique tracking IDs, timestamps, etc.).
* It’s safe from being overwritten by other properties accidentally.
* It's not exposed in loops or public APIs.

---

### ❌ When **not** needed:

If you're **only displaying photos**, managing albums, or tagging — and you don’t need hidden/internal properties — then **you probably don’t need Symbol**.

---

### ✔ Bottom Line:

* Use `Symbol` when you want to **add internal, protected, or collision-free properties** to your objects.
* For a basic photo gallery, it’s not essential.
* But in **large-scale apps**, especially where plugins or multiple developers add properties, `Symbol` becomes very handy.

---
