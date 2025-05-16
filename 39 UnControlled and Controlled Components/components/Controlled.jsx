import React, { useState } from "react";

export default function Controlled() {
    const [username, setUserName] = useState('')
    const [age, setAge] = useState('')
    
    const handleUsername = (event)=>{
        setUserName(event.target.value)
    }
    const handleAge = (event)=>{
        setAge(Number(event.target.value))
    }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted Successfully");
    console.log(username, age);
  };
  return (
    <div className="parent-form">
      <h1>Controlled Form Component</h1>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="username">
          Username:
          <input id="username" type="text" value={username} onChange={handleUsername}  />
        </label>
        <label htmlFor="age">
          Age:
          <input id="age" type="number" value={age} onChange={handleAge} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
