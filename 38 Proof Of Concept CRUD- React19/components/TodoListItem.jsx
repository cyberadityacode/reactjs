import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import TodoListItemCheckbox from "./TodoListItemCheckbox";
import TodoListItemButton from "./TodoListItemButton";
import TodoListItemTime from "./TodoListItemTime";
import { useState } from "react";

export default function TodoListItem({ todoList, setToDoList }) {

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTastText] = useState("");

  //Toggle Function to click checkbox
  const handleToggle = (id) => {
    const updatedList = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setToDoList(updatedList);
  };


  //Delete task function
  const handleDeleteTask = (id) => {
    console.log("Do you really wanna delete this", id);
    const updatedList = todoList.filter((todo)=> todo.id !== id)
    setToDoList(updatedList)
  };

  // Editing Start
  const handlestartEdit = (id, currentTask)=>{
    setEditTaskId(id)
    setEditTastText(currentTask)
  }

  //Save Edit
  const handleSaveEdit = (id) =>{
    const updatedList = todoList.map((todo)=>
      todo.id === id ? {...todo, task:editTaskText} : todo
    );
    setToDoList(updatedList);
    setEditTaskId(null);
    setEditTastText("");
  }
  // Cancel Edit

  const handleCancelEdit = ()=>{
    setEditTaskId(null);
    setEditTastText("");
  };


  return (
    <>
      {todoList.map((currentTodo) => (
        <li
          key={currentTodo.id}
          className="grid grid-cols-3 items-center gap-4 bg-red-200 p-3 rounded"
        >
          <TodoListItemCheckbox
            id={currentTodo.id}
            isCompleted={currentTodo.isCompleted}
            task={currentTodo.task}
            isEditing = {editTaskId === currentTodo.id}
            editTaskText ={editTaskText}
            setEditTastText = {setEditTastText}
            onToggle={handleToggle}
          />

          <TodoListItemButton
            id={currentTodo.id}
            isCompleted={currentTodo.isCompleted}
            onDeleteTask={handleDeleteTask}
            isEditing = {editTaskId ===currentTodo.id}
            onStartEdit = {()=> handlestartEdit(currentTodo.id, currentTodo.task)}
            onSaveEdit = {()=> handleSaveEdit(currentTodo.id)}
            onCancelEdit = {handleCancelEdit}
          />

          <TodoListItemTime
            dateTime={currentTodo.dateTime}
            isCompleted={currentTodo.isCompleted}
          />
        </li>
      ))}

      
    </>
  );
}
