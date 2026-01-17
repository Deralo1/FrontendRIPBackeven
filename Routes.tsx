export const ROUTES = {
  HOME: "/",
  EXPENSES: "/Nalogimain",
};
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  EXPENSES: "Траты",
};