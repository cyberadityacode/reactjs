import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, deleteItem, updateItem } from "../actions/itemActions";
import {
  clearForm,
  setEditItem,
  setItemName,
  setQuantity,
  setSearchTerm,
} from "../actions/formActions";

export default function ReduxLCCRUD() {
  const dispatch = useDispatch();
  const { itemName, quantity, editingItemId, searchTerm } = useSelector(
    (state) => state.form
  );

  const { items } = useSelector((state) => state.itemsData);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const trimmedName = itemName.trim();
    if (!trimmedName || !quantity) return;

    const item = {
      id: editingItemId || Date.now().toString(),
      itemName: trimmedName,
      quantity,
    };
    if (editingItemId) {
      dispatch(updateItem(item));
    } else {
      dispatch(addItem(item));
    }
    dispatch(clearForm());
  };
  return (
    <section>
      <h1>Legacy Code Redux CRUD</h1>

      <div className="parent-container">
        <div className="input-controls">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={itemName}
              onChange={(e) => dispatch(setItemName(e.target.value))}
              placeholder="Enter Item"
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => dispatch(setQuantity(e.target.value))}
              placeholder="Enter Quantity"
            />
            <button type="submit">
              {editingItemId ? "Update" : "Add"} Items
            </button>
          </form>
          <div className="search-items">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              placeholder="Search Item"
            />
          </div>
        </div>
        <div className="list-items">
          <ol>
            {items
              .filter(
                (item) =>
                  item.itemName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  item.quantity.toString().includes(searchTerm.toString())
              )
              .map((item) => (
                <li key={item.id}>
                  <p>
                    {item.itemName} - {item.quantity}
                  </p>
                  <button onClick={() => dispatch(deleteItem(item.id))}>
                    Delete
                  </button>
                  <button onClick={() => dispatch(setEditItem(item))}>
                    Edit
                  </button>
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
