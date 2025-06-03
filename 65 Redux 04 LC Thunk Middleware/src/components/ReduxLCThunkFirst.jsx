import React, { useState } from "react";
import { fetchTask } from "../../store";
import { useDispatch, useSelector } from "react-redux";

export default function ReduxLCThunkFirst() {
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
          <ol>
            <li>
              <p>0- Buy Banana</p>
              <button>Delete</button>
            </li>
            <li>
              <p>1- Buy Mango</p>
              <button>Delete</button>
            </li>
            <li>
              <p>2- Buy Muskmelon</p>
              <button>Delete</button>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
