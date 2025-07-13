import React from "react";
import useForesight from "./components/useForesight";

export default function App() {
  const { elementRef, registerResults } =
    useForesight <
    HTMLButtonElement >
    {
      callback: () => {
        console.log("Prefetching data...");
        // Your prefetch logic here
      },
      hitSlop: 10,
      name: "my-button",
    };
  return <button ref={elementRef}>Hover to prefetch</button>;
}
