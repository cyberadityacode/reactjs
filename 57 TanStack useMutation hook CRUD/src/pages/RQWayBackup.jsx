import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost, fetchData } from "../API/dataAPI";
import { NavLink } from "react-router-dom";
import { useState } from "react";
export default function RQWayBackup() {
  const pageSize = 3; // number of items per page
  const [pageNumber, setPageNumber] = useState(0);

  // useQuery hook to fetch data - Read Operation
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () => fetchData(pageNumber),
    // gcTime: 1000, //Default is 5 min,
    // staleTime: 10000, //default is 0
    placeholderData: keepPreviousData, //keep my previous data safe, append whats new because i don't like loading
  });

  //Deleting Data from Local Cache
  const queryClient = useQueryClient();

  // useMutation hook to Delete data - Delete Operation

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (data, id) => {
      console.log(data, id);
      //setQueryData takes 2 args, 1st is array(representing queryKey), 2nd a function which executes requisite task
      queryClient.setQueryData(["posts", pageNumber], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((post) => post.id !== id)
        
      });
    },
  });

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
          disabled={!data || data.length < pageSize}
          data-type="next"
          onClick={handlePaginationClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}
