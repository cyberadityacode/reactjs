// src/App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./Nav";

function About() {
  return <h2>About Page</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
