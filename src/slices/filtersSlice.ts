import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store";


const filtersSlice = createSlice({
    name: "filters",
    initialState: {
        search: "",
        minPrice: "",
        maxPrice: ""
    },
    reducers: {
        setSearch(state, { payload }) {
            state.search = payload;
        },
        setMinPrice(state, { payload }) {
            state.minPrice = payload;
        },
        setMaxPrice(state, { payload }) {
            state.maxPrice = payload;
        },
        resetFilters(state) {
            state.search = "";
            state.minPrice = "";
            state.maxPrice = "";
        }
    }
});

// селекторы
export const useSearch = () =>
    useSelector((state: RootState) => state.filters.search);

export const useMinPrice = () =>
    useSelector((state: RootState) => state.filters.minPrice);

export const useMaxPrice = () =>
    useSelector((state: RootState) => state.filters.maxPrice);


// actions
export const {
    setSearch: setSearchAction,
    setMinPrice: setMinPriceAction,
    setMaxPrice: setMaxPriceAction,
    resetFilters: resetFiltersAction
} = filtersSlice.actions;

export default filtersSlice.reducer;
