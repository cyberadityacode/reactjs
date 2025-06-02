import React from "react";
import ReduxLCCRUD from "./components/ReduxLCCRUD";
import { Provider } from "react-redux";
import store from "../store";

export default function App() {
  return (
    <Provider store={store}>
      <ReduxLCCRUD />
    </Provider>
  );
}
