import React, { useReducer } from "react";
import { reducerDelegation } from "./libraryUseReducerThird";
import ActionButton from "./ActionButton";

/* 
Reusable Button Component,Tried Seperation of Concern with Use Reducer's reducer function
using switch case.
*/
const VALID_ACTIONS = ["INCREMENT", "DECREMENT", "RESET"];

export default function UseReducerThird() {
  const reducer = reducerDelegation;
  /* const reducer = (count, action) => {
    // console.log(count, action);
    switch (action.type) {
      case "INCREMENT":
        return count + 1;
        break;

      case "DECREMENT":
        return count - 1;
        break;

      case "RESET":
        return (count = 0);
        break;

      default:
        return count;
    }
  }; */

  const handleDispatch = (e) => {
    const actionType = e.currentTarget.dataset.action;

    if (VALID_ACTIONS.includes(actionType)) {
      //   console.log(actionType);
      dispatch({ type: actionType });
    } else {
      console.warn(
        "Its not a valid action, Are you trying to hack with JSX Injection?"
      );
    }
  };
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div className="p-4 h-lvh flex flex-col justify-center items-center">
      <h1 className="text-2xl">Counter Application Using useReducer</h1>
      <h1 className="text-3xl">{count}</h1>
      {/*  <button
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
      <button
        onClick={handleDispatch}
        data-action="RESET"
        className="p-3 bg-gray-500 text-white font-bold rounded m-3 hover:bg-grey-800 active:scale-105 cursor-pointer"
      >
        Reset
      </button> */}

      {/* <ActionButton handleDispatch={handleDispatch} action="INCREMENT" className="p-3 bg-green-500 text-white font-bold rounded m-3 hover:bg-green-800 active:scale-105 cursor-pointer">Increment</ActionButton> */}

      <ActionButton
        action="INCREMENT"
        onClick={handleDispatch}
        className="bg-green-500 hover:bg-green-800"
      >
        Increment
      </ActionButton>
      <ActionButton
        action="DECREMENT"
        onClick={handleDispatch}
        className="bg-red-500 hover:bg-red-800"
      >
        Decrement
      </ActionButton>
      <ActionButton
        action="RESET"
        onClick={handleDispatch}
        className="bg-gray-500 hover:bg-gray-800"
      >
        Reset
      </ActionButton>
      <ActionButton
        action="SOMETHING"
        onClick={handleDispatch}
        className="bg-teal-500 hover:bg-teal-800"
      >
        Something
      </ActionButton>
    </div>
  );
}
