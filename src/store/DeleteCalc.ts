import { createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../api/index"; // твой API-клиент

export const deleteCalc = createAsyncThunk(
  "calcinf/deleteCalc",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.breakeven.breakevenDelete(id);
      return id; // можно вернуть id, если нужно
    } catch (err: any) {
      console.error("Ошибка удаления черновика:", err);
      return rejectWithValue(err.response?.data || "Ошибка удаления");
    }
  }
);
