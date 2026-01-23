// slices/breakevenDetailSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getBreakevenDetail } from "../store/getBreakevenDetail";

interface BreakevenDetailState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: BreakevenDetailState = {
  data: null,
  loading: false,
  error: null,
};

const breakevenDetailSlice = createSlice({
  name: "breakevenDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBreakevenDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBreakevenDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getBreakevenDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default breakevenDetailSlice.reducer;
