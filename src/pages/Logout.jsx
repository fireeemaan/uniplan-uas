import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  axios
    .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/auth.php")
    .then((response) => {
      sessionStorage.clear();
      navigate("/login");
      // window.location.href = "/login";
    })
    .catch((error) => {
      console.error(error);
    });
};

export default Logout;
