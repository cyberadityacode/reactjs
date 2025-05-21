import React, { act, useReducer, useState } from "react";
// Counter App using useReducer

export default function UseReducerFirst() {

    const reducer =(state,action)=>{
        console.log(state, action);
        if(action.type ==="INCREMENT"){
            return state+1;
        }else if(action.type ==="DECREMENT"){
            return state-1;
        }else{
            return state;
        }
    }
    // const [count, setCount] = useState(0);
    const [count, dispatch] = useReducer(reducer, 0);
    console.log(useReducer(reducer, 0));
  return (
    <>
      <div className="p-4 h-lvh flex flex-col justify-center items-center">
        <h1 className="text-2xl">Counter Application Using useReducer</h1>
        <h1 className="text-3xl">{count}</h1>
        <button onClick={()=> dispatch({type:"INCREMENT"})} className="p-3 bg-green-500 text-white font-bold rounded m-3 hover:bg-green-800 active:scale-105 cursor-pointer">Increment</button>
        <button onClick={()=> dispatch({type:"DECREMENT"})} className="p-3 bg-red-500 text-white font-bold rounded m-3 hover:bg-red-800 active:scale-105 cursor-pointer">Decrement</button>
      </div>
    </>
  );
}
