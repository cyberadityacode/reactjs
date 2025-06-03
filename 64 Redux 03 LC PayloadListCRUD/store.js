import { combineReducers, createStore } from "redux";
import formReducer from "./src/reducers/formReducer";
import itemReducer from "./src/reducers/itemReducer";
import { composeWithDevTools } from "@redux-devtools/extension";

const rootReducer = combineReducers({
  form: formReducer,
  itemsData: itemReducer,
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
