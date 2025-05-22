import React, { useReducer } from "react";

export default function UseReducerFifth() {
  const initialState = {
    count: 0,
    incBy: 2,
    decBy:2,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return { ...state, count: state.count + state.incBy };
        break;

      case "DECREMENT":
        return {...state, count: state.count - state.decBy };
        break;

      case "RESET":
        return {...state, count: 0 };
        break;
      default:
        return state;
    }
  };

  const handleDispatch = (e) => {
    const validActions = ["INCREMENT", "DECREMENT", "RESET"];
    const actionType = e.currentTarget.dataset.action;
    if (validActions.includes(actionType)) {
      console.log(actionType);
      dispatch({ type: actionType });
    } else {
      console.warn("Woah... are you trying JSX Injection?");
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="p-4 h-lvh flex flex-col justify-center items-center">
      <h1 className="text-2xl">Counter Application Using useReducer</h1>
      <h1 className="text-3xl">{state.count}</h1>
      <h1 className="text-2xl">{state.warningMessage}</h1>
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
      <button
        onClick={handleDispatch}
        data-action="RESET"
        className="p-3 bg-gray-500 text-white font-bold rounded m-3 hover:bg-grey-800 active:scale-105 cursor-pointer"
      >
        Reset
      </button>
    </div>
  );
}
