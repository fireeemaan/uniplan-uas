import React from "react";
import { IoPerson } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { Link, redirect } from "react-router-dom";
import { useState } from "react";
import { Popover } from "@mui/material";
import Uniplan from "../assets/uniplan.png";
import { useNavigate } from "react-router-dom";

const title = "UniPlan";

const TitleName = () => {
  return (
    <div className="flex flex-row items-center gap-2">
      <img src={Uniplan} className="w-10 h-10" />
      <h1 className="text-xl font-bold text-white">{title}</h1>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = (to) => {
    navigate(to);
  };

  return (
    <div className="fixed flex z-50 top-0 items-center bg-black/10 bg-opacity-50 backdrop-blur-lg justify-between w-full px-10 py-3 shadow-md">
      <TitleName />
      <div className="flex flex-row gap-2 font-semibold">
        <button
          onClick={() => handleClick("/login")}
          className="px-4 py-2 text-blue-500 bg-white border border-blue-500 rounded-lg hover:bg-gray-100/95"
        >
          Log in
        </button>
        <button
          onClick={() => handleClick("/register")}
          className="px-4 py-2 text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600"
        >
          Register
        </button>
      </div>
    </div>
  );
};

const HomePage = ({ name, roles }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRedirect = (to) => {
    navigate(to);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {roles === "1" ? (
        <div className="fixed flex z-50 top-0 items-center justify-between w-full px-10 py-1 shadow-md bg-blue-700 bg-opacity-70 backdrop-blur-lg">
          <TitleName />
          <div className="navmenu flex flex-row gap-5 justify-center items-center"></div>
          <div className="flex flex-row items-center justify-center gap-2 font-semibold">
            <div className="flex flex-row items-center justify-center gap-3 py-2 text-lg">
              <h1 className="text-white">
                Halo, <span className="font-bold">{name}</span>!
              </h1>
              <button
                className="flex flex-row items-center justify-center gap-1"
                onClick={handleClick}
              >
                <div className="p-2 rounded-full bg-gray-200">
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
                  {/* <Link to="/profile" className="hover:bg-black/5 py-2 px-3">
                    Profile
                  </Link> */}
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
      ) : (
        <div className="fixed flex z-50 top-0 items-center justify-between w-full px-10 py-1 shadow-md bg-blue-700 bg-opacity-70 backdrop-blur-lg">
          <TitleName />
          <div className="navmenu flex flex-row gap-5 justify-center items-center">
            <button className="bg-transparent hover:bg-white/10 hover:text-slate-200 transition-all ease-in-out duration-200 py-2 px-4 rounded-lg text-white">
              <Link to="/homepage">Beranda</Link>
            </button>
            <button className="bg-transparent hover:bg-white/10 hover:text-slate-200 transition-all ease-in-out duration-200 py-2 px-4 rounded-lg text-white">
              <Link to="/ukm-ormawa">UKM/Ormawa</Link>
            </button>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 font-semibold">
            <div className="flex flex-row items-center justify-center gap-2 py-2 text-lg">
              <h1 className="text-white">
                Halo, <span className="font-bold">{name}</span>
              </h1>
              <button
                className="flex flex-row items-center justify-center gap-1"
                onClick={handleClick}
              >
                <div className="p-2 rounded-full bg-gray-200">
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
                  {/* <Link to="/profile" className="hover:bg-black/5 py-2 px-3">
                    Profile
                  </Link> */}
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
      )}
    </>
  );
};

function Navbar({ type, name, active, roles }) {
  return (
    <>
      {type === "landing" && <LandingPage />}
      {type === "home" && <HomePage name={name} roles={roles} />}
    </>
  );
}

export default Navbar;
