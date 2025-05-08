import React from "react";
import ReactDOM, { createRoot } from "react-dom/client"
import App from "./components/App";
import Experiment from "./components/Experiment";

const root = createRoot(document.querySelector('#root'))
root.render(
    <App />
)
/* root.render(
    <Experiment />
) */