import React, { useEffect, useRef, useState } from "react";
/* 

Build a component that receives a prop and displays both:

current prop value

previous prop value using useRef
*/
export function UseRefFourthComponent({ msg , count, setCount , handleClickIncrease}) {
  const previousMessage = useRef(null);
  const previousCount = useRef();

  useEffect(() => {
    previousMessage.current = msg;
    previousCount.current = count;
  }, [msg, count]);
  //   console.log(msg);
  return (
    <div>
      <h1>UseRef Fourth Component</h1>
      <h1>Task 6: Track previous prop or state</h1>
      <p>Message from Parent Component: {msg}</p>
      <p>
        Message from Previous Ref: {previousMessage.current ?? "Not Available"}
      </p>

      <p>
        Count from Previous Ref : {previousCount.current ?? 0}
      </p>

      <h1>Counter: {count}</h1>
      <button className="bg-blue-500 text-white font-bold hover:bg-blue-700 p-2 m-3" onClick={handleClickIncrease}>Increase </button>
    </div>
  );
}

export default function ParentComponent() {
  const message = "cyberadityacode";
  const [count, setCount] = useState(0);

  const handleClickIncrease = () => {
    setCount((prev) => prev + 1);
  };
  return (
    <>
      <UseRefFourthComponent msg={message} count={count} setCount={setCount} handleClickIncrease = {handleClickIncrease}/>
    </>
  );
}
