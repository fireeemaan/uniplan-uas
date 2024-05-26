import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Homepage from "../pages/Homepage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PengurusDashboard from "../pages/pengurus/PengurusDashboard";
import DaftarUkm from "../pages/DaftarUkm";

const RoutesLink = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/pengurus" element={<PengurusDashboard />} />
        <Route path="/ukm-ormawa" element={<DaftarUkm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesLink;
