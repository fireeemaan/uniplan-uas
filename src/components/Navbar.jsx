import React from "react";

function Navbar() {
  return (
    <div className="fixed flex items-center justify-between w-full px-10 py-3 shadow-md bg-slate-200">
      <h1>Logo Here</h1>
      <div className="flex flex-row gap-2 font-semibold">
        <a
          href="/login"
          className="px-4 py-2 text-blue-500 bg-white border border-blue-500 rounded-lg hover:bg-gray-100/95"
        >
          Log in
        </a>
        <a
          href="/register"
          className="px-4 py-2 text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600"
        >
          Register
        </a>
      </div>
    </div>
  );
}

export default Navbar;
