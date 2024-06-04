import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Homepage from "../pages/Homepage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DaftarUkm from "../pages/DaftarUkm";
import UkmPages from "../pages/UkmPages";
import Logout from "../pages/Logout";

const RoutesLink = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/ukm-ormawa" element={<DaftarUkm />} />
        <Route path="/ukm-ormawa/:name" element={<UkmPages />} />
        {/* <Route path="/ukm-ormawa/:name/:id" element={<UkmPages />} /> */}
        <Route
          path="/ukm-ormawa/:name/jadwal/:idKegiatan/edit"
          element={<UkmPages />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesLink;
