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

1. Create an api directory within src-> api-> taskApi.js
   It will play an instrumental role in fetching data from API, fetchTasks is our sherpa function.

2. Create a dir inside src -> redux with sub directories - actions, reducers, types

3. create taskTypes.js -> for future typescript migration or scalling.

4. create taskActions.js inside actions to pre define the set of actions our dispatcher will send. -> they act as our sniper agent.

5. create taskReducer.js inside reducers to return new state based on actions.

6. create your redux store-> store.js in your root directory. Within your createStore argument pass rootReducer and applyMiddleware function, and within your applyMiddleware pass the thunk.

7. The store variable is the arc reactor of tony stark. (Your app), make sure to place in your App component from where you want to locate your Provider Component.

8. Create component ReduxLCThunkFirst.jsx. Within your component function. create a variable for dispatch with useDispatch() // it is the delivery agent of our actions.
destructure the variable your made loading,tasks,error which you will pull from useSelector((state)=> state.tasks);
useSelector is our portal to access galaxy of our state (kind of warmhole) 

9. Create useEffect hook to call dispatch function and within its argument pass fetchTask function which you defined in your redux/actions/taskActions.jsx

