import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = document.getElementById("root");

// read and parse json content inside the root div

const rawJSON = root.textContent.trim();
const props = JSON.parse(rawJSON);

// clear the root div to prep it for rendering

root.innerHTML ="";


createRoot(root).render(
  <StrictMode>
    <App {...props} />
  </StrictMode>
);
