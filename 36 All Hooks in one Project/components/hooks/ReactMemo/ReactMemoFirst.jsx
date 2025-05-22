import React, { useEffect, useState } from "react";
import ReactMemoFirstChild from "./ReactMemoFirstChild";

export default function ReactMemoFirst() {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('aditya');

    

    const handleCountIncrease =()=>{
        setCount(prev => prev+1);
    }

    const handleMessageChange = ()=>{
       setMessage(prev=> prev= "cyberaditya")
    }
  console.log("Hello From Parent Component");
  useEffect(() => {}, []);

  return (
    <div>
      <h1>ReactMemo First Parent : {count}</h1>
       <button onClick={handleCountIncrease} className="p-3 m-3 bg-green-500 text-white font-bold hover:bg-green-700 active:scale-105">Increase</button>     
       <button onClick={handleMessageChange} className="p-3 m-3 bg-blue-500 text-white font-bold hover:bg-blue-700 active:scale-105">Change Message Prop on Parent</button>     
      <ReactMemoFirstChild message={message} />
    </div>
  );
}
