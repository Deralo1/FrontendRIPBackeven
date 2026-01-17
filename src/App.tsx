import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ServiceDetails } from "./pages/ServiceDetails";
import { ROUTES } from "../Routes";
import { HomePage } from "./pages/HomePage";
import NalogiMain from "./pages/NalogiMain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.EXPENSES} element={<NalogiMain />} />
        <Route path={`${ROUTES.EXPENSES}/:id`} element={<ServiceDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;