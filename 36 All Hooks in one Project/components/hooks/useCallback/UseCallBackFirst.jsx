import React, { useCallback, useState } from "react";
import Button from "./Button";

export default function UseCallBackFirst() {
  const [count, setCount] = useState(0);

  const handleIncrease = useCallback(() => {
    setCount((prev) => prev + 1);
  },[]);
  const handleDecrease = useCallback(() => {
    setCount((prev) => prev - 1);
  },[]);

  return (
    <>
      <h1>Count : {count}</h1>
      <Button onClick={handleIncrease}>Increase</Button>
      <Button onClick={handleDecrease}>Decrease</Button>
    </>
  );
}
