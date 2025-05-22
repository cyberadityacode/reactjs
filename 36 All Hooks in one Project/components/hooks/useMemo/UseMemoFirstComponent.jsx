import React, { useState } from "react";
import ExpensiveComponent from "./ExpensiveComponent";

function UseMemoFirstComponent() {

    const [count, setCount] = useState(0);
    const handleCountIncrease = ()=>{
        setCount(prev=> prev+1);
    }
  return (
    <>
      <div>UseMemo First Component</div>
      <div>
        <h1>Use Memo : {count}</h1>

        <ExpensiveComponent />
        <button
          onClick={handleCountIncrease}
          className="p-3 m-3 bg-green-500 text-white font-bold hover:bg-green-700 active:scale-105"
        >
          Increase
        </button>
       
       
      </div>
    </>
  );
}
export default UseMemoFirstComponent;
