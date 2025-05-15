import TodoListItem from './TodoListItem';

export default function TodoListTask({todoList, setToDoList ,filter}) {

  const getFilteredList = ()=>{
    switch(filter){
      case "active":
        return todoList.filter((item)=>!item.isCompleted)
      
      case "completed":
        return todoList.filter((item)=> item.isCompleted)
      
      default:
        return todoList
    }
  }
  const filteredList = getFilteredList()
  return (
    <ul className="w-full mt-5 space-y-2">
      
        <TodoListItem todoList={filteredList} setToDoList={setToDoList} />
        
      </ul>
  )
}
