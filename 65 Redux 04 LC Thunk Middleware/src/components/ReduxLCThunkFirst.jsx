import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/actions/taskActions";

export default function ReduxLCThunkFirst() {
  const dispatch = useDispatch();

  const { loading, tasks, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <section>
      <h1>Redux Legacy Code Thunk First</h1>
      <div className="parent-container">
        <form className="form-controls">
          <input type="text" placeholder="Add a new Task" />
          <button type="submit">Add Task</button>
        </form>
        <div className="api-operations">
          <button>Fetch Data</button>
        </div>
        <div className="list-task">
          {loading && <li>Loading...</li>}
          {error && <li>Some Error {error}...</li>}
          <ol>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
