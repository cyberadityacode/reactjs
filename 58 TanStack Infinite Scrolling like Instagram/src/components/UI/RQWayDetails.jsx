import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchIndividualData } from "../../API/dataAPI";

export default function RQWayDetails() {
  const params = useParams();
  console.log(params.id);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["post", params.id],
    queryFn: () => fetchIndividualData(params.id),
  });

  if (isPending) return <h1>Loading...</h1>;
  if (isError) return <h1>Something Went Wrong... {error}</h1>;

  return (
    <div>
      <h1>RQWayDetails</h1>
      <p>Details of ID: {data.id}</p>
      <p>Title: {data.title}</p>
      <p>Body: {data.body}</p>
      <NavLink to="/rq">
        <button>Go Back</button>
      </NavLink>
    </div>
  );
}
