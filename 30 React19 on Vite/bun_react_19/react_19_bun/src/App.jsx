import React, { version } from "react";
import {NetflixSeries, Footer} from "./components/NetfilxSeries";

export const App = () => {
  return (
    // <h1>Hello, Aditya {version}</h1>

    // React.createElement('h1', null, 'Hello, Aditya')
    <>
      <NetflixSeries />
      {/* <NetflixSeries /> */}
      <Footer />
    </>
  );
};

