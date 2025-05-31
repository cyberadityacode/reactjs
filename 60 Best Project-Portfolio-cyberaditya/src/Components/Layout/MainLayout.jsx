import React from "react";
import NavBar from "../Navbar/NavBar";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Services from "../Services/Services";
import MyWork from "../MyWork/MyWork";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";
import Header from "./Header";
import { Outlet, useParams } from "react-router-dom";
import ReactJS from "./ReactJS";
import VanillaJS from "./VanillaJS";

export default function MainLayout() {

  return (
    <div>
      <>
        <Header />
        <Outlet />
        <Hero />
        <About />
        <Services />
        <MyWork />
        <Contact />
        <Footer />
      </>
    </div>
  );
}
