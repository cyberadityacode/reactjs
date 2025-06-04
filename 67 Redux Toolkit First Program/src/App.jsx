import { Provider } from "react-redux";
import React from "react";
import { store } from "./app/store";
import CounterFirst from "./components/CounterFirst";

export default function App() {
  return (
    <Provider store={store}>
      <CounterFirst />
    </Provider>
  );
}
