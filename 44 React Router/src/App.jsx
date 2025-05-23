import React from "react";
import Home from "../src/pages/Home";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import Movie from "../src/pages/Movie";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

export default function App() {
  // Latest Way
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/movie",
          element: <Movie />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
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
