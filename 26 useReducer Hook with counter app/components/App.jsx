import React, { useReducer } from "react";

export default function App() {
  const reducer = (state, action) => {
   
    if (action.type === "INCREMENT") {
      return state + 1;
    } else if (action.type === "DECREMENT") {
      return state - 1;
    }else{
        return 0
    }
  };

  const [count, dispatch] = useReducer(reducer, 0);

  console.log(count);
  return (
    <div className="flex flex-col">
      <h1 className="text-center text-3xl">useReducer Hook with Counter App</h1>
      <div className=" flex flex-col h-lvh justify-center items-center [&>button]:p-4 [&>button]:my-2">
        <h1 className="text-4xl font-bold">{count}</h1>
        <button
          onClick={() => dispatch({ type: "INCREMENT" })}
          className="w-35 border bg-green-500 font-bold text-white rounded hover:bg-green-800 active:scale-105"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch({ type: "DECREMENT" })}
          className="w-35 border bg-red-500 font-bold text-white rounded hover:bg-red-800 active:scale-105 "
        >
          Decrement
        </button>

         <button
          onClick={() => dispatch({ type: "RESET" })}
          className="w-35 border bg-gray-500 font-bold text-white rounded hover:bg-gray-800 active:scale-105 "
        >
          Reset
        </button>
      </div>
    </div>
  );
}
