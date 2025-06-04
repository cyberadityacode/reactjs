import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectError,
  selectLoading,
  selectTodos,
} from "../features/todos/todoSelectors";
import { useEffect } from "react";
import { fetchTodos } from "../features/todos/todoSlice";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error}</p>;

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
