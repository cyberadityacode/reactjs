import React, { version } from "react";
import { NetflixSeries, Footer } from "./components/NetfilxSeries";
// import './components/Netflix.css'
import './components/Netflix.module.css'

export const App = () => {
  return (
    <>
      <section className="container">
        <h1 className="bg-red-500 text-5xl text-red-500">List of Best Netflix Series</h1>
        <NetflixSeries />
      </section>

      <Footer />
    </>
  );
};
