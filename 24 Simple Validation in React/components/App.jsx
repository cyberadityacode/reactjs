import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");

  let [isValidPassword, setIsValidPassword] = useState(false);

  const handleName = (event) => {
    console.log(event.target.value);
    setName(event.target.value);

    setNameError(
      event.target.value.length === 0
        ? ""
        : event.target.value.length > 5
        ? "Username must not exceed 5 character"
        : "Good to go!"
    );

    event.target.value.length > 5
      ? setNameError("username must not exceed 5 character.")
      : setNameError("Good to Go!");
  };

  const handlePassword = (event) => {
    const value = event.target.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,}$/;
    const isValid = regex.test(value);
    
    setPassword(value)
    setIsValidPassword(isValid);

    setPassError(
      value.length === 0
        ? ""
        : isValid
        ? "Good to Go!"
        : "Password must contain atleast 7 alphanumeric characters"
    );
    console.log(password, isValidPassword); //abcXYZ1077 true
  };

  return (
    <div className="container mx-auto w-2xl   mt-4 px-4">
      <h1 className="text-center text-3xl font-bold">
        Simple Validation in React
      </h1>
      <div className=" w-full border-2 mx-auto  inline-flex flex-col justify-center items-center mt-5 space-y-4 p-4">
        <input
          onChange={handleName}
          className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Enter username"
        />
        {/* {!(name.length > 5) ? (
          <span className="text-green-400 text-s font-bold">{nameError}</span>
        ) : (
          <span className="text-red-400 text-s font-bold">{nameError}</span>
        )} */}

        {/* cheeky code
        <span className={`font-bold text-sm ${ 
           name.length>5 ? "text-red-500" : "text-green-500" 
        } `}>{nameError}</span> */}

        {/*super cheeky code  */}

        {name.length > 0 && (
          <span
            className={`font-bold text-sm ${
              name.length > 5 ? " text-red-500" : "text-green-500"
            }`}
          >
            {nameError}
          </span>
        )}

        <input
          onChange={handlePassword}
          className="w-full sm:w-3/4 p-2 border border-gray-300 rounded"
          type="text"
          placeholder="Enter password"
        />
        
        {password.length > 0 && (
          <span
            className={`text-sm font-bold ${
              isValidPassword ? "text-green-500" : "text-red-500"
            }`}
          >
            {passError}
          </span>
        )}

        
<button
  className="w-full sm:w-1/2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
  disabled={!name || name.length > 5 || !isValidPassword}
>
  Login
</button>
      </div>
    </div>
  );
}
