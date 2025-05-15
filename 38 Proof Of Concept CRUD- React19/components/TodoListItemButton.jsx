import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
export default function TodoListItemButton({
  id,
  isCompleted,
  onDeleteTask,
  onUpdateTask,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}) {
  return (
    <div key={id} className="flex justify-center gap-2">
      {isEditing ? (
        <>
          <button type="button" className="btn-ordinary" onClick={onSaveEdit}>
            Save
          </button>
          <button type="button" className="btn-danger" onClick={onCancelEdit}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="btn-ordinary"
            onClick={() => onStartEdit(id)}
          >
            <FaEdit />
          </button>
          <button
            type="button"
            onClick={() => onDeleteTask(id)}
            className="btn-danger"
          >
            <MdDeleteForever />
          </button>
        </>
      )}
    </div>
  );
}
