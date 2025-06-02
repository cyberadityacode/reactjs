export const ADD_ITEM = "ADD_ITEM";
export const DELETE_ITEM = "DELETE_ITEM";
export const UPDATE_ITEM = "UPDATE_ITEM";

export const addItem = (item) => ({ type: ADD_ITEM, payload: item });
export const deleteItem = (id) => ({ type: DELETE_ITEM, payload: id });
export const updateItem = (item) => ({ type: UPDATE_ITEM, payload: item });
