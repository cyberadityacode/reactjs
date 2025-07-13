import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store.js";
import "./index.css";
import App from "./App.jsx";
import AnotherComponent from "./components/AnotherComponent.jsx";

createRoot(document.getElementById("root1")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
createRoot(document.getElementById("root2")).render(
  <StrictMode>
    <Provider store={store}>
      <AnotherComponent />
    </Provider>
  </StrictMode>
);
