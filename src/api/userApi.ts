import axios from "axios";
import {
  requestStart,
  loginSuccess,
  logoutSuccess,
  profileLoaded,
  profileUpdated,
  registerSuccess,
  requestFailure
} from "../slices/usersSlice";

import { dest_api } from "../target_config";

// ===============================
// 1. LOGIN — POST /user/login
// ===============================
export const loginUser = async (dispatch: any, data: any) => {
  dispatch(requestStart());

  try {
    // 1. Логинимся
    const res = await axios.post(`${dest_api}/user/login`, data, {
      withCredentials: true
    });

    // 2. Авторизация успешна → ставим флаг
    dispatch(loginSuccess(res.data));

    // 3. СРАЗУ загружаем профиль
    const profileRes = await axios.get(`${dest_api}/user/profile`, {
      withCredentials: true
    });

    dispatch(profileLoaded(profileRes.data.data)); // ← ВАЖНО

  } catch (err) {
    dispatch(requestFailure("Ошибка авторизации"));
  }
};




// ===============================
// 2. LOGOUT — POST /user/logout
// ===============================
export const logoutUser = async (dispatch: any) => {
  dispatch(requestStart());

  try {
    await axios.post(`${dest_api}/user/logout`, {}, { withCredentials: true });
    dispatch(logoutSuccess());
  } catch (err) {
    dispatch(requestFailure("Ошибка выхода из системы"));
  }
};

// ===============================
// 3. PROFILE — GET /user/profile
// ===============================
export const loadUserProfile = async (dispatch: any) => {
  dispatch(requestStart());

  try {
    const res = await axios.get(`${dest_api}/user/profile`, {
      withCredentials: true
    });

    console.log("PROFILE API RESPONSE:", res.data);

    dispatch(profileLoaded(res.data.data)); // <-- ВАЖНО
  } catch (err) {
    dispatch(requestFailure("Не удалось загрузить профиль"));
  }
};

export const updateUserProfile = async (dispatch: any, data: any) => {
  dispatch(requestStart());

  try {
    const res = await axios.put(`${dest_api}/user/profile`, data, {
      withCredentials: true
    });

    console.log("UPDATE PROFILE RESPONSE:", res.data);

    dispatch(profileUpdated(res.data.data)); // <-- ВАЖНО
  } catch (err) {
    dispatch(requestFailure("Ошибка обновления профиля"));
  }
};


// ===============================
// 5. REGISTER — POST /user/register
// ===============================
export const registerUser = async (dispatch: any, data: any) => {
  dispatch(requestStart());

  try {
    await axios.post(`${dest_api}/user/register`, data);
    dispatch(registerSuccess());
  } catch (err) {
    dispatch(requestFailure("Ошибка регистрации"));
  }
};
