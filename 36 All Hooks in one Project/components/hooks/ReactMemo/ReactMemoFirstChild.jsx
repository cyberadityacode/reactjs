import React, { useEffect } from "react";

function ReactMemoFirstChild({message}) {
  console.log("Hello From Child Component");
  useEffect(() => {
    // console.log("First Render is ok");
  }, []);
  return (
    <div>
      <h1>ReactMemoFirst Child- Props received {message}</h1>
    </div>
  );
}

export default React.memo(ReactMemoFirstChild); // prevent re-render of child component because of state update on parent component
