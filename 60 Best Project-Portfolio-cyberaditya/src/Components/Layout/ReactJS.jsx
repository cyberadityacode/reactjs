import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "./Header";
import { fetchGitTree } from "../../API/dataAPIGitHub";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function ReactJS() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API_ReactJS = "https://api.github.com/repos/cyberadityacode/reactjs/git/trees/main"
  const { data } = useQuery({
    queryKey: ["reactjs", API_ReactJS],
    queryFn: ({queryKey})=>fetchGitTree(queryKey[1]),
    staleTime: 600000,
    placeholderData: keepPreviousData,
  });

  // removing first 2 and last  data
  const filteredData = data?.slice(2, -2) || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedItems = filteredData.slice(startIdx, endIdx);

  useEffect(() => {
    console.log("Filtered data ", filteredData);
  }, [filteredData]);

  return (
    <div className="reactjs">
      <h1>ReactJS</h1>
      <p>Developed {data?.length} POC Projects</p>
      <ul>
        {paginatedItems.map((item) => (
          <li className="github-list" key={item.sha}>
            <NavLink
              to={`https://github.com/cyberadityacode/reactjs/tree/main/${item.path}`}
              target="_blank"
            >
              {item.path}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination" style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span style={{ margin: "0 1rem" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
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
