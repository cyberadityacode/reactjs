import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const count = useSelector((state) => state.count);
  const [amount, setAmount] = useState(1);

  const dispatch = useDispatch();
  return (
    <div>
      <h1>Redux Counter</h1>
      <h2>Count - {count}</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={() => dispatch({ type: "INCREMENT", payload: amount })}>
        Increase
      </button>
      <button onClick={() => dispatch({ type: "DECREMENT", payload: amount })}>
        Decrease
      </button>
    </div>
  );
}
