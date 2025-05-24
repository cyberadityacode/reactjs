import React from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";

export default function MovieDetails() {
  const movieData = useLoaderData();
  const navigate = useNavigate();
  console.log("movie Data ", movieData);
  const handleNavigate = ()=> navigate(-1);
  /*
        Not Required in latest version of React Router.
    const params = useParams();
    console.log(params); */
  return (
    <div className=" flex w-fit mx-auto">
      <ul className="flex flex-wrap gap-4 justify-center items-center">
        <li className="text-2xl flex gap-4 hover:scale-105 ">
          <img src={movieData.Poster} alt="" />
          <div>
            <h1>{movieData.Title}</h1>
            <p>{movieData.Year}</p>
            <p>{movieData.Actors}</p>
            <p>{movieData.Plot}</p>
            <button onClick={handleNavigate}>Go Back</button>
          </div>
        </li>
      </ul>
    </div>
  );
}
