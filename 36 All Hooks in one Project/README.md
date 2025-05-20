# Hooks in React

**Simple Defination**: Hooks let you use different React features from your components. You can either use the built-in Hooks or combine them to build your own.

React Hooks are functions that allow functional components in React to manage state, handle side effects, and access other React features without needing class components. They provide a simpler and more efficient way to manage component logic.

A hook is function that gives you access to React's internal Memory. You gain access to a value and a command to modify this value. A query and a command.

Hooks are just functions. There is nothing special about them other than they have a few well-known conventions:

Hooks should only be called from React functional components. Hooks can assume they can call all the normal React APIs such as useState, useContext, etc.

By convention, hook function names should start with the word "use". This tells the reader that the function is a hook.

- Hooks can call other hooks.

- Hooks should follow the Rules of Hooks.

> What's the point of hooks? Same reason why you would want functions in non-React code:

1. To "outsource" complex functionality to the function and simplify the code that calls the function.

2. To follow the DRI principle (Don't Repeat Yourself). Logic that appears in multiple places can instead be refactored in a function

3. To follow the Single Responsibility Principle. If your component gets too large and complex, that's a sign it has too many responsibilities and should be broken up. You can break it up into multiple components and/or custom hooks.

> Rules for using Hooks

- Only functional components can use hooks
- Hooks must be imported from React
- Calling of hooks should always be done at top level of components
- Hooks should not be inside conditional statements

# Types of React Hooks

7 Major Types of Hooks

1. State Hooks ( useState and useReducers)
2. Context Hooks (useContext)
3. Effect Hooks (useEffect, useLayoutEffect, useInsertionEffect)
4. Performance Hooks (useMemo, useCallback) - used to optimize performance by avoiding unnecessary re-renders or recalculations.
5. Resource Hooks (useFetch) -The useFetch is typically a custom hook used for fetching data from an API. It is implemented with useEffect to fetch data when the component mounts or when dependencies change.
6. Other Hooks

   - useReducer - for complex state management.
   - useImperativeHandle - customize the instance value exposed by useRef.
   - useLawetEffect - like useEffect but fires synchronously after DOM updates.

7. Custom Hooks - user-defined functions that encapsulate reusable logic

## useState

Whenever state altered in the parent component, child components also re-renders along with parent component.
But, Sibling component is unaffected by the re-renders via state updates of the parent component.

Q. Why the stae value does not reset to its initial value on the re-renders?

- Ans: The useState hook is smart enough to only use the initial value the very first time it renders the component.

- You can pass entire array comprising object to the initial value of useState and thereafter traverse via map declarative function to fetch elements of the object.

## Derived State

In React, a "derived state" refers to a value or piece of state that is calculated from props or other state values, rather than being stored independently in the component's useState or this.state.

It is derived (computed) from existing data, rather than being independently stored and updated.

```jsx
function Greeting({ name }) {
  const uppercasedName = name.toUpperCase(); // derived from props

  return <h1>Hello, {uppercasedName}!</h1>;
}
```

Here, uppercasedName is derived state — it's computed from props.name and doesn't need to be stored with useState.

## Lifting up the state

In React, "lifting up the state" means moving state to the closest common ancestor component of two or more components that need to share or sync that state.

When two sibling components need to access or update the same piece of data, it's best to:

- Move (lift) the state to their common parent.

- Pass it down to both children via props.

- Let children send updates back to the parent using callback functions.

```jsx
function Parent() {
  const [name, setName] = useState("");

  return (
    <>
      <InputBox name={name} setName={setName} />
      <Display name={name} />
    </>
  );
}

function InputBox({ name, setName }) {
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

function Display({ name }) {
  return <p>Hello, {name}</p>;
}
```

> Lift state up when:

1. Multiple components need to access or modify the same state.

2. You need to coordinate behavior between components.

3. You want a single source of truth.

# Challenge of useState Added

- components/hooks/useState/ChallengeUseState.jsx
- components/hooks/useState/RegistrationReact.jsx
- components/hooks/useState/LoginReact.jsx with external validation

# Challenge of useEffect Added

- components/hooks/useEffect/ChallengeUseEffect.jsx
- components/hooks/useEffect/CleanUpFunctionExample.jsx

- Added Component HowNotToFetchAPI Data ->

Check the Network tab in your dev tools to witness thousands of requests being made, because request is made in infinite loops.

Because the moment setApiData alters the value of apiData, our component gets re-rendered, it sets another value of apiData and makes a call to our API, and recursively, it'll continue to bleed network request tab.
In this case, it's better to abstain from consequentialism and embrace deontology (useEffect).

# useRef

| #   | Concept                                                                                        | Description          |
| --- | ---------------------------------------------------------------------------------------------- | -------------------- |
| 1   | `useRef` returns a **mutable object**                                                          | `{ current: value }` |
| 2   | It **does NOT trigger re-render** when `current` is changed                                    |                      |
| 3   | It **persists between renders** (doesn’t reset like a regular variable)                        |                      |
| 4   | Used to **access DOM elements** (e.g., `<input ref={myRef}>`)                                  |                      |
| 5   | Used to **store values across renders** without affecting UI                                   |                      |
| 6   | Great for **interval/timeout IDs**, **flags**, **scroll positions**, etc.                      |                      |
| 7   | Can be combined with `useImperativeHandle` for parent-to-child control                         |                      |
| 8   | Can hold **previous props/state values** for comparison                                        |                      |
| 9   | Can optimize performance by avoiding unnecessary renders                                       |                      |
| 10  | Can be used with `forwardRef` to expose functions to parent components (Depricated in React19) |                      |

# Challenges of useRef

## Level 1

> components/hooks/useRef/UseRefFirstComponent.jsx (Tasks[1,2] - Level 1)

- Task 1: Autofocus an input on mount
  Create a login form. Autofocus the email input when the component mounts.

- Task 2: Button to focus on another input
  Create two inputs. Use a button to focus the second input when clicked.

## Level 2: Persistent Values Without Re-render

- Task 3: Build a counter with useRef

Clicking a button should increase the value stored in useRef.

Log the value in the console.

Show on-screen how the value doesn’t change unless a re-render is triggered manually.

- Task 4: Implement a non-re-rendering timer

> components/hooks/useRef/UseRefSecondComponent.jsx (Tasks[3,4] - Level 2)

## Level 3: Practical Use Cases

- Task 5: Prevent multiple API submissions

> components/hooks/useRef/UseRefThirdComponent.jsx (Tasks[5,6] - Level 3)
> Create a form. Use a ref flag (isSubmitting) to prevent multiple submits.
> Use setTimeout to simulate API delay.
> Use setInterval and useRef to count seconds.
> Display the internal counter via console (don’t update UI).
> Add a button to print the current seconds value.

- Task 6: Track previous prop or state
  Build a component that receives a prop and displays both:

current prop value
previous prop value using useRef.

- Task 7: Store scroll position on component unmount

> components/hooks/useRef/UseRefFifthComponent.jsx

Use a ref to store scroll position before the component unmounts.
Log it to the console

- Task 8: Create a child component exposing a method to the parent
  by Use forwardRef and useImperativeHandle

- Task 9: Use useRef for DOM measurements
  Use ref.current.getBoundingClientRect() to measure the size of a box

Show it in UI after mount
getBoundingClientRect() is a built-in DOM method that returns the size and position of an HTML element relative to the viewport.

- Task 10 : Optimize performance using useRef as a cache
  Build a component that processes a large dataset

Store previously processed results in a ref cache to avoid recomputation

- Task 11 : Cache Expensive Processing of an Array
  Simulate processing of an array (e.g., squaring each number).

Use useRef to cache results of each number.

Avoid re-processing previously handled values.


## useId Hook

It generates a unique string ID, but don't leverage it to generate keys in a list.

A single ID can be used for multiple form elements with concatenation.
Why is it necessary? Consider a scenario where you have multiple forms in your app, you, as a developer, might use ID as username for every username field, then when you try to access its reference from javascript. It will cause dilemna.  Henceforth, it's a good practice to useId hook.

- Unique across the app: Ensures ID collisions don't happen.

- Consistent with SSR: Same ID is used on both server and client, avoiding hydration issues.

- Stable across renders: The ID remains the same even after re-renders.

- Automatic prefixing: React prefixes the ID with something like :r0: to ensure uniqueness.