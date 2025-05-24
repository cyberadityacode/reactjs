import React from "react";
import Home from "../src/pages/Home";
import About from "../src/pages/About";
import Contact, { contactData } from "../src/pages/Contact";
import Movie from "../src/pages/Movie";
import ErrorPage from "../src/pages/ErrorPage";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import getMovieData from "./api/GetAPIData";
import MovieDetails from "./pages/MovieDetails";
import GetMovieDetails from "./api/GetMovieDetails";
import getMovieDetails from "./api/GetMovieDetails";

export default function App() {
  // Latest Way
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />, 
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/movie",
          element: <Movie />,
          loader: getMovieData, 
          hydrateFallbackElement: <h1>loading...</h1>
        },
        {
          path: "/movie/:movieId",
          element: <MovieDetails />,
          loader: getMovieDetails,
        }
        ,
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
          action: contactData,
        },
        {
          path: "*",
          element:<ErrorPage />,
        },
        
      ],
    },
  ]);

  // Old way

  /*   const router = createBrowserRouter(
      createRoutesFromElements(
        // <Route>
        <>
          <Route path='/'  element = {<Home/>} />
          <Route path='/about' element={<About />}/>
          <Route path='/contact' element={<Contact />}/>
          <Route path='/movie' element={<Movie />}/>
          </>
        //</Route> 
      )
    ) */

  return <RouterProvider router={router} />;
}
