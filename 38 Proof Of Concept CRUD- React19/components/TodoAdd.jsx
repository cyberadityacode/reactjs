
export default function TodoAdd({todoInput, setToDoInput, todoList, setToDoList}) {

  const handleTodoInputSubmit =(event)=>{
    event.preventDefault()

    const newTodo = {
      id: Date.now(),
      task: todoInput,
      isCompleted: false,
      dateTime : new Date().toLocaleString()
    }
    setToDoList([...todoList, newTodo])
    setToDoInput("")



    console.log("form submitted ", newTodo);
    
  }

  const listAllTodo = ()=>{
    console.log("Current todo list ", todoList);
  }

  return (
    <>
    <form onSubmit={handleTodoInputSubmit} className="mt-5">
        <h2>
          <label className="italic" htmlFor="todo-add-task">
            Write down your task
          </label>
        </h2>
        <input
          className="border rounded p2 "
          type="text"
          autoComplete="off"
          name="text"
          id="todo-add-task"
          value={todoInput}
          onChange={(e)=> setToDoInput(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={!todoInput.trim()}>
          Add
        </button>
      </form>

      {/* <button type='button' onClick={listAllTodo}>List ALL TODOSS</button> */}
      </>
  )
}
