export const SET_ITEM_NAME = "SET_ITEM_NAME";
export const SET_QUANTITY = "SET_QUANTITY";
export const CLEAR_FORM = "CLEAR_FORM";
export const SET_EDIT_ITEM = "SET_EDIT_ITEM";
export const SET_SEARCH_TERM = "SET_SEARCH_TERM";

export const setItemName = (value) => ({ type: SET_ITEM_NAME, payload: value });
export const setQuantity = (value) => ({ type: SET_QUANTITY, payload: value });

export const clearForm = () => ({ type: CLEAR_FORM });
export const setEditItem = (item) => ({ type: SET_EDIT_ITEM, payload: item });

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term,
});
