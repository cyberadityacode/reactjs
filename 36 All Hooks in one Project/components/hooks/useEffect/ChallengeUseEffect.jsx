import React, { useEffect, useState } from "react";

export default function ChallengeUseEffect() {
  const [countName, setCountName] = useState({
    count: 0,
    textName: "",
  });

  const handleButtonIncrement = () => {
    setCountName((prev) => ({ ...prev, count: prev.count + 1 }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCountName((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    document.title = "Count: " + countName.count;
  }, [countName.count]);

  useEffect(() => {
    console.log("Name: ", countName.textName);
  }, [countName.textName]);

  return (
    <div className="">
      <div className="parent-div">
        <h1>Challenge useEffect</h1>
        <h1 className="counter">Count {countName.count}</h1>
        <button onClick={handleButtonIncrement}>Increment</button>
        <h1 className="input-display">Name: - {countName.textName} </h1>
        <input
          name="textName"
          value={countName.textName}
          onChange={handleInputChange}
          className="input-text"
          type="text"
        />
      </div>
    </div>
  );
}
