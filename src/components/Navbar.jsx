import React from "react";
import { IoPerson } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

const LandingPage = () => {
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
};

const HomePage = ({ name }) => {
  return (
    <div className="fixed flex items-center justify-between w-full px-10 py-3 shadow-md bg-slate-200">
      <h1>Logo Here</h1>
      <div className="flex flex-row items-center justify-center gap-2 font-semibold">
        <div className="flex flex-row items-center justify-center gap-2 py-2 text-lg">
          <h1>
            Hello, <span className="font-bold">{name}</span>
          </h1>
          <button className="flex flex-row items-center justify-center gap-1">
            <div className="p-2 rounded-full bg-black/20">
              <IoPerson size="20px" color="grey" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

function Navbar({ type, name }) {
  return (
    <>
      {type === "landing" && <LandingPage />}
      {type === "home" && <HomePage name={name} />}
    </>
  );
}

export default Navbar;
