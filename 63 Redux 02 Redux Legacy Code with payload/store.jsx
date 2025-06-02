import { createStore } from "redux";

// initial state
const initialState = {
  count: 0,
};
// reducer

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + action.payload };
    case "DECREMENT":
      return { count: state.count - action.payload };
    default:
      return state;
  }
};

// create store
const store = createStore(counterReducer);
export default store;
