import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "./Header";
import { fetchGitTree } from "../../API/dataAPIGitHub";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import datascience from "../../assets/datascience.json";
export default function HTMLCSS() {
  const navigate = useNavigate();

 


  return (
    <div className="reactjs">
      <h1>HTML & CSS</h1>
      <p>Developed Projects</p>
      <ul>
        {datascience.map((item) => (
          <li className="github-list" key={item.sr_no}>
            <NavLink
              to={`https://github.com/cyberadityacode/`}
              target="_blank"
            >
             {item.sr_no}.  {item.title}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination" style={{ marginTop: "1rem" }}>
        <button
         
        >
          Previous
        </button>

        <span style={{ margin: "0 1rem" }}>
          Page 
        </span>

        <button
         
        >
          Next
        </button>
      </div>
      <button className="go-back" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}
