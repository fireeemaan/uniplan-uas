import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNav from "../components/SidebarNav";

function DashboardPage() {
  const navigate = useNavigate();

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log(userData);
  const name = userData?.userData.nama;
  console.log(name);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <>
      <SidebarNav />
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <h1 className="text-4xl font-semibold text-center text-slate-900">
          Welcome, {name}! This is the Dashboard
        </h1>
      </div>
    </>
  );
}

export default DashboardPage;
