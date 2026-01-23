import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface UserProfile {
  UserId: number;
  Login: string;
  Role: string;
}

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, { payload }) {
      state.loading = false;

      state.profile = {
        UserId: payload.UserId,
        Login: payload.Login,
        Role: payload.Role
      };

      state.isAuthenticated = true;
    },

    loginFailure(state, { payload }) {
      state.loading = false;
      state.error = payload;
      state.isAuthenticated = false;
    },

    logoutSuccess(state) {
      state.profile = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // Загруженный профиль
    profileLoaded(state, { payload }) {
      state.profile = {
        UserId: payload.UserId,
        Login: payload.Login,
        Role: payload.Role
      };

      state.isAuthenticated = true;
      state.loading = false;
    },

    // Обновлённый профиль
    profileUpdated(state, { payload }) {
      state.profile = {
        UserId: payload.UserId,
        Login: payload.Login,
        Role: payload.Role
      };

      state.loading = false;
    },

    registerSuccess(state) {
      state.loading = false;
      state.error = null;
    },

    requestFailure(state, { payload }) {
      state.loading = false;
      state.error = payload;
    }
  }
});

export const useUser = () =>
  useSelector((state: RootState) => state.user);

export const {
  requestStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  profileLoaded,
  profileUpdated,
  registerSuccess,
  requestFailure
} = userSlice.actions;

export default userSlice.reducer;
