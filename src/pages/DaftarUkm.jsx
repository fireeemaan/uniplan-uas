import React from "react";
import { useEffect } from "react";
import axios from "axios";

const DaftarUkm = () => {
  useEffect(() => {
    const response = axios.get("http://localhost/pweb-uas/api/ukmormawa.php", {
      params: {
        action: "getAll",
      },
    });
    console.log(response.data);
  }, []);

  return <div>Daftar Ukm</div>;
};

export default DaftarUkm;
