import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/index';

export const getCalcinf = createAsyncThunk(
  'Calcinf/getCalcinf',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.breakeven.calcList();

      // response.data = { data: { BreakevenRequestID, expense_in_BreakEvenCount } }
      return {
        data: {
          BreakevenRequestID: response.data.data.BreakevenRequestID ?? null,
          expense_in_BreakEvenCount: response.data.data.expense_in_BreakEvenCount ?? 0
        }
      };
    } catch (e) {
      return rejectWithValue('Ошибка при получении данных черновика');
    }
  }
);
