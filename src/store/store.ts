import { combineReducers, configureStore } from "@reduxjs/toolkit";

import filtersReducer from "../slices/filtersSlice";
import expensesReducer from "../slices/expensesSlice";
import userReducer, { logoutSuccess } from "../slices/usersSlice";
import CalcinfReducer from "../slices/CalcinfSlice";
import breakevenDetailReducer from "../slices/breakevenDetailSlice";
import breakevenReducer from "../slices/breakevenSlice"
// --- 1. Комбинируем все редьюсеры ---
const appReducer = combineReducers({
  filters: filtersReducer,
  services: expensesReducer,
  user: userReducer,
  Calcinf: CalcinfReducer,
  breakevenDetail: breakevenDetailReducer,
  breakeven: breakevenReducer, // ← ДОБАВИТЬ
});

// --- 2. Глобальный RESET Redux при logout ---
const rootReducer = (state: any, action: any) => {
  if (action.type === logoutSuccess.type) {
    state = undefined; // ← Полный сброс Redux
  }

  return appReducer(state, action);
};

// --- 3. Создаём store ---
export const store = configureStore({
  reducer: rootReducer,
});

// --- 4. Типы ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
