import {combineReducers, createStore} from "redux"
import formReducer from "./src/reducers/formReducer"
import itemReducer from "./src/reducers/itemReducer"

const rootReducer = combineReducers({
    form: formReducer,
    itemsData: itemReducer,
})

const store = createStore(
    rootReducer
)

export default store;