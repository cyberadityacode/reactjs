import { useEffect, useState } from "react";
import { fetchData } from "../API/dataAPI";

export default function OldWay() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getPostsData = async () => {
    try {
      const postData = await fetchData();
      setData(postData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPostsData();
  }, []);

  if(isLoading) return <h1>Loading...</h1>
  if(isError) return <h1>Something went wrong!</h1>

  return (
    <ul>
      {data?.map((currentData) => {
        return <li key={currentData.id}>{currentData.title}</li>;
      })}
    </ul>
  );
}
