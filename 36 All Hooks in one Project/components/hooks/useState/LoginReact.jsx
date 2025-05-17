import React, { useState } from "react";
// import { userLoginValidation } from "./loginValidation";
import { validateLogin } from "../../../utils/validateLogin.js";

export default function LoginReact() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });

  const[error,setError] = useState({});
   const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    //Real time field validation
    const fieldError = validateLogin(name,value)
    setError((prev)=> ({...prev, ...fieldError}))
  };

  const handleUserLogin = (event) => {
    event.preventDefault();

    const usernameErr = validateLogin("username", userDetails.username);
    const passwordErr = validateLogin("password", userDetails.password);

    const newErrors = {...usernameErr,...passwordErr};
    setError(newErrors);

    const hasErros = Object.values(newErrors).some((err)=> err !=="");
    if(!hasErros){
        console.log("Logging With...", userDetails);
        setLoginSuccess(true)
        // proceeding with login logic
    }else{
        setLoginSuccess(false)
    }
  };
  return (
    <div className="container flex justify-center items-center ">
      <h1>Login Form React19</h1>
      <form onSubmit={handleUserLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={userDetails.username}
          onChange={handleInputChange}
        />
        {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={userDetails.password}
          onChange={handleInputChange}
        />
        {error.password && <p className="text-red-500 text-sm">{error.password}</p>}

        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>

      {loginSuccess && (
        <p className="text-green-600">Thank you for Login!</p>
      )}
    </div>
  );
}
