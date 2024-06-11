import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Tab, Button } from "@mui/material";
import axios from "axios";
import classNames from "classnames";
import TableData from "../../components/TableData";
import { FaAngleLeft } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";
import MahasiswaPages from "./MahasiswaPages";
import MahasiswaUkmPages from "./MahasiswaUkmPages";
import EditJabatan from "./EditJabatan";

const userData = JSON.parse(sessionStorage.getItem("userData"));
const id_role = userData?.userData.id_roles;

function AdminDashboard() {
  const [activeButton, setActiveButton] = useState("mahasiswa");
  const [apiResponse, setApiResponse] = useState({});

  const { name, idMahasiswa, idUkmMhs } = useParams();

  useEffect(() => {
    if (name && idMahasiswa && idUkmMhs) {
      setActiveButton("mahasiswa-ukm-edit");
    } else if (name && idMahasiswa) {
      setActiveButton("mahasiswa-ukm");
    }
  }, [name, idMahasiswa]);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/homepage");
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    navigate(`/admin/${buttonName}`);
  };

  const buttons = (
    <div className="grid grid-cols-6 text-xl gap-4 font-bold mx-24 mt-8 w-full mb-5 bg-slate-100">
      <Button
        variant={activeButton === "mahasiswa" ? "contained" : "outlined"}
        className="col-start-3"
        onClick={() => handleButtonClick("mahasiswa")}
        sx={{
          borderRadius: 3,
          padding: "3px 3px",
          textTransform: "none",
        }}
      >
        Daftar Mahasiswa
      </Button>
      <Button
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
      </Button>
    </div>
  );

  return (
    <>
      <Navbar type="home" name={userData.userData.nama} roles={id_role} />
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
              <h1>Back</h1>
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
              <MahasiswaUkmPages setApiResponse={setApiResponse} />
            </div>
          )}
          {/* {activeButton === "mahasiswa-ukm-edit" && (
            <div className="flex flex-col mt-3">
              <EditJabatan
                setApiResponse={setApiResponse}
                setActiveButton={setActiveButton}
              />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
