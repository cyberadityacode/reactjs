import React from "react";
import { useRef } from "react";
import { useState } from "react";

const expensiveCalculation = (num) => {
  console.log("Calculation the profound square of ", num);
  // simulate heavy computation
  for (let i = 0; i < 1e7; i++) {}
  return num * num;
};

export default function UseRefEighthComponent() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const cacheRef = useRef({}); // Cache object

  const handleCalculateSquare = () => {
    const number = parseInt(input);
    if (isNaN(number)) return;

    if (cacheRef.current[number]) {
      console.log("Already Stored in Cache");
      setResult(cacheRef.current[number]);
    } else {
      const output = expensiveCalculation(number);
      cacheRef.current[number] = output;
      setResult(output);
    }
  };
  return (
    <div>
      <h1>UseRefEighthComponent</h1>
      <h1>Task 10 : Optimize performance using useRef as a cache</h1>
      <p>
        Build a component that processes a large dataset Store previously
        processed results in a ref cache to avoid recomputation
      </p>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Enter number..."
        />

        <button className="border p-2 m-3" onClick={handleCalculateSquare}>
          Calculate Square
        </button>
      </div>
      {result !== null && <div className="mt-4 text-2xl">Result: {result}</div>}
    </div>
  );
}
