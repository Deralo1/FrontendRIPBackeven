import { createSlice } from '@reduxjs/toolkit';
import { getCalcinf } from '../store/getCalcinf';

interface CalcinfState {
  app_id: number | null;
  count: number;
}

const initialState: CalcinfState = {
  app_id: null,
  count: 0,
};

const CalcinfSlice = createSlice({
  name: 'Calcinf',
  initialState,
  reducers: {
    setAppId: (state, action) => {
      state.app_id = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    resetCalcinf: (state) => {
      state.app_id = null;
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCalcinf.fulfilled, (state, action) => {
      console.log("payload:", action.payload);

      state.app_id = action.payload.data.BreakevenRequestID;
      state.count = action.payload.data.expense_in_BreakEvenCount;

      console.log("updated:", state);
    });
  }
});

export const { setAppId, setCount, resetCalcinf } = CalcinfSlice.actions;
export default CalcinfSlice.reducer;
