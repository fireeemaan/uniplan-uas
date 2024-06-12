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

const userData = JSON.parse(sessionStorage.getItem("userData"));
const id_user = userData?.userData.id;

const EditJadwal = ({ setApiResponse, setActiveButton, jabatan }) => {
  const [inputs, setInputs] = useState({});
  const [kegiatan, setKegiatan] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  const { idKegiatan, name } = useParams();

  const handleInputChange = (event, field) => {
    if (field) {
      setKegiatan((values) => ({ ...values, [field]: event }));
    } else {
      const { id, value } = event.target;
      setKegiatan((values) => ({ ...values, [id]: value }));
    }
    console.log(kegiatan);
  };

  function parseTimeString(time) {
    const formattedTime = dayjs(time, "HH:mm:ss").format("HH:mm");
    const dtString = `1970-01-01T${formattedTime}`;
    return dayjs(dtString);
  }

  useEffect(() => {
    if (!jabatan || jabatan !== "Pengurus") {
      navigate(`/ukm-ormawa/${name}`);
      setActiveButton("home");
    }
  });

  useEffect(() => {
    console.log(idKegiatan);

    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/kegiatan.php", {
        params: {
          action: "getById",
          id_kegiatan: idKegiatan,
        },
      })
      .then((response) => {
        if (response.data.status === "error") {
          setApiResponse(response.data);
          setActiveButton("home");
          navigate(`/ukm-ormawa/${name}`);
        } else {
          setIsLoaded(true);
          setKegiatan(response.data.data.kegiatan);
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO : Fix Waktu Selesai jika kosong terbaca 00.00

    axios
      .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/kegiatan.php", {
        action: "updateJadwal",
        namaKegiatan: kegiatan.nama_kegiatan,
        tempat: kegiatan.tempat,
        tanggal: kegiatan.date
          ? dayjs(kegiatan.date).format("YYYY-MM-DD")
          : kegiatan.tanggal,
        waktuMulai: kegiatan.time_start
          ? dayjs(kegiatan.time_start).format("HH:mm")
          : kegiatan.start,
        waktuSelesai: kegiatan.time_end
          ? dayjs(kegiatan.time_end).format("HH:mm")
          : kegiatan.end,
        deskripsi: kegiatan.deskripsi,
        id_kegiatan: idKegiatan,
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
    <>
      {isLoaded ? (
        <Box className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10">
          <h1 className="font-bold">Edit Jadwal</h1>
          <form className="flex flex-col gap-5">
            <TextField
              size="small"
              id="nama_kegiatan"
              label="Nama Kegiatan"
              InputLabelProps={{ shrink: true }}
              value={kegiatan && kegiatan.nama_kegiatan}
              onChange={handleInputChange}
            />
            <TextField
              size="small"
              id="tempat"
              label="Tempat"
              value={kegiatan.tempat}
              InputLabelProps={{ shrink: true }}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                size="small"
                id="date"
                label="Tanggal"
                value={dayjs(kegiatan.tanggal)}
                onChange={(value) => handleInputChange(value, "date")}
              />
              <div className="flex flex-row items-center gap-5">
                <TimePicker
                  size="small"
                  id="time_start"
                  label="Waktu Mulai"
                  ampm={false}
                  value={parseTimeString(kegiatan.start)}
                  onChange={(value) => handleInputChange(value, "time_start")}
                />
                -
                <TimePicker
                  size="small"
                  id="time_end"
                  label="Waktu Selesai"
                  ampm={false}
                  value={parseTimeString(kegiatan.end)}
                  onChange={(value) => handleInputChange(value, "time_end")}
                />
              </div>
            </LocalizationProvider>
            <TextField
              size="small"
              id="deskripsi"
              label="Keterangan"
              value={kegiatan.deskripsi}
              InputLabelProps={{ shrink: true }}
              multiline={true}
              onChange={handleInputChange}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </form>
        </Box>
      ) : null}
    </>
  );
};

export default EditJadwal;
