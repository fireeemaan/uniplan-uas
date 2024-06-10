import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Icon, IconButton } from "@mui/material";

const EditLampiran = ({ setApiResponse, setActiveButton }) => {
  const [inputs, setInputs] = useState({});

  const { name, idPeminjaman, idLampiran } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setInputs((values) => ({ ...values, [id]: value }));
  };

  useEffect(() => {
    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/lampiran.php", {
        params: {
          action: "getById",
          id_lampiran: idLampiran,
        },
      })
      .then((response) => {
        console.log(idLampiran);
        console.log(response.data);
        const data = response.data.data.lampiran;
        console.log(data);
        setInputs(data);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!inputs.nama || !inputs.jumlah) {
      setApiResponse({
        status: "error",
        message: "Nama dan Jumlah Wajib Diisi!",
      });
    } else {
      console.log(inputs);
      axios
        .post(
          "https://222410101074.pbw.ilkom.unej.ac.id/api/api/lampiran.php",
          {
            action: "updateLampiran",
            id_lampiran: idLampiran,
            nama_barang: inputs.nama,
            jumlah: inputs.jumlah,
            keterangan: inputs.keterangan,
          }
        )
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
    }
  };
  return (
    <Box className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10">
      <h1 className="font-bold">Tambah Lampiran</h1>
      <form className="flex flex-col gap-5">
        <TextField
          size="small"
          id="nama"
          label="Nama Barang"
          InputLabelProps={{ shrink: true }}
          value={inputs.nama}
          onChange={handleInputChange}
        />
        <TextField
          size="small"
          id="jumlah"
          label="Jumlah Barang"
          InputLabelProps={{ shrink: true }}
          value={inputs.jumlah}
          onChange={handleInputChange}
        />
        <TextField
          size="small"
          id="keterangan"
          label="Keterangan"
          multiline={true}
          InputLabelProps={{ shrink: true }}
          value={inputs.keterangan}
          onChange={handleInputChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default EditLampiran;
