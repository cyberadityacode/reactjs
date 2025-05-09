import React, { act, useReducer } from "react";

export default function App() {

  const initialState = {
    count :0,
    inc:2,
    dec:2,
  }
  const reducer = (state, action) => {
   console.log(state, action);
   /*  if (action.type === "INCREMENT") {
      return state + 1;
    } else if (action.type === "DECREMENT") {
      return state - 1;
    }else{
        return 0
    } */
// spread operator in this case ensure the remaining attributes of the object remains intact, only the count key get altered.
    switch(action.type){
      case "INCREMENT":
        return {
          ...state,
          count: state.count +1};
        
      case "DECREMENT":
        return {...state, 
          count: state.count -1};
      
      case "RESET":
        return {...state, 
          count: 0};
      
      default:
        return state;
      
    }
      
  };

  // const [count, dispatch] = useReducer(reducer, 0);
  const [state, dispatch] = useReducer(reducer, initialState);

  // console.log(state.count);
  
  return (
    <div className="flex flex-col">
      <h1 className="text-center text-3xl">useReducer Hook with Counter App</h1>
      <div className=" flex flex-col h-lvh justify-center items-center [&>button]:p-4 [&>button]:my-2">
        <h1 className="text-4xl font-bold">{state.count}</h1>
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
