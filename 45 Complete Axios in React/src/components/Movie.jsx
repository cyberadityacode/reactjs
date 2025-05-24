
import { useEffect, useState } from "react";
import Card from "./Card";
import { getMovie } from "../services/GetServices";
export default function Movie() {
  const [data, setData] = useState([]);

  const getMovieData = async () => {
    try {
      const res = await getMovie();
      if (res.status === 200) {
        console.log(res.data.Search);
        setData(res.data.Search);
      }
    } catch (Error) {
        // Axios Offers better Error handling
      console.error(Error);
      console.error(Error.response.status);
      console.error(Error.message);
      console.error(Error.response.data);
      
    }
  };

  useEffect(() => {
    getMovieData();
  }, []);

  return (
    <ul className="flex flex-wrap gap-3">
      {data &&
        data.map((currentElement) => {
          return <Card key={currentElement.imdbID} data ={currentElement}/>;
        })}
    </ul>
  );
}
