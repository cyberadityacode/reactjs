import React from "react";
import { Route, Routes, Link, NavLink, Outlet } from "react-router";
import CollegeStudent from "./CollegeStudent";
import CollegeDepartment from "./CollegeDepartment";
import CollegeDetails from "./CollegeDetails";
import NavBarRoutes from "./NavBarRoutes";

export default function College() {
  return (
    <div className="flex flex-col items-center space-y-4 text-2xl">
      <h1>College</h1>
      <p>Sub Navigation Links</p>

      <nav className="flex mb-10  text-3xl [&>*]:mx-4 [&>*]:hover:text-zinc-700 ">
        <NavLink to={"student"}>Student</NavLink>
        <NavLink to={"department"}>Department</NavLink>
        <NavLink to={"collegedet"}>College Details</NavLink>
        </nav>
        <Outlet />
    
     
    </div>
  );
}
