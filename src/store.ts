import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./slices/filtersSlice.ts";

const rootReducer = combineReducers({
    filters: filtersReducer
});

export const store = configureStore({
    reducer: rootReducer
});

// тип состояния
export type RootState = ReturnType<typeof store.getState>;

// тип dispatch
export type AppDispatch = typeof store.dispatch;

export default store;
