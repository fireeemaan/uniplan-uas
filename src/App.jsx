// import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PengurusDashboard from "./pages/pengurus/PengurusDashboard";

// import axios from "axios";
// import { useEffect } from "react";
// import { useState } from "react";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/pengurus" element={<PengurusDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
