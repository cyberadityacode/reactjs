import React from "react";
import { useState } from "react";
import Button from "./Button";
import Counter from "./Counter";

export default function App({localStorageValue}) {
  const [countValue, setCountValue] = useState(localStorageValue);
  const clickHandler = () => {
    setCountValue((prev) => prev + 1);
    console.log("clicked");
  };
  return (
    <div>
      <Counter countAnyValue={countValue} />
      <Button clickToIncrease={clickHandler}>Button Name as Children Prop</Button>
    </div>
  );
}
