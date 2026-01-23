import { createSlice } from "@reduxjs/toolkit";

interface BreakevenRequest {
  RequestID: number;
  Title: string;
  Status: string;
  CreatedAt: string;
}

interface BreakevenState {
  list: BreakevenRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: BreakevenState = {
  list: [],
  loading: false,
  error: null
};

const breakevenSlice = createSlice({
  name: "breakeven",
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },
    breakevenLoaded(state, { payload }) {
      state.list = payload.data;
      state.loading = false;
    },
    requestFailure(state, { payload }) {
      state.loading = false;
      state.error = payload.data;
    }
  }
});

export const { requestStart, breakevenLoaded, requestFailure } = breakevenSlice.actions;

export const useBreakevenList = (state: any) => state.breakeven.list;
export const useBreakevenLoading = (state: any) => state.breakeven.loading;

export default breakevenSlice.reducer;
