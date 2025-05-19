import React, { useEffect, useRef, useState } from "react";

export default function UseRefSecondComponent() {
  //Task 3 - Starts

  const counter = useRef(0);
  const [_, forceRender] = useState(0);
  // const [, forceRender] = useState(0); both works fine

  const handleCounterIncrement = () => {
    counter.current += 1;
    console.log(counter.current);
  };

  const triggerRender = () => {
    /* Forcing the state to change (even though you don’t use it).
Which triggers a re-render, and that's the only purpose. */

    forceRender((prev) => prev + 1);
  };
  //Task 3 - Ends

  //Task 4 -Starts
  const countSeconds = useRef(0);
  const intervalRef = useRef(null); //good practice to cleanup interval, Not Mandatory

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      countSeconds.current += 1;
      console.log("Timer in Seconds ", countSeconds.current);
    }, 1000);

    //cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleShowTime = () => {
    console.log("Current Seconds Value is :", countSeconds.current);
  };

  //Task 4 - Ends
  return (
    <div>
      <h1>useRef Second Component</h1>
      <h1>Level 2: Persistent Values Without Re-renders</h1>
      {/* Task 3: Build a counter with useRef
Clicking a button should increase the value stored in useRef.

Log the value in the console.

Show on-screen how the value doesn’t change unless a re-render is triggered manually. */}

      <div>
        <h1 className="text-3xl">Counter : {counter.current}</h1>
        <button
          onClick={handleCounterIncrement}
          className="p-3 bg-green-500 text-white font-bold m-3 hover:bg-green-800"
        >
          Increase
        </button>
        <button
          onClick={triggerRender}
          className="p-3 bg-gray-500 text-white font-bold m-3 hover:bg-gray-800"
        >
          Re-Render
        </button>
      </div>

      {/* 
        Task 4: Implement a non-re-rendering timer
Use setInterval and useRef to count seconds.

Display the internal counter via console (don’t update UI).

Add a button to print the current seconds value.
        */}

      <button onClick={handleShowTime} className="p-3 bg-red-500 text-white font-bold m-3 hover:bg-red-800">Current Seconds Value Log</button>
    </div>
  );
}
