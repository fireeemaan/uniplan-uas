import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// import SidebarNav from "../components/SidebarNav";
import MenuCard from "../components/MenuCard";
import { FaPeopleGroup } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { FaCalendarAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";

const RegularMenu = () => {
  return (
    <div className="grid w-full h-screen grid-cols-4 grid-rows-3 gap-5 bg-slate-100">
      <MenuCard
        icon={<FaPeopleGroup size="50px" />}
        className="col-start-2 row-start-2"
        href="/ukm-ormawa"
      >
        UKM / Ormawa
      </MenuCard>
      <MenuCard
        icon={<FaCalendarAlt size="50px" />}
        className="col-start-3 row-start-2"
        href="/jadwal-kegiatan"
      >
        Jadwal Kegiatan
      </MenuCard>
    </div>
  );
};

const AdminMenu = () => {
  return (
    <div className="grid w-full h-screen grid-cols-5 grid-rows-3 gap-5 bg-slate-100">
      <MenuCard
        icon={<GrUserAdmin size="50px" />}
        className="col-start-2 row-start-2"
        href="/admin"
      >
        Halaman Admin
      </MenuCard>
      <MenuCard
        icon={<FaPeopleGroup size="50px" />}
        className="col-start-3 row-start-2"
        href="/ukm-ormawa"
      >
        UKM / Ormawa
      </MenuCard>
      <MenuCard
        icon={<FaCalendarAlt size="50px" />}
        className="col-start-4 row-start-2"
        href="/jadwal-kegiatan"
      >
        Jadwal Kegiatan
      </MenuCard>
    </div>
  );
};

function Homepage() {
  const navigate = useNavigate();

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log(userData);
  const name = userData?.userData.nama;
  console.log(name);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Navbar type="home" name={name} />
      {userData?.userData.id_roles === "2" ? <AdminMenu /> : <RegularMenu />}
    </>
  );
}

export default Homepage;
