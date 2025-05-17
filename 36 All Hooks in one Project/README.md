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
  const [name, setName] = useState('');

  return (
    <>
      <InputBox name={name} setName={setName} />
      <Display name={name} />
    </>
  );
}

function InputBox({ name, setName }) {
  return <input value={name} onChange={e => setName(e.target.value)} />;
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