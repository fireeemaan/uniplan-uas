import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";

const AddPeminjaman = ({ id_ukmormawa, setApiResponse, setActiveButton }) => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const id = userData?.userData.id;
  const [inputs, setInputs] = useState({});
  const [kegiatan, setKegiatan] = useState([]);
  const [dosen, setDosen] = useState([]);

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
  const handleAutoCompleteChange = (event, value, field) => {
    setInputs((values) => ({ ...values, [field]: value ? value.id : null }));
  };

  useEffect(() => {
    axios
      .get("http://localhost/pweb-uas/api/kegiatan.php", {
        params: {
          action: "getByName",
          ukmName: name,
        },
      })
      .then((response) => {
        console.log(response.data.data.jadwal);
        setKegiatan(response.data.data.jadwal);
        setDosen(response.data.data.dosen);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [name]);

  const optionsKegiatan = kegiatan.map((option) => {
    const firstLetter = option.nama_kegiatan[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const optionsDosen = dosen.map((option) => {
    const firstLetter = option.nama[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const truncateText = (text, length = 80) => {
    if (!text || text.length <= length) {
      return text || "";
    }
    return text.substring(0, length) + "...";
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(inputs);

    axios
      .post("http://localhost/pweb-uas/api/peminjaman.php", {
        action: "addPeminjaman",
        hal: inputs.hal,
        tanggal: inputs.date ? dayjs(inputs.date).format("YYYY-MM-DD") : null,
        id_kegiatan: inputs.kegiatan,
        id_dosen: inputs.dosen,
        id_ukmormawa: id_ukmormawa,
        id_user: id,
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
      <h1 className="font-bold">Tambah Peminjaman</h1>
      <form className="flex flex-col gap-5">
        <TextField
          size="small"
          id="hal"
          label="Hal"
          onChange={handleInputChange}
          sx={{ width: 500 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            size="small"
            id="date"
            label="Tanggal"
            onChange={(value) => handleInputChange(value, "date")}
          />
        </LocalizationProvider>
        <Autocomplete
          id="kegiatan"
          options={optionsKegiatan.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
          )}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.nama_kegiatan}
          isOptionEqualToValue={(option, value) =>
            option.nama_kegiatan === value.nama_kegiatan
          }
          onChange={(event, value) =>
            handleAutoCompleteChange(event, value, "kegiatan")
          }
          renderInput={(params) => (
            <TextField {...params} label="Kegiatan" size="small" />
          )}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            const truncatedText = truncateText(option.nama_kegiatan);
            return (
              <li {...otherProps}>
                <Tooltip title={option.nama_kegiatan} placement="right">
                  <div>{truncatedText}</div>
                </Tooltip>
              </li>
            );
          }}
        />
        <Autocomplete
          id="dosen"
          options={optionsDosen.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
          )}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.nama}
          isOptionEqualToValue={(option, value) => option.nama === value.nama}
          onChange={(event, value) =>
            handleAutoCompleteChange(event, value, "dosen")
          }
          renderInput={(params) => (
            <TextField {...params} label="Dosen Tertuju" size="small" />
          )}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddPeminjaman;
