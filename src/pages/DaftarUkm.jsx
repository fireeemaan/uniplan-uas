import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import DefaultImage from "../assets/img-placeholder.svg";
import Navbar from "../components/Navbar";

const DaftarUkm = () => {
  const navigate = useNavigate();
  const [ukm, setUkm] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const name = userData?.userData.nama;
  const id = userData?.userData.id;
  const id_roles = userData?.userData.id_roles;
  let action = "getAll";

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUKM = async () => {
      try {
        const response = await axios.get(
          "https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmormawa.php",
          {
            params: {
              action: action,
              id_user: id,
            },
          }
        );
        console.log(response.data.data.ukmormawa);
        setUkm(response.data.data.ukmormawa);
        setIsLoading(false);
        console.log(id_roles);
      } catch (error) {
        console.error(error);
      }
    };
    if (id_roles === "1") {
      action = "getAll";
    } else if (id_roles === "2") {
      action = "getAll";
    }
    fetchUKM();
    sessionStorage.removeItem("ukm");
  }, []);

  const handleUkmClick = (to) => {
    navigate(to);
  };

  return (
    <>
      <Navbar type="home" name={name} roles={id_roles} />
      <div className="w-full h-36 bg-slate-100"></div>
      <div className="flex flex-col items-center h-full bg-slate-100">
        <div>
          <div className="w-full mb-3">
            <h1 className="text-2xl font-bold text-left">
              Daftar UKM / Ormawa
            </h1>
          </div>
          {isLoading ? (
            <div className="grid items-center justify-center grid-flow-row grid-cols-3 gap-6 mb-14">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={"16rem"}
                  width={"19rem"}
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </div>
          ) : (
            <div className="grid items-center justify-center grid-flow-row grid-cols-3 gap-6 mb-14">
              {ukm.map((item) => (
                <button
                  key={item.id}
                  className="group flex flex-col items-center justify-start w-full h-full rounded-lg shadow-md cursor-pointer bg-white border border-black/10 "
                  onClick={() =>
                    handleUkmClick(
                      `/ukm-ormawa/${item.singkatan.toLowerCase()}`
                    )
                  }
                >
                  <div className="z-10 w-full rounded-t-lg bg-white h-44">
                    <img
                      src={item.logo ? item.logo : DefaultImage}
                      className="z-0 object-cover w-full h-full rounded-t-lg"
                    ></img>
                  </div>

                  <div className="z-10 flex justify-center w-full p-3 text-center rounded-b-lg text-wrap h-20 border border-black/5 group-hover:bg-slate-50">
                    <a className="h-full font-medium cursor-pointer text-md max-w-72">
                      {item.nama}
                    </a>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DaftarUkm;
