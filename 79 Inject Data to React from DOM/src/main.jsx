import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = document.getElementById("root");
const userId = root.dataset.userId;
const theme = root.dataset.theme;

createRoot(root).render(
  <StrictMode>
    <App userId={userId} theme={theme} />
  </StrictMode>
);
