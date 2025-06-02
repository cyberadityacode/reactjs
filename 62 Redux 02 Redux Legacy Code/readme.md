# 62 Redux 02 – Redux Legacy Code

1. Install `redux` and `react-redux` packages.

2. Create Redux logic in the root folder inside a file named `store.jsx`.

3. Example setup:

```jsx
const initialState = {
  count: 0,
};

const counterReducer = (state = initialState, action) => {
  // Logic to update state based on the dispatched action.type
};

const store = createStore(counterReducer);
```

4. Wrap your `<App />` component with the `<Provider>` component inside `main.jsx`.
   Make sure to import the `store` from `"./store.jsx"`:

```jsx
<Provider store={store}>
  <StrictMode>
    <App />
  </StrictMode>
</Provider>
```

5. In your `App` component:

```jsx
const count = useSelector((state) => state.count); // useSelector is used to access the current state
const dispatch = useDispatch(); // useDispatch is used to send actions
```

6. The role of `dispatch` is to send an action to the reducer function, which then updates the state accordingly.

7. The reducer function returns the updated state, which is accessed via `useSelector` to reflect dynamic changes in the UI.
