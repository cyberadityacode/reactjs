import { useLoaderData } from "react-router-dom";
import MovieCard from "../components/MovieCard";

export default function Movie() {
  const movieData = useLoaderData();
  console.log(movieData.Search);

  return (
    /*   <div className=" bg-red-300 flex w-fit mx-auto">
      <img src={movieData.Poster} alt="" className="w-80 h-80" />
      <div className="flex flex-col gap-2 m-3 font-semibold w-70">
        <h1>Movie Name: {movieData.Title}</h1>
        <p>Year: {movieData.Year}</p>
        <p>Actors: {movieData.Actors}</p>
        <p>Director: {movieData.Director}</p>
        <p>Plot: {movieData.Plot}</p>
      </div>
    </div> */
    <>
      <div className=" flex w-fit mx-auto">
        <ul className="flex flex-wrap gap-4 justify-center items-center">
          {movieData.Search.map((currentMovie) => (
            <MovieCard
              key={movieData.Search.imdbID}
              currentMovie={currentMovie}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
