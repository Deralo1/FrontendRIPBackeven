import axios from "axios";
import {
    fetchServicesRequest,
    fetchServicesSuccess,
    fetchServicesFailure
} from "../slices/expensesSlice";

import { dest_api } from "../target_config";

// ===============================
// 1. Получить список трат
// GET /expenses
// ===============================
export const loadExpenses = async (dispatch: any, search: string = "") => {
    dispatch(fetchServicesRequest());

    try {
        const url =
            search.trim().length > 0
                ? `${dest_api}/expenses?searchbyexpensename=${encodeURIComponent(search)}`
                : `${dest_api}/expenses`;

        const res = await axios.get(url);

        dispatch(fetchServicesSuccess(res.data.data));
    } catch (err: any) {
        dispatch(fetchServicesFailure(err.message));
    }
};

// ===============================
// 2. Создать новую трату
// POST /expenses
// ===============================
export const createExpense = async (dispatch: any, body: any) => {
    try {
        await axios.post(`${dest_api}/expenses`, body, {
            withCredentials: true
        });

        // после создания — обновляем список
        loadExpenses(dispatch);
    } catch (err) {
        console.error("Ошибка создания траты:", err);
    }
};

// ===============================
// 3. Добавить трату в черновик заявки
// POST /expenses/add-to-calc/{id}
// ===============================
export const addExpenseToCalc = async (id: number) => {
    try {
        await axios.post(`${dest_api}/expenses/add-to-calc/${id}`, {}, {
            withCredentials: true
        });
    } catch (err) {
        console.error("Ошибка добавления в черновик:", err);
    }
};

// ===============================
// 4. Получить трату по ID
// GET /expenses/{id}
// ===============================
export const loadExpenseById = async (id: number) => {
    try {
        const res = await axios.get(`${dest_api}/expenses/${id}`);
        return res.data.data;
    } catch (err) {
        console.error("Ошибка загрузки траты:", err);
        return null;
    }
};

// ===============================
// 5. Обновить трату
// PUT /expenses/{id}
// ===============================
export const updateExpense = async (dispatch: any, id: number, body: any) => {
    try {
        await axios.put(`${dest_api}/expenses/${id}`, body, {
            withCredentials: true
        });

        // обновляем список
        loadExpenses(dispatch);
    } catch (err) {
        console.error("Ошибка обновления траты:", err);
    }
};

// ===============================
// 6. Удалить трату
// DELETE /expenses/{id}
// ===============================
export const deleteExpense = async (dispatch: any, id: number) => {
    try {
        await axios.delete(`${dest_api}/expenses/${id}`, {
            withCredentials: true
        });

        // обновляем список
        loadExpenses(dispatch);
    } catch (err) {
        console.error("Ошибка удаления траты:", err);
    }
};

// ===============================
// 7. Загрузить изображение траты
// POST /expenses/{id}/image
// ===============================
export const uploadExpenseImage = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        await axios.post(`${dest_api}/expenses/${id}/image`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        });
    } catch (err) {
        console.error("Ошибка загрузки изображения:", err);
    }
};
