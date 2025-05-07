import React from "react"
import ReactDOM, { createRoot } from "react-dom/client"
import App from "./components/App"
import HeaderComponent from "./components/HeaderComponent"

const root = createRoot(document.querySelector('#root'))
root.render(<HeaderComponent />)