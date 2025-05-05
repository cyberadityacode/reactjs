import React from "react";
import { NavLink, Outlet } from "react-router";


export default function NavBar() {
  return (
    <>
  <div>
  <nav>
        <div className="bg-gray-800 text-3xl text-white [&>*]:mx-3 flex justify-between items-center px-4 py-2   ">
          <h1 className="text-white">Logo</h1>
          <div className="flex space-x-6 text-base [&>*]:hover:bg-gray-900 [&>*]:px-3 [&>*]:py-1 rounded">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/college">College</NavLink>
          </div>
        </div>
      </nav>
      <Outlet />
  </div>
      
    </>
  );
}
