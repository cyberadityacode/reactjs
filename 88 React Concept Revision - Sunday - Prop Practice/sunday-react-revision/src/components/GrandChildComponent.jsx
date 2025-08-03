export default function GrandChildComponent({ secret, gcSetSecret }) {
  return (
    <div>
      <h1>GrandChildComponent - {secret}</h1>
      <button onClick={(e) => gcSetSecret((prev) => prev + 10)}>
        Increment by Grand Child
      </button>
    </div>
  );
}
