import { fetchTasks as fetchTasksApi } from "../../api/taskApi";
import {
  FETCH_TASK_FAILURE,
  FETCH_TASK_REQUEST,
  FETCH_TASK_SUCCESS,
} from "../types/taskTypes";

export const fetchTasks = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TASK_REQUEST });
    try {
      const tasks = await fetchTasksApi();
      dispatch({ type: FETCH_TASK_SUCCESS, payload: tasks });
    } catch (error) {
      dispatch({ type: FETCH_TASK_FAILURE, payload: error.message });
    }
  };
};
