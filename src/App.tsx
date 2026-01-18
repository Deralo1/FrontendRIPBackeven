import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ServiceDetails } from "./pages/ServiceDetails";
import { ROUTES } from "../Routes";
import { HomePage } from "./pages/HomePage";
import NalogiMain from "./pages/NalogiMain";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { dest_root } from "./target_config";

function App() {
    useEffect(()=>{
    invoke('tauri', {cmd:'create'})
      .then(() =>{console.log("Tauri launched")})
      .catch(() =>{console.log("Tauri not launched")})
    return () =>{
      invoke('tauri', {cmd:'close'})
        .then(() =>{console.log("Tauri launched")})
        .catch(() =>{console.log("Tauri not launched")})
    }
  }, [])

  return (
    <BrowserRouter basename={dest_root}>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.EXPENSES} element={<NalogiMain />} />
        <Route path={`${ROUTES.EXPENSES}/:id`} element={<ServiceDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;