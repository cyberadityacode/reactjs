# 65 Redux 04 Legacy Code Thunk Middleware

## CRUD with React Redux (Without RTK) using Thunk as Middleware

Best and Professional TODO App to add, list, update and Delete Task

## Structure

Separation of Concern:

- **API layer**: All network logic in one place.
- **Actions layer**: Only responsible for dispatching.
- **Reducer**: Handles state changes.
- **Constants**: Prevents typos and makes action types reusable.

- **Types (optional)**: Easy to scale with TypeScript later.
- **UI**: Clean React component.

## Folder Structure
```
/src
  ├── /api
  │     └── taskApi.js
  ├── /redux
  │     ├── /actions
  │     │     └── taskActions.js
  │     ├── /reducers
  │     │     └── taskReducer.js
  │     └── /types
  │           └── taskTypes.js
  ├── /components
  │     └── TaskList.js
  ├── store.js
  └── index.js
```

### Steps

1. Create an api directory within src-> taskApi.js
It will play an instrumental role in fetching data from API, fetchTasks is our sherpa function.


