import React from "react";

export default function UnControlled() {
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted Successfully");
    const username = document.querySelector("#username").value
    const age = document.querySelector("#age").value
    console.log(username, age);
  };
  return (
    <div className="parent-form">
      <h1>UnControlled Form Component</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="username">
          Username:
          <input id="username" type="text" />
        </label>
        <label htmlFor="age">
          Age:
          <input id="age" type="number" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
