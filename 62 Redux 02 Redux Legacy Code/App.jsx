import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Redux Counter</h1>
      <h2>Count - {count}</h2>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>Increase</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>Decrease</button>
    </div>
  );
}
