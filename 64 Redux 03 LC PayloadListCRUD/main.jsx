import { createRoot } from "react-dom/client";
import React, { StrictMode } from "react";
import App from "./src/App";
import './index.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
