import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Icon, IconButton } from "@mui/material";

const userData = JSON.parse(sessionStorage.getItem("userData"));
const id_user = userData?.userData.id;

const AddLampiran = ({ setApiResponse, setActiveButton }) => {
  const [inputs, setInputs] = useState({});

  const { name, idPeminjaman } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setInputs((values) => ({ ...values, [id]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO : Fix Waktu Selesai jika kosong terbaca 00.00
    console.log(inputs);
    axios
      .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/lampiran.php", {
        action: "addLampiran",
        id_peminjaman: idPeminjaman,
        nama_barang: inputs.nama,
        jumlah: inputs.jumlah,
        keterangan: inputs.keterangan,
      })
      .then((response) => {
        console.log(response.data);
        setApiResponse(response.data);
        if (response.data.status === "success") {
          setActiveButton("peminjaman");
          navigate(`/ukm-ormawa/${name}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Box className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10">
      <h1 className="font-bold">Tambah Lampiran</h1>
      <form className="flex flex-col gap-5">
        <TextField
          size="small"
          id="nama"
          label="Nama Barang"
          onChange={handleInputChange}
        />
        <TextField
          size="small"
          id="jumlah"
          label="Jumlah Barang"
          onChange={handleInputChange}
        />
        <TextField
          size="small"
          id="keterangan"
          label="Keterangan"
          multiline={true}
          onChange={handleInputChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddLampiran;
