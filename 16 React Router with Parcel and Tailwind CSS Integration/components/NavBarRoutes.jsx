import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./Home";
import About from "./About";
import PageNotFound from "./PageNotFound";

export default function NavBarRoutes() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* <Route path="/*" element={ <h1>Page Not Found</h1>} /> */}
      {/* <Route path="/*" element={ <PageNotFound />} /> */}
      {/* if you want to navigate to home page on mis-url */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
    </>
  );
}
