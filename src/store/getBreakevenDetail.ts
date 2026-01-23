// store/getBreakevenDetail.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/index";

export const getBreakevenDetail = createAsyncThunk(
  "Breakeven/detail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.breakeven.breakevenDetail(id);
      return response.data; // DsBreakevenRequestDTO[]
    } catch (e) {
      return rejectWithValue("Ошибка загрузки заявки");
    }
  }
);
