import { Api } from './Api';
import { dest_api } from '../target_config'; // путь подстрой под свой проект

// Если dest_api уже содержит /api, то не добавляем его снова
const baseURL = dest_api.includes("/api") ? dest_api : dest_api + "/api/v1";

export const api = new Api({
  baseURL: baseURL,   // ← ВАЖНО: твой динамический адрес API
  secure: true,
});
