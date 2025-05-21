import React, { act, useReducer } from "react";
/* 
handleDispatch validations applied!
Best Counter with useReducer with validation of data-action on button,
Hack Proof!
Try to change the data set value to something else via dom elements or console, 
it will prompt you a warning message.

*/

export default function UseReducerSecond() {
  const reducer = (state, action) => {
    if (action.type === "INCREMENT") {
      console.log(state, action);
      return state + 1;
    } else if (action.type === "DECREMENT") {
      console.log(state, action);
      return state - 1;
    } else if (action.type === "RESET") {
      return (state = 0);
    }
  };

  const handleDispatch = (e) => {
    const validActions = ["INCREMENT", "DECREMENT", "RESET"];
    const actionType = e.currentTarget.dataset.action;
    console.dir(e.currentTarget); //dataset:DOMStringMap ; action:"INCREMENT"

    if (validActions.includes(actionType)) {
      dispatch({ type: actionType });
    } else {
      console.warn(
        "Unhandled action type Are you Trying to Hack?:",
        actionType
      );
    }
  };
  const [count, dispatch] = useReducer(reducer, 0);
  return (
    <div className="p-4 h-lvh flex flex-col justify-center items-center">
      <h1 className="text-2xl">Counter Application Using useReducer</h1>
      <h1 className="text-3xl">{count}</h1>
      <button
        onClick={handleDispatch}
        data-action="INCREMENT"
        className="p-3 bg-green-500 text-white font-bold rounded m-3 hover:bg-green-800 active:scale-105 cursor-pointer"
      >
        Increment
      </button>
      <button
        onClick={handleDispatch}
        data-action="DECREMENT"
        className="p-3 bg-red-500 text-white font-bold rounded m-3 hover:bg-red-800 active:scale-105 cursor-pointer"
      >
        Decrement
      </button>

      <button
        onClick={handleDispatch}
        data-action="SOMETHING"
        className="p-3 bg-teal-500 text-white font-bold rounded m-3 hover:bg-red-800 active:scale-105 cursor-pointer"
      >
        Something
      </button>
    </div>
  );
}
