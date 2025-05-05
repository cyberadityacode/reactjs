import React from "react";
import { Route, Routes, Link, NavLink } from "react-router";
import Home from "./Home";
import About from "./About";
import NavBarRoutes from "./NavBarRoutes";

export default function NavBar() {
  return (
    <>
      <nav className="bg-gray-500 flex mb-10  text-3xl [&>*]:mx-4 [&>*]:hover:text-white ">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/about"}>About</NavLink>
        
      </nav>
      <NavBarRoutes />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes> */}
    </>
  );
}
