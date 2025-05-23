import React from "react";
import { useState } from "react";
import Button from "./Button";
import Counter from "./Counter";
import Button2 from "./Button2";

export default function App({localStorageValue}) {
  const [countValue, setCountValue] = useState(localStorageValue);
  const clickHandler = () => {
    setCountValue((prev) => prev + 1);
    console.log("clicked");
  };
  return (
    <div>
      {/* <Counter countAnyValue={countValue} />
      <Button clickToIncrease={clickHandler}>Button Name as Children Prop</Button>
 */}
    {/* Conditional Rendering i.e display component only if condition is true*/}
    {/* { true? <Counter countAnyValue={countValue} />: <Button clickToIncrease={clickHandler}>Button Name as Children Prop</Button>} */}
    <Counter countAnyValue={countValue} />
    <Button clickToIncrease={clickHandler}>Button Name as Children Prop</Button>
    <Button2>Button2</Button2>
    </div>
  );
}
