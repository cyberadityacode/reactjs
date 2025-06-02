import React, { useReducer } from "react";

const initialState = {
  count: 0,
  incBy: 1,
  decBy: 1,
};

const ActionTypes = {
  INCREASE: "INCREASE",
  DECREASE: "DECREASE",
  SET_INC_BY: "SET_INC_BY",
  SET_DEC_BY: "SET_DEC_BY",
  RESET: "RESET",
};

const reducer = (state, action) => {
  console.log("Reducer Received State and Action:", state, action);
  switch (action.type) {
    case ActionTypes.INCREASE:
      return {
        ...state,
        count: state.count + state.incBy,
      };
    case ActionTypes.DECREASE:
      return {
        ...state,
        count: state.count - state.decBy,
      };
    case ActionTypes.SET_INC_BY:
      return {
        ...state,
        incBy: action.payload,
      };
    case ActionTypes.SET_DEC_BY:
      return {
        ...state,
        decBy: action.payload,
      };
    case ActionTypes.RESET:
      return initialState;

    default:
      console.warn("Unhandled Action Type:", action.type);
      return state;
  }
};
export default function UseReducerSecond() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      dispatch({ type, payload: value });
    }
  };
  const handleOperation = (type) => {
    console.log("Button Clicked", type);
    dispatch({ type });
  };

  return (
    <div>
      <h2>Advanced Counter</h2>
      <div>Current Count: {state.count}</div>
      <div>
        <label>
          Increase By:
          <input
            type="number"
            value={state.incBy}
            onChange={(e) => handleInputChange(e, ActionTypes.SET_INC_BY)}
          />
        </label>

        <label>
          Decrease By:
          <input
            type="number"
            value={state.decBy}
            onChange={(e) => handleInputChange(e, ActionTypes.SET_DEC_BY)}
          />
        </label>
      </div>
      <div>
        <button onClick={() => handleOperation(ActionTypes.INCREASE)}>
          Increase
        </button>
        <button onClick={() => handleOperation(ActionTypes.DECREASE)}>
          Decrease
        </button>
        <button onClick={() => handleOperation(ActionTypes.RESET)}>
          Reset
        </button>
      </div>
    </div>
  );
}
