import { useState } from "react";
import ChildComponent from "./components/ChildComponent";

export default function App() {
  const [secret, setSecret] = useState(7);

  return (
    <div>
      <button onClick={() => setSecret((prev) => prev + 1)}>
        Increment from App
      </button>
      <ChildComponent secret={secret} setSecret={setSecret} />
    </div>
  );
}
