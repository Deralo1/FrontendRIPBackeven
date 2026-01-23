import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/index";
import { DsBreakevenRequestDTO } from "../api/Api";
//import { RootState } from "../store/store";

// ===== Используем типы напрямую из API =====
type BreakevenRequest = DsBreakevenRequestDTO;

interface BreakevenState {
  list: BreakevenRequest[];       // список заявок
  draft: BreakevenRequest | null; // одна заявка
  calcInfo: {
    app_id?: number;
    count?: number;
  };
  error: string | null;
  loading: boolean;
}

const initialState: BreakevenState = {
  list: [],
  draft: null,
  calcInfo: {},
  error: null,
  loading: false,
};

// -----------------------------
// 1. Получить список заявок
// GET /breakeven
// -----------------------------
export const fetchBreakevenList = createAsyncThunk(
  "breakeven/list",
  async (status?: string) => {
    const response = await api.breakeven.breakevenList({ status });
    // API может вернуть {data: [...]} или просто [...]
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as any).data;
    }
    return response.data;
  }
);

// -----------------------------
// 2. Получить инфо о черновике
// GET /breakeven/calc
// -----------------------------
export const fetchCalcInfo = createAsyncThunk(
  "breakeven/calc",
  async () => {
    const response = await api.breakeven.calcList();
    return response.data;
  }
);

// -----------------------------
// 3. Получить заявку по ID
// GET /breakeven/{id}
// -----------------------------
export const fetchBreakevenDetail = createAsyncThunk(
  "breakeven/detail",
  async (id: number) => {
    const response = await api.breakeven.breakevenDetail(id);
    return response.data.data;
  }
);

// -----------------------------
// 4. Обновить черновик
// PUT /breakeven/{id}
// -----------------------------
export const updateBreakevenDraft = createAsyncThunk(
  "breakeven/update",
  async ({ id, data }: { id: number; data: any }) => {
    const response = await api.breakeven.breakevenUpdate(id, data);
    return response.data;
  }
);

// -----------------------------
// 5. Удалить черновик
// DELETE /breakeven/{id}
// -----------------------------
export const deleteBreakevenDraft = createAsyncThunk(
  "breakeven/delete",
  async (id: number) => {
    await api.breakeven.breakevenDelete(id);
    return id;
  }
);

// -----------------------------
// 6. Отправить на модерацию
// PUT /breakeven/{id}/form
// -----------------------------
export const sendBreakevenToModeration = createAsyncThunk(
  "breakeven/form",
  async (id: number) => {
    const response = await api.breakeven.formUpdate(id);
    return response.data;
  }
);

// -----------------------------
// 7. Завершить / отклонить
// PUT /breakeven/{id}/process
// -----------------------------
export const processBreakeven = createAsyncThunk(
  "breakeven/process",
  async ({ id, action }: { id: number; action: string }) => {
    const response = await api.breakeven.processUpdate(id, { action });
    return response.data;
  }
);

// -----------------------------
// СЛАЙС
// -----------------------------
const breakevenSlice = createSlice({
  name: "breakeven",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreakevenList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBreakevenList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBreakevenList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка";
      })

      // CALC INFO
      .addCase(fetchCalcInfo.fulfilled, (state, action) => {
        state.calcInfo = {
          app_id: action.payload.data?.BreakevenRequestID,
          count: action.payload.data?.expense_in_BreakEvenCount,
        };
      })

      // DETAIL
      .addCase(fetchBreakevenDetail.fulfilled, (state, action) => {
        state.draft = action.payload;
      })

      // UPDATE
      .addCase(updateBreakevenDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })

      // DELETE
      .addCase(deleteBreakevenDraft.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (item) => item.BreakevenRequestID !== action.payload
        );
      })

      // SEND TO MODERATION
      .addCase(sendBreakevenToModeration.fulfilled, (state, action) => {
        state.draft = action.payload;
      })

      // PROCESS
      .addCase(processBreakeven.fulfilled, (state, action) => {
        state.draft = action.payload;
      })

      // ERRORS
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state) => {
          state.error = "Ошибка при выполнении операции";
        }
      );
  },
});

export default breakevenSlice.reducer;
