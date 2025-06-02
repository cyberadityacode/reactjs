import React, { useReducer } from "react";

const initialState = {
  count: 0,
  incBy: 1,
  decBy: 1,
};
const reducer = (state, action) => {
  console.log("reducer recieved state and action: ", state.count, action);
  if (action.type === "INCREASE") {
    console.log("Increase clicked");
    return {
      ...state,
      count: state.count + state.incBy,
    };
  } else if (action.type === "DECREASE") {
    console.log("Decrease Clicked");
    return {
      ...state,
      count: state.count - state.decBy,
    };
  }

  return state;
};

export default function UseReducerFirst() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>Counter {state.count}</h1>
      <button onClick={() => dispatch({ type: "INCREASE" })}>Increase</button>
      <button onClick={() => dispatch({ type: "DECREASE" })}>Decrease</button>
    </div>
  );
}
