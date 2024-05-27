import React from "react";
import { IoPerson } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Popover } from "@mui/material";

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
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="fixed flex items-center justify-between w-full px-10 py-1 shadow-md bg-slate-200">
      <h1>Logo Here</h1>
      <div className="navmenu flex flex-row gap-5 justify-center items-center">
        <Link to="/homepage">Beranda</Link>
        <Link to="/ukm-ormawa">UKM/Ormawa</Link>
        <Link></Link>
      </div>
      <div className="flex flex-row items-center justify-center gap-2 font-semibold">
        <div className="flex flex-row items-center justify-center gap-2 py-2 text-lg">
          <h1>
            Hello, <span className="font-bold">{name}</span>
          </h1>
          <button
            className="flex flex-row items-center justify-center gap-1"
            onClick={handleClick}
          >
            <div className="p-2 rounded-full bg-black/20">
              <IoPerson size="20px" color="grey" />
            </div>
          </button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <div className="flex flex-col text-left">
              <Link to="/profile" className="hover:bg-black/5 py-2 px-3">
                Profile
              </Link>
              <Link
                to="/logout"
                className="text-red-500 hover:bg-black/5 py-2 px-3"
              >
                Logout
              </Link>
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

function Navbar({ type, name, active }) {
  return (
    <>
      {type === "landing" && <LandingPage />}
      {type === "home" && <HomePage name={name} />}
    </>
  );
}

export default Navbar;
