import React from "react";

export default function TodoShowTask({setFilter }) {
  return (
    <div className="btn-group">
      <button className="btn-ordinary" type="button" onClick={()=> setFilter("all") } >
        Show All Tasks
      </button>
      <button className="btn-ordinary" type="button" onClick={()=> setFilter("active")} >
        Show Active Tasks
      </button>
      <button className="btn-ordinary" type="button" onClick={()=> setFilter("completed")}>
        Show Completed Tasks
      </button>
    </div>
  );
}
