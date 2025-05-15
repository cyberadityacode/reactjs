
export default function TodoListItemCheckbox({id, isCompleted, task, onToggle, isEditing, editTaskText, setEditTastText, }) {
  return (
    <>
     <div className="flex items-center gap-2">
          <input id={`todo-${id}`} type="checkbox" checked={isCompleted} onChange={()=>onToggle(id)} />
          {isEditing ?(
            <input type="text" value={editTaskText} onChange={(e)=> setEditTastText(e.target.value)} className="border px-2 py-1 rounded" />
          ): (
            <label htmlFor={`todo-${id}`} className={isCompleted?"line-through":""}>{task}</label>
          )}

         
        </div>
    </>
  )
}
