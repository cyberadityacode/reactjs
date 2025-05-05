import React from "react";
import { Route, Routes } from "react-router";
import Home from "./Home";
import About from "./About";
import Login from "./Login";
import College from "./College";
import CollegeStudent from "./CollegeStudent";
import CollegeDepartment from "./CollegeDepartment";
import CollegeDetails from "./CollegeDetails";
import NavBar from "./NavBar";
export default function NavBarRoutes() {
  return (
    <>
      <Routes>
        {/* This will enable, navbar visibility to About Page  */}
        <Route element={<NavBar />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Route>

        
        <Route path="/college" element={<College />}>
          <Route index element={<CollegeStudent />} />
          <Route path="department" element={<CollegeDepartment />} />
          <Route path="details" element={<CollegeDetails />} />
        </Route>
      </Routes>
    </>
  );
}
