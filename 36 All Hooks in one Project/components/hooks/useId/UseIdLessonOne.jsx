import React, { useId } from "react";

export default function UseIdLessonOne() {
  const usernameId = useId();
  const passwordId = useId();

//   You can use single id for multiple form elements via concatenation
    const singleId = useId();

  return (
    <div>
      <h1>UseId Lesson One</h1>
      <div>
        <label htmlFor={usernameId}>Username</label>
        <input type="text" id={usernameId} placeholder="enter username..." />
        <label htmlFor={passwordId}>Password</label>
        <input type="text" id={passwordId} placeholder="enter password..." />
       
       {/* Using Single ID with concatenation */}
        <label htmlFor={singleId + "age"}>age</label>
        <input type="number" id={singleId + "age"} placeholder="enter Age..." />
        <label htmlFor={singleId + "address"}>Address</label>
        <input type="text" id={singleId + "address"} placeholder="enter address..." />
        <button className="p-3 border m-3">Register</button>
      </div>
    </div>
  );
}
