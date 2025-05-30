/* 
It contain complete Part till delete functionality with pagination issue resolved.

*/

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost, fetchData } from "../API/dataAPI";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
export default function RQWayBackup2() {
  const pageSize = 3; // number of items per page
  const [pageNumber, setPageNumber] = useState(0);
  const queryClient = useQueryClient();

  //Fetch Current Page

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () => fetchData(pageNumber),
    placeholderData: keepPreviousData,
  });

  // Prefetch & Check if next page exists

  const { data: nextPageData } = useQuery({
    queryKey: ["posts", pageNumber + pageSize],
    queryFn: () => fetchData(pageNumber + pageSize),
    enabled: !!data,
    placeholderData: [],
  });

  // Prefetching in background for smoother UX

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["posts", pageNumber + pageSize],
      queryFn: () => fetchData(pageNumber + pageSize),
    });
  }, [pageNumber, queryClient]);

  // Delete Mutation

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (data, id) => {
      console.log(data, id);
      queryClient.setQueryData(["posts", pageNumber], (oldData) => {
        if (!oldData) return [];

        // remove the deleted post
        const filteredData = oldData.filter((post) => post.id !== id);

        // try to top up from the next page
        const nextPage =
          queryClient.getQueryData(["posts", pageNumber + pageSize]) || [];
        const needed = pageSize - filteredData.length;
        const topUp = nextPage.slice(0, needed);

        // Optional - remove topped-up posts from the next page cache(to avoid duplication)
        queryClient.setQueryData(["posts", pageNumber + pageSize], (nextOld) =>
          nextOld ? nextOld.slice(needed) : []
        );
        const updatedPageData = [...filteredData, ...topUp];

        // if the current page is now empty, navigate to previous page
        if (updatedPageData.length === 0 && pageNumber > 0) {
          setPageNumber((prev) => Math.max(0, prev - pageSize));
        }

        return updatedPageData;
      });
    },
  });

  // Handlers
  const handleDeletePost = (e) => {
    const deleteId = Number(e.target.dataset.id);
    console.dir(deleteId);
    deleteMutation.mutate(deleteId); //important!! to call mutation function
  };

  const handlePaginationClick = (e) => {
    const btnType = e.target.dataset.type;
    console.dir(btnType);

    btnType === "next"
      ? setPageNumber((prev) => prev + pageSize)
      : setPageNumber((prev) => Math.max(0, prev - 3));
  };

  // Renders
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
              <button data-id={currentData.id} onClick={handleDeletePost}>
                Delete Post
              </button>
            </li>
          );
        })}
      </ul>
      <div className="pagination">
        <button
          disabled={pageNumber <= 0}
          data-type="prev"
          onClick={handlePaginationClick}
        >
          Prev
        </button>
        <h2>{pageNumber / pageSize + 1}</h2>
        <button
          disabled={!nextPageData || nextPageData.length === 0}
          data-type="next"
          onClick={handlePaginationClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}
