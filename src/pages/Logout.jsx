import React from "react";
import axios from "axios";

const Logout = () => {
  axios
    .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/auth.php")
    .then((response) => {
      sessionStorage.clear();
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error(error);
    });
};

export default Logout;
