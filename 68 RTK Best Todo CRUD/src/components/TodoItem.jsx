import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, toggleTodo } from "../features/todos/todoSlice";

export default function TodoItem({ todo }) {
  const dispatch = useDispatch();
  return (
    <li style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
      {todo.title}
      <button onClick={() => dispatch(toggleTodo(todo.id))}>Toggle</button>
      <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
    </li>
  );
}
