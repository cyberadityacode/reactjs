import React from "react";
import NavBar from "./Components/Navbar/NavBar";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";
import Services from "./Components/Services/Services";
import MyWork from "./Components/MyWork/MyWork";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactJS from "./Components/Layout/ReactJS";
import MainLayout from "./Components/Layout/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import VanillaJS from "./Components/Layout/VanillaJS";
import FrameworkLayout from "./Components/Layout/FrameworkLayout";
import TailwindCSS from "./Components/Layout/TailwindCSS";
import HTMLCSS from "./Components/Layout/HTMLCSS";
import DataScience from "./Components/Layout/DataScience";
import DigitalMarketing from "./Components/Layout/DigitalMarketing";
import GitHubProfile from "./API/GitHubProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
  },
  {
    path: "/ReactJS",
    element: <ReactJS />,
  },
  {
    path: "/VanillaJS",
    element: <VanillaJS />,
  },
  {
    path: "/TailwindCSS",
    element: <TailwindCSS />,
  },
  {
    path: "/HTMLCSS",
    element: <HTMLCSS />,
  },
  {
    path: "DataScience",
    element: <DataScience />,
  },
  {
    path: "DigitalMarketing",
    element: <DigitalMarketing />,
  },
]);

export default function App() {
  const query = new QueryClient();

  return (
    <QueryClientProvider client={query}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </QueryClientProvider>
  );
}
