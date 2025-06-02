import React from "react";
import UseReducerFirst from "./components/useReducer01/UseReducerFirst";
import UseReducerSecond from "./components/useReducer01/UseReducerSecond";
import { BioProvider } from "./components/useContext/UseContextFirst";
import About from "./components/About";
import SomeComponent from "./components/SomeComponent";

export default function App() {
  return (
    <>
       <UseReducerFirst />
      <UseReducerSecond />
      <BioProvider>
        <About />
      <SomeComponent />
      </BioProvider>
      {/* <SomeComponent /> */}

    </>
  );
}
