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

            {/* Using Custom Class in Navigation, it will apply className - custom-active if navlink is active and vice-versa */}
            <NavLink className={({isActive}) => isActive?'custom-active' : 'not-active'} to="/login">Login</NavLink>
            <NavLink to="/college">College</NavLink>
            <NavLink to="/users">Users</NavLink>
            <NavLink to="/users/list">List</NavLink>
          </div>
        </div>
      </nav>
      <Outlet />
  </div>
      
    </>
  );
}
