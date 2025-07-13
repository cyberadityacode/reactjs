import { useSelector } from "react-redux";

export default function AnotherComponent() {
  const count = useSelector((state) => state.counter.value);

  return (
    <div>
      <h2>Another Component (Root2)</h2>
      <p>Shared Count: {count}</p>
    </div>
  );
}
