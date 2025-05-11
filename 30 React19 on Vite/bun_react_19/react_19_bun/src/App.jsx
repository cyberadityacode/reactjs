import React, { version } from "react";
import { NetflixSeries, Footer } from "./components/NetfilxSeries";
import './components/Netflix.css'
export const App = () => {
  return (
    <>
      <section className="container">
        <h1 className="card-heading">List of Best Netflix Series</h1>
        <NetflixSeries />
      </section>

      <Footer />
    </>
  );
};
