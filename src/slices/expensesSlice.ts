import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { Service } from "../types/types";

interface ExpensesState {
  list: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  list: [],
  loading: false,
  error: null
};

const expensesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    fetchServicesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchServicesSuccess(state, { payload }) {
      state.loading = false;
      state.list = payload as Service[];
    },
    fetchServicesFailure(state, { payload }) {
      state.loading = false;
      state.error = payload as string;
    }
  }
});

export const useServices = () =>
  useSelector((state: RootState) => state.services.list);

export const useServicesLoading = () =>
  useSelector((state: RootState) => state.services.loading);

export const {
  fetchServicesRequest,
  fetchServicesSuccess,
  fetchServicesFailure
} = expensesSlice.actions;

export default expensesSlice.reducer;
