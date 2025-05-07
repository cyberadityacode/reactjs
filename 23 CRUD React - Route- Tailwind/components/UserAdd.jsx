import React, { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink, Route, Routes } from "react-router";

export default function UserAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const createUser = async () => {
    try {
      console.log(name, age, email);

      const urlPOST = "http://localhost:3000/users";
      let response = await fetch(urlPOST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age, email }),
      });
      if (!response.ok) throw new Error("Error Fetching Data");

      response = await response.json();
      console.log("got it", response);
      setName("");
      setAge("");
      setEmail("");
      setResponseMessage("User Added");
      console.log('done');
      navigate("/", { replace: true }); // Add the navigate call back here
      
    } catch (Error) {
      console.log("Error occured", Error);
      setResponseMessage("Failed to add user");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-100">
        <h1 className="font-bold">Add New User</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name.."
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          placeholder="Enter Age"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email.."
        />
        <button
          onClick={() => createUser()}
          className="p-2 mt-2 bg-green-500 text-white font-bold rounded active:scale-105"
        >
          Add User
        </button>

        {responseMessage && (
          <h1 className="mt-2 text-green-600 font-semibold">
            {responseMessage}
          </h1>
        )}
      </div>
    </>
  );
}
