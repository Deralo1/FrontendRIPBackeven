export const ROUTES = {
  HOME: "/",
  EXPENSES: "/Nalogimain",
  LOGIN: "/login",
  PROFILE: "/profile",
  REGISTER: "/register",
  BreakevenCalc: "/BreakevenCalc",
  HISTORY: "/history",
};
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  EXPENSES: "Траты",
  LOGIN: "Авторизация",
  PROFILE: "Профиль",
  REGISTER: "Регистрация",
  BreakevenCalc: "Калькулятор",
HISTORY: "История"
};