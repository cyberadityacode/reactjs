import React, { useState } from "react";

export default function LiftStateUp() {
  const [userName, setUserName] = useState("");

  return (
    <>
      <div>LiftStateUp</div>
      <InputComponent name ={userName} setName = {setUserName} />
      <DisplayComponent name ={userName} />
    </>
  );
}

export const InputComponent = ({name, setName}) => {
  return (
    <>
      <div>
        <label htmlFor="username">Input Name: </label>
        <input name="username" type="text" value={name} onChange={(e)=>setName(e.target.value)} />
      </div>
    </>
  );
};

export const DisplayComponent = ({name}) => {
  return (
    <>
      <div>
        <h1>Display Component {name}</h1>
      </div>
    </>
  );
};
