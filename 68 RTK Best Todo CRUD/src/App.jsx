import React from "react";
import TodoItem from "./components/TodoItem";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>RTK Todo </h1>
      <TodoInput />
      <TodoList />
    </div>
  );
}
