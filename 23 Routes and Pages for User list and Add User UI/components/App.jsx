import React from "react";
import UserList from "./UserList";
import UserAdd from "./UserAdd";
import { NavLink, Route, Routes } from "react-router";
import UserEdit from "./UserEdit";

export default function App() {
  return (
    <>
      <div className="text-2xl p-3 text-center [&>*]:mx-3">
        <NavLink to="/">User List</NavLink>
        <NavLink to="/add">Add User</NavLink>
      </div>

      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/add" element={<UserAdd />} />
        <Route path="/edit/:id" element={<UserEdit />} />
      </Routes>
    </>
  );
}
