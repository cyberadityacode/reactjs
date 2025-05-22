import React, { useMemo, useState } from "react";
import ReactMemoFirstChild from "./ReactMemoFirstChild";

export default function PassingObjectReactMemo() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("aditya");

  // This won't prevent child component rendering, its better to keep its outside component scope, since its static object.
  // but, You can use useMemo to memoize this object

  /*   const personalInfo = {
    name: "aditya dubey",
    age: 31,
  } */

  /* const personalInfo = useMemo(()=>({
    name: "aditya dubey",
    age: 31,
  }),[]);

 */
  // If you want to freeze the content inside the object use Object.freeze; but this won't freeze the reference of object.
  /* The object is frozen (immutable)

Its reference is stable across renders (thanks to useMemo) */
  const personalInfo = useMemo(
    () =>
      Object.freeze({
        name: "aditya dubey",
        age: 31,
      }),
    []
  );

  const handleMessageChange = () => {
    setMessage((prev) => "cyberaditya");
  };

  const handleCountIncrease = () => {
    setCount((prev) => prev + 1);
  };
  return (
    <div>
      <h1>Passing Object to React Memo : {count}</h1>
      <button
        onClick={handleCountIncrease}
        className="p-3 m-3 bg-green-500 text-white font-bold hover:bg-green-700 active:scale-105"
      >
        Increase
      </button>
      <button
        onClick={handleMessageChange}
        className="p-3 m-3 bg-blue-500 text-white font-bold hover:bg-blue-700 active:scale-105"
      >
        Change Message Prop on Parent
      </button>

      {/* Passing Object as a Prop will result in code break, because obj reference is altered during rendering phase of the parent component. */}
      <ReactMemoFirstChild message={message} personalInfo={personalInfo} />

      {/* <ReactMemoFirstChild message={message} /> */}
    </div>
  );
}
