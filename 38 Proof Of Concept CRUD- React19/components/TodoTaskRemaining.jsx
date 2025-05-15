import React from "react";

export default function TodoTaskRemaining({ todoList }) {
  const remainingTask = todoList.filter((item) => !item.isCompleted);
  console.log("remaining task ", remainingTask);
  return (
    <>
      <h2 className="italic ne text-2xl ">
        {remainingTask.length} Tasks Remaining...
      </h2>
    </>
  );
}
