import TodoAdd from "../components/TodoAdd";
import TodoShowTask from "../components/TodoShowTask";
import TodoTaskRemaining from "../components/TodoTaskRemaining";
import TodoListTask from "../components/TodoListTask";
import { useEffect, useState } from "react";

export default function App() {
  const [todoInput, setToDoInput] = useState("");
  const [todoList, setToDoList] = useState(() => {
    const stored = localStorage.getItem("todoList");
    return stored ? JSON.parse(stored) : [];
  });
  // const [filter, setFilter] = useState("all"); //all, active, completed
  const [filter, setFilter] = useState(()=>{
    return localStorage.getItem("todoFilter") || "all"
  });

  


  //Save TodoList Whenever it alters
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  //Save Filter Whenever it alters

  useEffect(() => {
    localStorage.setItem("todoFilter", filter);
  }, [filter]);

  return (
    <div className="flex flex-col m-5 items-center">
      <h1 className="text-3xl font-bold">Proof Of Concept (BEST TODO)</h1>

      <TodoAdd
        todoInput={todoInput}
        setToDoInput={setToDoInput}
        todoList={todoList}
        setToDoList={setToDoList}
      />
      <TodoShowTask setFilter={setFilter} />

      <TodoTaskRemaining todoList={todoList} />

      <TodoListTask
        todoList={todoList}
        setToDoList={setToDoList}
        filter={filter}
      />
    </div>
  );
}
