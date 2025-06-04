# 67 Redux Toolkit (RTK)

Redux Toolkit(RTK) is an official toolset from the redux team that makes working with Redux easier and less time consuming.

instead of doing everything manually - like creating actions, reducers and managing state immutability - RTK gives you built-in functions that handle most of that work for you.

## Why RTK?

- **Less Boilerplate** - In traditional redux, you write a lot of repetitive code just to get basic things done. RTK cuts down on all that extra code and gives you a cleaner and simple way to manage state.

- **Simpler Setup** - It automatically sets up your store, add some middleware for things like async actions, and even connects you to Redux DevTools for debugging without extra configuration.

- **Built-in Async Handling** - if you've ever used Redux Thunk for async tasks like fetch data from an API, RTK has a built-in feature called createAsyncThunk that makes even easier to handle async actions.

## Advantages

- **Less BoilerPlate Code**
Normally with Redux, you need to write action types, action creator and reducers separately.
With RTK `createSlice`, you can handle all of this in one place, in fewer lines of code.

- **Easier to Work with State**
RTK uses a tool called `Immer`(library) under the hood, which allows you to write state changes like you are mutating the state directly. But it still follows Redux's rule of immutability (not changing the original state).

- **Better Async Logic**
Handling async tasks, like fetching data. Is much simpler with RTK `createAsyncThunk`. It automatically handles loading, success, error state, so you don't have to write all that manually.

- **Great Default**
RTK sets up ReduxDevTools, middleware, and other configuration for you, so you can focus on building your app.

# Steps to Create First RTK App

1. Install redux toolkit
```
bun install install @reduxjs/toolkit
bun install react-redux
```