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
import { Navigate } from "react-router";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
export default function NavBarRoutes() {
  return (
    <>
      <Routes>
        {/* This will enable, navbar visibility to About Page  */}
        <Route element={<NavBar />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/users" element={<UserList />}/> */}
          
          <Route path="/users/list?" element={<UserList />}/>
         
          {/* <Route path="/users/list" element={<UserList />} /> */}

          {/* <Route path="/users/:id" element={<UserDetails />} /> */}
          
          {/* Dynamic Optional Segment */}
          <Route path="/users/:id/:username?" element={<UserDetails />} />

          <Route path="/*" element={<Navigate to="/" />} />

        </Route>

        
        <Route path="/college" element={<College />}>
          <Route index element={<CollegeStudent />} />
          <Route path="department" element={<CollegeDepartment />} />
          <Route path="details" element={<CollegeDetails />} />
          <Route path="/college/*" element={<h1>Page Not Found</h1>} />
        </Route>
      </Routes>
    </>
  );
}
