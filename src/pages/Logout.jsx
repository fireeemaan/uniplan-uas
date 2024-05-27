import React from "react";
import axios from "axios";

const Logout = () => {
  axios
    .post("http://localhost/pweb-uas/api/auth.php")
    .then((response) => {
      sessionStorage.clear();
      window.location.href = "/login";
    })
    .catch((error) => {
      console.error(error);
    });
};

export default Logout;
