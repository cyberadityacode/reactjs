import { useState } from "react";
import First from "./components/First";
import Second from "./components/Second";

export default function App() {
  const varA = "aditya";
  const [a, setA] = useState("a");
  const handleChange = () => {
    setA((prev) => (prev === "a" ? "b" : "a"));
  };
  return (
    <div>
      <h1>App Component</h1>
      <First p1={varA} />
      <Second p2={varA} a={a} setA={setA} />
      <button onClick={handleChange}>Change Value</button>
    </div>
  );
}
