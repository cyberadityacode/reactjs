import { NavLink } from "react-router-dom";

import React from "react";

export default function Header() {

  const getNavLinkStyle =({isActive})=>( isActive?"underline":"");
  
  return (
    <>
      <div className="flex bg-white ">
        <div className="text-4xl flex items-center justify-center">
          <a href="">
            <h1>Logo</h1>
          </a>
        </div>
        <nav className="flex h-20 text-2xl w-full   justify-end-safe items-center">
          <ul className="flex gap-3 mx-7 [&>li>a]:p-4 hover:[&>li:hover>a]:bg-gray-300">
            <li>
              <NavLink to="/" className={({isActive})=> isActive? "underline":""}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/movie" className={getNavLinkStyle}>Movie</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
