import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { Icon, IconButton } from "@mui/material";

const userData = JSON.parse(sessionStorage.getItem("userData"));
const id_user = userData?.userData.id;

const AddJadwal = ({ id_ukmormawa, setApiResponse, setActiveButton }) => {
  const [inputs, setInputs] = useState({});

  const [noTimeEnd, setNoTimeEnd] = useState(false);

  const { name } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (event, field) => {
    if (field) {
      setInputs((values) => ({ ...values, [field]: event }));
      // console.log(inputs);
    } else {
      const { id, value } = event.target;
      setInputs((values) => ({ ...values, [id]: value }));
    }
  };

  const handleCheckbox = (event) => {
    setNoTimeEnd(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO : Fix Waktu Selesai jika kosong terbaca 00.00
    console.log(inputs);
    axios
      .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/kegiatan.php", {
        action: "addJadwal",
        namaKegiatan: inputs.kegiatan_name,
        tempat: inputs.tempat,
        tanggal: inputs.date ? dayjs(inputs.date).format("YYYY-MM-DD") : null,
        waktuMulai: inputs.time_start
          ? dayjs(inputs.time_start).format("HH:mm")
          : null,
        waktuSelesai: inputs.time_end
          ? dayjs(inputs.time_end).format("HH:mm")
          : null,
        deskripsi: inputs.deskripsi,
        id_ukmormawa: id_ukmormawa,
        id_user: id_user,
      })
      .then((response) => {
        console.log(response.data);
        setApiResponse(response.data);
        if (response.data.status === "success") {
          setActiveButton("home");
          navigate(`/ukm-ormawa/${name}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Box className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10">
      <h1 className="font-bold">Tambah Jadwal</h1>
      <form className="flex flex-col gap-5">
        <TextField
          size="small"
          id="kegiatan_name"
          label="Nama Kegiatan"
          onChange={handleInputChange}
        />
        <TextField
          size="small"
          id="tempat"
          label="Tempat"
          onChange={handleInputChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            size="small"
            id="date"
            label="Tanggal"
            onChange={(value) => handleInputChange(value, "date")}
          />
          <div className="flex flex-row items-center gap-5 justify-center ">
            <TimePicker
              size="small"
              id="time_start"
              label="Waktu Mulai"
              ampm={false}
              onChange={(value) => handleInputChange(value, "time_start")}
            />
            -
            <TimePicker
              size="small"
              id="time_end"
              label={noTimeEnd ? "Selesai" : "Waktu Selesai"}
              value={noTimeEnd ? null : inputs.time_end}
              ampm={false}
              minTime={inputs.time_start ? inputs.time_start : null}
              onChange={(value) => handleInputChange(value, "time_end")}
              disabled={noTimeEnd}
            />
            <Checkbox onChange={handleCheckbox}></Checkbox>
          </div>
        </LocalizationProvider>
        <TextField
          size="small"
          id="deskripsi"
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

export default AddJadwal;
