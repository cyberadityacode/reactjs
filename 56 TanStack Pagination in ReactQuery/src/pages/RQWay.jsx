import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchData } from "../API/dataAPI";
import { NavLink } from "react-router-dom";
import { useState } from "react";
export default function RQWay() {
  const pageSize = 3; // number of items per page
  const [pageNumber, setPageNumber] = useState(0);
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () => fetchData(pageNumber),
    // gcTime: 1000, //Default is 5 min,
    staleTime: 10000, //default is 0
    placeholderData: keepPreviousData, //keep my previous data safe, append whats new because i don't like loading
  });

  const handlePaginationClick = (e) => {
    const btnType = e.target.dataset.type;
    console.dir(btnType);

    btnType === "next"
      ? setPageNumber((prev) => prev + pageSize)
      : setPageNumber((prev) => Math.max(0,prev - 3));
  };

  if (isPending) return <h1>Loading...</h1>;
  if (isError) return <h1>Something went wrong ... {error}</h1>;
  return (
    <div>
      <ul>
        {data?.map((currentData) => {
          return (
            <li key={currentData.id}>
              <NavLink to={`/rq/${currentData.id}`}>
                <p>Id: {currentData.id}</p>
                <p>Title: {currentData.title}</p>
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div className="pagination">
        <button disabled={pageNumber <= 0} data-type="prev" onClick={handlePaginationClick}>
          Prev
        </button>
        <h2>{pageNumber / pageSize + 1}</h2>
        <button disabled={!data || data.length < pageSize} data-type="next" onClick={handlePaginationClick}>
          Next
        </button>
      </div>
    </div>
  );
}
