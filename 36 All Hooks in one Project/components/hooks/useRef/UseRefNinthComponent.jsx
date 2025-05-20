import React from "react";
import { useRef } from "react";
import { useState } from "react";
/* Task: Cache Expensive Processing of an Array
We’ll:

Simulate processing of an array (e.g., squaring each number).

Use useRef to cache results of each number.

Avoid re-processing previously handled values.

 */
const expensiveElementSquareFunction =(num)=>{
    return num**2;
}

export default function UseRefNinthComponent() {
  const [elements, setElements] = useState([]);
  const [result, setResult] = useState([]);
  const elementCache = useRef({});

  const handleElementSquaring = () => {
    const inputArray = elements
      .split(",")
      .map((v) => parseInt(v))
      .filter((n) => !isNaN(n));
    // const output = inputArray.map((sq)=> sq**2)
    console.log(inputArray);
    // console.log(output);
    const processed = inputArray.map((num) => {
      if (elementCache.current[num]) {
        console.log("Already Stored in my Cache: ", num);
        return elementCache.current[num];
      } else {
        const resultOp = expensiveElementSquareFunction(num);
        elementCache.current[num] = resultOp;
        return resultOp;
      }
    });
    setResult(processed);
  };
  return (
    <div className="mt-4 border-t">
      <h1>UseRefNinth Component</h1>

      <input
        value={elements}
        onChange={(e) => setElements(e.target.value)}
        className="p-3 border rounded"
        type="text"
        placeholder="enter numbers with comma like 1,2,3,4"
      />
      <button onClick={handleElementSquaring}>
        Compute Square of Array Elements
      </button>

      {
        result && (
            <h1>Output:{JSON.stringify(result, null, 2)}</h1>

            /* JSON.stringify(value, replacer, space) 
            space: number of spaces for indentation → 2 means it formats the output with 2-space indentation for readability.*/
        )
      }
    </div>
  );
}
