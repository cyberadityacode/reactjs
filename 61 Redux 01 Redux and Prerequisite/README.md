# Redux Prerequisite

> Revise useReducer and Context API

### UseReducerSecond
Build a counter app where:

1. The count can be increased or decreased.
2. The step values (incBy and decBy) are configurable via user input.
3. Logic is cleanly separated using a reducer.
4. UI and logic are maintainable and extensible.

## Professional Explanation
1. State Management (useReducer)
Better for complex state transitions than useState.

Keeps UI logic clean by separating action-based state changes.

2. Action Types as Constants
Avoids typos and makes action management scalable.

Easy to refactor or reuse.

3. Single Input Handler
handleInputChange() is generic and handles both inputs.

Ensures that only valid integers are dispatched.

4. Single Button Handler
handleOperation() dispatches any of the INCREASE, DECREASE, RESET actions.

Keeps JSX clean.

5. User Experience
Reset button, dynamic inputs, and responsive design through basic styling.

## Added ContextAPI with custom warning message on unwrapped component