import { BrowserRouter, Route, Routes } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";

import { ROUTES } from "../Routes";
import { dest_root } from "./target_config";

import { HomePage } from "./pages/HomePage";
import NalogiMain from "./pages/NalogiMain";
import { ServiceDetails } from "./pages/ServiceDetails";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import BreakEvenCalcPage from "./pages/BreakevenCalc";
import HistoryPage from "./pages/HistoryPage"; // ← новая страница

function App() {
  useEffect(() => {
    invoke("create")
      .then(() => console.log("Tauri launched"))
      .catch(() => console.log("Tauri not launched"));

    return () => {
      invoke("close")
        .then(() => console.log("Tauri closed"))
        .catch(() => console.log("Tauri not closed"));
    };
  }, []);

  return (
    <BrowserRouter basename={dest_root}>
      <Routes>
        {/* Главная */}
        <Route path={ROUTES.HOME} index element={<HomePage />} />

        {/* Список услуг */}
        <Route path={ROUTES.EXPENSES} element={<NalogiMain />} />

        {/* Детали услуги */}
        <Route path={`${ROUTES.EXPENSES}/:id`} element={<ServiceDetails />} />

        {/* Авторизация */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Регистрация */}
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Профиль */}
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />

        {/* История заявок */}
        <Route path={ROUTES.HISTORY} element={<HistoryPage />} />

        {/* Калькулятор точки безубыточности */}
        <Route
          path={`${ROUTES.BreakevenCalc}/:app_id`}
          element={<BreakEvenCalcPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
