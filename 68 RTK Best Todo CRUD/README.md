# Redux RTK Best Todo CRUD

Professional-grade Todo App using Redux Toolkit and createAsyncThunk

clean, modular, and scalable code.

## Key Best Practices We’ll Follow:

1. Modular file structure (feature-based)

2. Async handling with createAsyncThunk

3. Selectors for cleaner access to state

4. Error and loading states handled cleanly

5. Immutability & normalization where needed

6. Clean UI separation with reusable components

## Folder Structure

```
src/
├── app/
│   └── store.jsx
├── features/
│   └── todos/
│       ├── TodoList.jsx
│       ├── TodoInput.jsx
│       ├── TodoItem.jsx
│       ├── todoSlice.jsx
│       └── todoSelectors.jsx
├── App.jsx
└── main.jsx
```

## Steps

1. Install redux toolkit and axios

```
bun install install @reduxjs/toolkit
bun install react-redux
bun install axios
```

2. Create a Redux Slice with Thunk

src/features/todos/todoSlice.jsx

3. Create Selectors

src/features/todos/todoSelectors.jsx

4. Store Setup

src/app/store.jsx

5. Components
   TodoInput.jsx
   TodoItem.jsx
   TodoList.jsx

## Outcome

Your app now:

- Fetches todos from API
- Adds, toggles, deletes todos locally
- Uses Redux Toolkit best practices
- Has modular, clean structure
- Can scale easily in real projects
