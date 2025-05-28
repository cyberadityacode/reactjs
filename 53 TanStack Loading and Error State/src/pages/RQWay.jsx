import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../API/dataAPI";
export default function RQWay() {


  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchData,
  });

  if(isPending) return <h1>Loading...</h1>
  if(isError) return <h1>Something went wrong ... {error}</h1>
  return (
    <ul>
      {data?.map((currentData) => {
        return <li key={currentData.id}>{currentData.title}</li>;
      })}
    </ul>
  );
}
