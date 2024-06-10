import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Tab, Button } from "@mui/material";
import axios from "axios";
import classNames from "classnames";
import TableData from "../components/TableData";
import { FaAngleLeft } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import Navbar from "../components/Navbar";
import AddJadwal from "./pengurus/jadwal/AddJadwal";
import EditJadwal from "./pengurus/jadwal/EditJadwal";
import toast from "react-hot-toast";
import PeminjamanPage from "./pengurus/peminjaman/PeminjamanPage";
import AddPeminjaman from "./pengurus/peminjaman/AddPeminjaman";
import EditPeminjaman from "./pengurus/peminjaman/EditPeminjaman";
import AddLampiran from "./pengurus/lampiran/AddLampiran";
import EditLampiran from "./pengurus/lampiran/EditLampiran";

const userData = JSON.parse(sessionStorage.getItem("userData"));
const id = userData?.userData.id;
const id_role = userData?.userData.id_roles;
let ukmName = "";
let jabatan = "";
let abbrevation = "";
let idUkm = "";

const DaftarAnggota = ({ idUkm }) => {
  const [anggota, setAnggota] = useState([]);

  const { name } = useParams();

  useEffect(() => {
    const fetchAnggota = async () => {
      try {
        const response = await axios.get(
          "https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmormawa.php",
          {
            params: {
              action: "getAnggota",
              ukm_name: name.toUpperCase(),
            },
          }
        );
        console.log(response.data);
        setAnggota(response.data.data.anggota);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnggota();
  }, [idUkm]);

  return (
    <div className="grid grid-cols-4 grid-flow-row gap-3 w-full justify-center">
      {anggota.length > 0 ? (
        anggota.map((anggota) => (
          <div
            key={anggota.id}
            className="flex flex-row p-3 border border-black/10 shadow-lg w-full rounded-lg items-center hover:bg-gray-400/5 ease-in-out transition-all"
          >
            <div className="flex rounded-full bg-gray-200 size-12 justify-center items-center">
              <IoPerson className="text-gray-400 text-2xl" />
            </div>
            <div className="w-full">
              <div className="flex flex-row items-center justify-between w-full">
                <h1 className="text-sm font-bold ml-3">{anggota.nama}</h1>
                <h1 className="text-xs ml-3 font-bold">{anggota.jabatan}</h1>
              </div>
              <h1 className="text-xs ml-3 text-gray-600">{anggota.nim}</h1>
              <h1 className="text-xs ml-3 text-gray-500">{anggota.prodi}</h1>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-center col-span-4 font-bold text-2xl">
          Tidak Ada Anggota
        </h1>
      )}
      {}
    </div>
  );
};

const UkmPages = () => {
  const [activeButton, setActiveButton] = useState("home");
  const [isEdited, setIsEdited] = useState(false);
  const [ukmUser, setUkmUser] = useState([]);
  const [ukm, setUkm] = useState([]);
  const { name, idKegiatan, idPeminjaman, action, actionLampiran } =
    useParams();

  const [apiResponse, setApiResponse] = useState({});

  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    navigate(`/ukm-ormawa/${name}`);
  };

  // const ukmData = JSON.parse(sessionStorage.getItem("ukm"));
  console.log(id_role);
  let findUkm;
  if (id_role === "1") {
    findUkm = ukmUser.find((ukm) => ukm.singkatan.toLowerCase() === name);
  }
  if (id_role === "2") {
    findUkm = ukm.find((ukm) => ukm.singkatan.toLowerCase() === name);
  }

  // console.log(findUkm);

  if (findUkm) {
    console.log(findUkm.jabatan);
    idUkm = findUkm.id;
    abbrevation = findUkm.singkatan;
    ukmName = findUkm.nama;
    jabatan = findUkm.jabatan;
  }
  // console.log(idUkm);
  // console.log(jabatan);
  // console.log(ukmName);

  const handleBack = () => {
    navigate("/ukm-ormawa");
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (idKegiatan) {
      setActiveButton("edit-kegiatan");
    }
  }, [idKegiatan]);
  useEffect(() => {
    if (idPeminjaman) {
      if (action === "edit") {
        setActiveButton("edit-peminjaman");
      } else if (action === "lampiran") {
        if (actionLampiran === "edit") {
          setActiveButton("edit-lampiran");
        } else {
          setActiveButton("lampiran");
        }
      }
    }
  }, [idPeminjaman]);

  useEffect(() => {
    console.log(apiResponse);
    if (Object.keys(apiResponse).length > 0) {
      console.log(apiResponse.status);
      if (apiResponse.status === "success") {
        toast.success(apiResponse.message);
      } else if (apiResponse.status === "error") {
        toast.error(apiResponse.message);
      }
      setApiResponse({});
    }
  });

  useEffect(() => {
    const fetchUKM_User = async () => {
      try {
        const response = await axios.get(
          "https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmormawa.php",
          {
            params: {
              action: "getAll",
              id_user: id,
            },
          }
        );
        console.log(response.data);
        setUkm(response.data.data.ukmormawa);
        setUkmUser(response.data.data.ukm_user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUKM_User();
  }, []);

  const buttons =
    jabatan === "Pengurus" ? (
      <div className="grid grid-cols-7 text-xl gap-4 font-bold mx-24 mt-8 w-full mb-5">
        <Button
          variant={activeButton === "home" ? "contained" : "outlined"}
          className="col-start-3"
          onClick={() => handleButtonClick("home")}
          sx={{
            borderRadius: 3,
            padding: "3px 3px",
            textTransform: "none",
          }}
        >
          Home
        </Button>
        <Button
          variant={activeButton === "anggota" ? "contained" : "outlined"}
          className="col-start-4"
          onClick={() => handleButtonClick("anggota")}
          sx={{
            borderRadius: 3,
            padding: "3px 3px",
            textTransform: "none",
          }}
        >
          Daftar Anggota
        </Button>
        <Button
          variant={activeButton === "peminjaman" ? "contained" : "outlined"}
          className="col-start-5"
          onClick={() => handleButtonClick("peminjaman")}
          sx={{
            borderRadius: 3,
            padding: "3px 3px",
            textTransform: "none",
          }}
        >
          Peminjaman
        </Button>
      </div>
    ) : (
      <div className="grid grid-cols-6 text-xl gap-4 font-bold mx-24 mt-8 w-full mb-5">
        <Button
          variant={activeButton === "home" ? "contained" : "outlined"}
          className="col-start-3"
          onClick={() => handleButtonClick("home")}
          sx={{
            borderRadius: 3,
            padding: "3px 3px",
            textTransform: "none",
          }}
        >
          Home
        </Button>
        <Button
          variant={activeButton === "anggota" ? "contained" : "outlined"}
          className="col-start-4"
          onClick={() => handleButtonClick("anggota")}
          sx={{
            borderRadius: 3,
            padding: "3px 3px",
            textTransform: "none",
          }}
        >
          Daftar Anggota
        </Button>
      </div>
    );

  return (
    <>
      <Navbar type="home" name={userData.userData.nama} />
      <div className="flex flex-col mt-4 items-center justify-center w-full p-10">
        <div className="flex flex-col bg-white w-full items-center mt-10">
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

          <h1 className="text-2xl font-bold text-center">{ukmName}</h1>
          {buttons}
          {activeButton === "home" && (
            <div>
              {jabatan != null && jabatan.toLowerCase() === "pengurus" && (
                <div className="flex flex-row justify-end">
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick("tambah-kegiatan")}
                  >
                    Tambah
                  </Button>
                </div>
              )}

              <div className="flex flex-col shadow-lg border border-black/10 rounded-xl mt-3">
                <TableData jabatan={jabatan} setApiResponse={setApiResponse} />
              </div>
            </div>
          )}
          {activeButton === "anggota" && (
            <div className="flex flex-col w-full rounded-xl mt-3">
              <DaftarAnggota idUkm={idUkm} />
            </div>
          )}
          {activeButton === "tambah-kegiatan" && (
            <AddJadwal
              id_ukmormawa={idUkm}
              setApiResponse={setApiResponse}
              setActiveButton={setActiveButton}
            />
          )}
          {activeButton === "edit-kegiatan" && (
            <EditJadwal
              setApiResponse={setApiResponse}
              setActiveButton={setActiveButton}
              jabatan={jabatan}
            />
          )}
          {activeButton === "peminjaman" && (
            <div>
              {jabatan != null && jabatan.toLowerCase() === "pengurus" && (
                <div className="flex flex-row justify-end">
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick("tambah-peminjaman")}
                  >
                    Tambah
                  </Button>
                </div>
              )}

              <div className="flex flex-col shadow-lg border border-black/10 rounded-xl mt-3">
                <PeminjamanPage
                  jabatan={jabatan}
                  setApiResponse={setApiResponse}
                />
              </div>
            </div>
          )}
          {activeButton === "tambah-peminjaman" && (
            <AddPeminjaman
              id_ukmormawa={idUkm}
              setApiResponse={setApiResponse}
              setActiveButton={setActiveButton}
            />
          )}
          {activeButton === "edit-peminjaman" && (
            <EditPeminjaman
              setApiResponse={setApiResponse}
              setActiveButton={setActiveButton}
              jabatan={jabatan}
            />
          )}
          {activeButton === "lampiran" && (
            <AddLampiran
              setApiResponse={setApiResponse}
              setActiveButton={setActiveButton}
            />
          )}
          {activeButton === "edit-lampiran" && (
            <EditLampiran
              setApiResponse={setApiResponse}
              setActiveButton={setActiveButton}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UkmPages;
