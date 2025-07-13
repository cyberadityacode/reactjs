# Share state across multiple roots using Redux Toolkit

Let’s explain this with a **super simple metaphor** — like you're running a **cookie shop** 

---

###  Your Redux Toolkit Code is Like:

A **cookie shop** that:

* Keeps track of how many cookies 🍪 you have.
* Lets you press a button to **add more cookies**.

---

###  Here's What Each Part Means:

#### 1. **createSlice = Your Cookie Machine**

```js
const counterSlice = createSlice({...})
```

Think of this like setting up a **cookie machine** that:

* Starts with **0 cookies** (`initialState: { value: 0 }`)
* Has a button to **add 1 cookie** (`increment` function)

---

#### 2. **increment = The “Add Cookie” Button**

```js
increment(state) {
  state.value += 1;
}
```

This is like a button on your machine.
**Every time you press it, one more cookie is added.** 🍪➕🍪

---

#### 3. **configureStore = The Whole Shop**

```js
export const store = configureStore({...})
```

This sets up your **whole cookie shop**.
It includes your cookie machine (`counter`) so it knows how many cookies you have.

---

#### 4. **export const { increment } = counterSlice.actions;**

This gives you **access to the "Add Cookie" button** so you can use it anywhere in your shop (app).

---

###  In Short:

You built a **cookie shop**:

* It starts with **0 cookies**
* You made a **machine** that adds cookies
* You can now **press a button** to add more cookies

Every time someone presses the button, your cookie count goes up!

---
