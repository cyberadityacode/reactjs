import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = document.getElementById("root");

// read and parse the data

const dataScript = document.getElementById("initial-data");
let initialData = {};

if (dataScript) {
  try {
    initialData = JSON.parse(dataScript.textContent);
  } catch (e) {
    console.error("Failed to parse initial data: ", e);
  }
}

createRoot(root).render(
  <StrictMode>
    <App initialData={initialData} />
  </StrictMode>
);
