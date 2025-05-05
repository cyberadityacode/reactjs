import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./Home";
import About from "./About";
import PageNotFound from "./PageNotFound";
import College from "./College";
import CollegeStudent from "./CollegeStudent";
import CollegeDepartment from "./CollegeDepartment";
import CollegeDetails from "./CollegeDetails";

export default function NavBarRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/college" element={<College />}>
          <Route path="/college/student" element={<CollegeStudent />} />
          <Route path="/college/department" element={<CollegeDepartment />} />
          <Route path="/college/collegedet" element={<CollegeDetails />} />
        </Route>

        {/* <Route path="/*" element={ <h1>Page Not Found</h1>} /> */}
        <Route path="/*" element={<PageNotFound />} />
        {/* if you want to navigate to home page on mis-url */}
        {/* <Route path="/*" element={<Navigate to="/" />} /> */}
      </Routes>
    </>
  );
}
