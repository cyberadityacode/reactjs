import { CLEAR_FORM, SET_EDIT_ITEM, SET_ITEM_NAME, SET_QUANTITY, SET_SEARCH_TERM } from "../actions/formActions"

const initialState = {
    itemName:"",
    quantity:"",
    editingItemId: null,
    searchTerm: "",
}

const formReducer = (state= initialState, action)=>{
    switch(action.type){
        case SET_ITEM_NAME:
            return {...state, itemName: action.payload};
        case SET_QUANTITY:
            return {...state, quantity:action.payload};
        case SET_EDIT_ITEM:
            return {...state,
                itemName: action.payload.itemName,
                quantity: action.payload.quantity,
                editingItemId: action.payload.id,
            }
        case CLEAR_FORM:
            return initialState;
        case SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
            }
        default:
            return state;
    }
}

export default formReducer;