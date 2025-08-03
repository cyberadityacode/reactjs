import GrandChildComponent from "./GrandChildComponent";

export default function ChildComponent({ secret, setSecret }) {
  return (
    <div>
      <h1>Child Component - {secret}</h1>{" "}
      <button onClick={(e) => setSecret((prev) => prev + 7)}>
        Increment from Child
      </button>
      <GrandChildComponent secret={secret} gcSetSecret={setSecret} />
    </div>
  );
}
