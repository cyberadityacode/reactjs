import React, { useEffect, useRef } from "react";

export default function UseRefFirstComponent() {
  const username = useRef(null);
  const email = useRef(null);

  useEffect(() => {
    if (username.current) {
      console.log(username.current);
      username.current.focus();
    }
  }, []);

  const handleBtnFocusOnEmail = ()=>{
    email.current.focus();
  }

  return (
    <div>
      <h1>useRef First Component</h1>
      <h1>Level 1: Basics & DOM Access</h1>
      {/* 
        Task 1: Autofocus an input on mount
Create a login form. Autofocus the username input when the component mounts.
        */}
      {/* Task 2: Button to focus on another input */}
      <div>
        <h1>AutoFocus an Input on mount using useRef </h1>
        <input
          type="text"
          placeholder="enter username"
          className="border"
          ref={username}
        />
        <input ref={email} type="email" placeholder="enter Email" className="border" />
        <button
          onClick={handleBtnFocusOnEmail}
          className="p-2 bg-blue-500 text-white font-bold hover:bg-blue-800"
        >
          Focus on Email input field
        </button>
      </div>
    </div>
  );
}
