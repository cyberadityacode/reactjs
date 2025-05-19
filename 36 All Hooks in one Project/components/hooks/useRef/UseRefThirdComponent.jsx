import React, { useRef, useState } from "react";

export default function UseRefThirdComponent() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    age: "",
  });
  const [status, setStatus] = useState("");
  const isSubmitting = useRef(false); //its not filled yet

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting.current) {
      console.log("Form is already Submitted What you are doing here?");
      setStatus(
        "Form is already Submitted Are you here to find purpose of your life?"
      );
      return;
    } else if (!isSubmitting.current) {
      setStatus("Submitting...");
      console.log("Submitting user details:", userDetails);
      isSubmitting.current = true;

      //simulate API Call delay
      setTimeout(() => {
        setStatus("Form Sumitted Successfully!");
        console.log("Form Submitted Successfully");
      }, 2000);
    } else {
      setStatus("What went wrong....?");
      return;
    }

    setUserDetails({
      username: "",
      email: "",
      age: "",
    });
  };

  const handleFormUpdate = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1>useRef Third Component</h1>
      <p>Task 5: Prevent multiple API submissions </p>
      
      {/* Task 5: Prevent multiple API submissions
Create a form. Use a ref flag (isSubmitting) to prevent multiple submits.

Use setTimeout to simulate API delay. */}

      <form onSubmit={handleFormSubmit} className="flex flex-col m-3 mb-3">
        <input
          type="text"
          value={userDetails.username}
          onChange={handleFormUpdate}
          name="username"
          placeholder="Enter Username..."
        />
        <input
          type="email"
          value={userDetails.email}
          onChange={handleFormUpdate}
          name="email"
          placeholder="Enter Email..."
        />
        <input
          type="number"
          value={userDetails.age}
          onChange={handleFormUpdate}
          name="age"
          placeholder="Enter Age..."
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-800 text-white font-bold p-2 m-3 "
        >
          Register
        </button>
      </form>
      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
