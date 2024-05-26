// import React from "react";
import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <>
      <Navbar type="landing" />
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <h1 className="text-4xl font-semibold text-center text-slate-900">
          Placeholder Text
        </h1>
      </div>
    </>
  );
}

export default LandingPage;
