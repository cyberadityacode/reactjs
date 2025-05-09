# useReducer Hook with simple Counter app

The useReducer hook is another way to manage state in React. It’s better than useState when your state logic is more complex—like when updates depend on the previous state or when you have different actions that change the state in different ways.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- **Reducer**: A function that decides how to change the state based on what action is sent. It takes the current state and an action as input.

- **initialState**: The starting value of the state.

- **State**: The current value of the state, given back by useReducer.

- **dispatch**: A function you use to send actions to the reducer to update the state. (Basically from form fields)

### Aforementioned Code performs: Increment, Decrement and Reset functionality