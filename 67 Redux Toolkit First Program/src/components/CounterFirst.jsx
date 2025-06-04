import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
} from "../features/counter/counterSlice";

export default function CounterFirst() {
  const [amount, setAmount] = useState(1);
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
  };
  return (
    <div>
      <h1>Redux RTK Counter {count}</h1>
      <button onClick={() => dispatch(increment())}>Increase</button>
      <button onClick={() => dispatch(decrement())}>Decrease</button>

      <input type="number" value={amount} onChange={handleAmountChange} />
      <button onClick={() => dispatch(incrementByAmount(7))}>
        Increment by 7
      </button>
      <button onClick={() => dispatch(incrementByAmount(amount))}>
        Increment by {amount}
      </button>
    </div>
  );
}
