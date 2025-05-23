import React from "react";
import { NavLink, useNavigate, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleNavigate = ()=> navigate(-1);
  console.log(error); // shows status, data and other route error messages.
  return (
    <div>
      <h1>Custom ErrorPage :404</h1>
      <NavLink to="/">
        <button className="p-3 m-3 border cursor-pointer">back to home?</button>
      </NavLink>

      <button onClick={handleNavigate} className="p-3 m-3 border cursor-pointer">back to previous page</button>
    </div>
  );
}
