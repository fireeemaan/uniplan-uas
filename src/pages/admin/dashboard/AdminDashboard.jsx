import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Tab, Button, Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import classNames from "classnames";
// import TableData from "../../../components/TableData";
import { FaAngleLeft } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Navbar from "../../../components/Navbar";
import toast from "react-hot-toast";
import MahasiswaPages from "../ukmormawa/MahasiswaPages";
import MahasiswaUkmPages from "../ukmormawa/MahasiswaUkmPages";
import Statistik from "../statistik/Statistik";
// import EditUKMOrmawa from "../ukmormawa/EditUKMOrmawa";

function AdminDashboard() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const id_role = userData?.userData.id_roles;

  const [activeButton, setActiveButton] = useState("statistik");
  const [apiResponse, setApiResponse] = useState({});
  const [backType, setBackType] = useState("home");
  const [isLoading, setIsLoading] = useState(true);

  const { name, idMahasiswa, idUkmMhs } = useParams();

  const navigate = useNavigate();

  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      if (!userData) {
        navigate("/login");
        console.log("Cihuy");
        toast.error("Anda harus login terlebih dahulu");
      } else {
        if (id_role !== "2") {
          navigate("/ukm-ormawa");
        } else {
          setIsLoading(false);
        }
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (name && idMahasiswa && idUkmMhs) {
      setActiveButton("mahasiswa-ukm-edit");
    } else if (name && idMahasiswa) {
      setActiveButton("mahasiswa-ukm");
    }
  }, [name, idMahasiswa]);

  const handleBack = () => {
    console.log(backType);
    if (backType === "home") {
      navigate("/homepage");
    } else if (backType === "mahasiswa") {
      navigate(`/admin/${name}`);
      setActiveButton("mahasiswa");
      setBackType("home");
    } else if (backType === "mahasiswa-ukm") {
      navigate(`/admin/${name}/${idMahasiswa}`);
      setActiveButton("mahasiswa-ukm");
    }
  };

  const handleButtonClick = (buttonName) => {
    setBackType("home");
    setActiveButton(buttonName);
    navigate(`/admin/${buttonName}`);
  };

  const buttons = (
    <div className="grid grid-cols-6 text-xl gap-4 font-bold mx-24 mt-8 w-full mb-5 bg-slate-100">
      <Button
        variant={activeButton === "statistik" ? "contained" : "outlined"}
        className="col-start-3"
        onClick={() => handleButtonClick("statistik")}
        sx={{
          borderRadius: 3,
          padding: "3px 3px",
          textTransform: "none",
        }}
      >
        Statistik
      </Button>
      <Button
        variant={activeButton === "mahasiswa" ? "contained" : "outlined"}
        className="col-start-4"
        onClick={() => handleButtonClick("mahasiswa")}
        sx={{
          borderRadius: 3,
          padding: "3px 3px",
          textTransform: "none",
        }}
      >
        Daftar Mahasiswa
      </Button>
      {/* <Button
        variant={activeButton === "peminjaman" ? "contained" : "outlined"}
        className="col-start-4"
        onClick={() => handleButtonClick("peminjaman")}
        sx={{
          borderRadius: 3,
          padding: "3px 3px",
          textTransform: "none",
        }}
      >
        Daftar Peminjaman
      </Button> */}
    </div>
  );

  return (
    <>
      {isLoading ? (
        <Backdrop
          open={isLoading}
          sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: "999" }}
        >
          <CircularProgress />
        </Backdrop>
      ) : (
        <>
          <Navbar
            type="home"
            name={userData ? userData.userData.nama : ""}
            roles={id_role}
          />
          <div className="flex flex-col mt-4 items-center justify-center w-full p-10">
            <div className="flex flex-col bg-slate-100 w-full items-center mt-10">
              <div className="w-full">
                <Button
                  className=""
                  variant="contained"
                  sx={{ padding: "4px 8px" }}
                  onClick={handleBack}
                >
                  <FaAngleLeft />
                  {backType === "home" ? <h1>Back To Home</h1> : <h1>Back</h1>}
                </Button>
              </div>

              <h1 className="text-2xl font-bold text-center">Halaman Admin</h1>
              {buttons}
              {activeButton === "mahasiswa" && (
                <div className="flex flex-col shadow-lg border border-black/10 rounded-xl mt-3">
                  <MahasiswaPages setApiResponse={setApiResponse} />
                </div>
              )}
              {activeButton === "mahasiswa-ukm" && (
                <div className="flex flex-col mt-3">
                  <MahasiswaUkmPages setBackType={setBackType} />
                </div>
              )}
              {activeButton === "statistik" && (
                <div className="flex flex-col mt-3 min-h-[27rem] h-full">
                  <Statistik />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AdminDashboard;
