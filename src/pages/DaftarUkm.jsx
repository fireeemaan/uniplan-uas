import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DefaultImage from "../assets/img-placeholder.svg";
import Navbar from "../components/Navbar";

const DaftarUkm = () => {
  const [ukm, setUkm] = useState([]);
  const ukmData = JSON.parse(sessionStorage.getItem("ukm"));
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const name = userData?.userData.nama;
  const id = userData?.userData.id;
  const id_roles = userData?.userData.id_roles;
  let action = "getAll";

  useEffect(() => {
    const fetchUKM = async () => {
      try {
        const response = await axios.get(
          "http://localhost/pweb-uas/api/ukmormawa.php",
          {
            params: {
              action: action,
              id_user: id,
            },
          }
        );
        setUkm(response.data.data.ukmormawa);
        sessionStorage.setItem(
          "ukm",
          JSON.stringify(response.data.data.ukmormawa)
        );
        console.log(id_roles);
      } catch (error) {
        console.error(error);
      }
    };
    if (id_roles === "1") {
      action = "getByUser";
    } else if (id_roles === "2") {
      action = "getAll";
    }
    fetchUKM();

    fetchUKM();
  }, []);

  return (
    <>
      <Navbar type="home" name={name} />
      <div className="flex flex-col items-center justify-center h-screen">
        <div>
          <div className="w-full mb-3">
            <h1 className="text-2xl font-bold text-left">
              Daftar UKM / Ormawa
            </h1>
          </div>
          <div className="grid items-center justify-center grid-flow-row grid-cols-3 gap-3 ">
            {ukm.map((item) => (
              <a
                key={item.id}
                className="group flex flex-col items-center justify-start w-full h-full rounded-lg shadow-md cursor-pointer bg-white border border-black/5 "
                href={`/ukm-ormawa/${item.singkatan.toLowerCase()}`}
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DaftarUkm;
