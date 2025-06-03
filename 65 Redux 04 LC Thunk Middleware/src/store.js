import { createStore, applyMiddleware, combineReducers } from "redux";
import {thunk} from "redux-thunk";
import { taskReducer } from "./redux/reducers/taskReducer";

import { composeWithDevTools } from "@redux-devtools/extension";

const rootReducer = combineReducers({
  tasks: taskReducer,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
