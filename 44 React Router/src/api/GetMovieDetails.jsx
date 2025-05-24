import React from "react";
import { useLoaderData } from "react-router";

export default async function getMovieDetails({params}) {

    console.log('i got', params);
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${params.movieId}&apikey=${
        import.meta.env.VITE_API_KEY
      }`
    );
    const data = response.json();
    console.log('dataaaaa', data);

    return data;
  } catch (error) {
    console.error(error);
  }
}
