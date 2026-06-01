import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login/Login";

import { Dashboard } from "../pages/Dashboard/Dashboard";

import { Products } from "../pages/Products/Products";

import { Finance } from "../pages/Finance/Finance";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/finance"
          element={<Finance />}
        />
      </Routes>
    </BrowserRouter>
  );
}