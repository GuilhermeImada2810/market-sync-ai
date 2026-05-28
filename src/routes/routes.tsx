import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from "../pages/Dashboard/Dashboard";

import { Login } from "../pages/Login/Login";

import { Products } from "../pages/Products/Products";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}