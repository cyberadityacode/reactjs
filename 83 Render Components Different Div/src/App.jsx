import { useSelector, useDispatch } from "react-redux";
import { increment } from "./store";

export default function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>App Component(Root1)</h1>

      <p>Count: {count}</p>

      <button onClick={() => dispatch(increment())}>Increase </button>
    </div>
  );
}
