# 64 Redux 03 LC Payload List CRUD

---

## OVERALL FLOW

You're building a **CRUD app** (Create, Read, Update, Delete) using **React + Redux**. Here’s how the pieces work together:

---

## FILE FLOW & RESPONSIBILITIES

### 1. `main.jsx`

- The **entry point** of your app.
- It renders the `<App />` component inside the HTML element with `id="root"`.

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

### 2. `App.jsx`

- Wraps the main component (`ReduxLCCRUD`) with a Redux `<Provider>`, so all child components can access the global store.

```jsx
<Provider store={store}>
  <ReduxLCCRUD />
</Provider>
```

---

### 3. `store.js`

- Creates a **Redux store** using `createStore()` and combines 2 reducers:

  - `formReducer` → manages input form state
  - `itemReducer` → manages items list

```js
const rootReducer = combineReducers({
  form: formReducer,
  itemsData: itemReducer,
});

const store = createStore(rootReducer);
```

---

### 4. `formReducer.js`

- Manages:

  - `itemName`
  - `quantity`
  - `editingItemId`
  - `searchTerm`

- These are updated based on actions like `SET_ITEM_NAME`, `SET_QUANTITY`, etc.

```js
case SET_ITEM_NAME:
  return { ...state, itemName: action.payload };
```

---

### 5. `itemReducer.js`

- Manages the list of items: `items: []`
- Handles:

  - `ADD_ITEM` – adds new item
  - `DELETE_ITEM` – removes item by `id`
  - `UPDATE_ITEM` – updates item by `id`

---

### 6. `ReduxLCCRUD.jsx`

- This is your **UI component** where all the action happens.

### Key Responsibilities:

- Shows a form to add/update items.
- Dispatches actions to update `form` state.
- Submits form → decides if adding or updating.
- Shows list of items.
- Allows deleting or editing an item.
- Includes search filter.

### SIMPLE FLOW VISUALIZED

#### Step-by-step when using the app:

### Typing in Input Fields:

- When typing an item name:

  - Dispatches: `dispatch(setItemName(e.target.value))`
  - This updates the `itemName` in `form` reducer.

- When typing a quantity:

  - Dispatches: `dispatch(setQuantity(e.target.value))`
  - This updates the `quantity` in `form` reducer.

---

### Submitting the Form:

- On `form` submit:

  - If `editingItemId` is set → calls `updateItem(item)`
  - Else → calls `addItem(item)`

- Then clears the form with `dispatch(clearForm())`.

---

### Search:

- Typing in the search box dispatches `setSearchTerm`, which filters the items in real-time.

---

### Clicking Edit:

- Sets the form with values from that item using `setEditItem(item)`.

---

### Clicking Delete:

- Calls `deleteItem(item.id)` to remove the item.

---

## COMPONENT STATE CONNECTION

### `useSelector` grabs:

```js
const { itemName, quantity, editingItemId, searchTerm } = useSelector(
  (state) => state.form
);
const { items } = useSelector((state) => state.itemsData);
```

- So your component **always reflects the Redux state**.

---

## FINAL FLOW MAP (SIMPLE)

```
User Types in Input ➝ dispatch(setItemName / setQuantity)
User Clicks Add ➝ dispatch(addItem) ➝ items updated
User Clicks Edit ➝ dispatch(setEditItem) ➝ form pre-filled
User Clicks Update ➝ dispatch(updateItem) ➝ items updated
User Clicks Delete ➝ dispatch(deleteItem) ➝ item removed
User Types in Search ➝ dispatch(setSearchTerm) ➝ filtered items displayed
```

---

## WHY THIS STRUCTURE IS GOOD

- Clear separation of concerns:

  - UI logic → `ReduxLCCRUD.jsx`
  - Data logic → reducers

- Centralized state with Redux
- Scalable if you want to add more forms or actions later

---

## Redux Devtools

1. install package => bun install @redux-devtools/extension

2. store.js => import { composeWithDevTools } from "@redux-devtools/extension";

3. const store = createStore(
   rootReducer,
   composeWithDevTools
   )
