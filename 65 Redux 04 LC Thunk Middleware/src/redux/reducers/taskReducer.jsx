import {
  FETCH_TASK_FAILURE,
  FETCH_TASK_REQUEST,
  FETCH_TASK_SUCCESS,
} from "../types/taskTypes";

const initialState = {
  loading: false,
  tasks: [],
  error: null,
};

export const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASK_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_TASK_SUCCESS:
      return { ...state, loading: false, tasks: action.payload };
    case FETCH_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
