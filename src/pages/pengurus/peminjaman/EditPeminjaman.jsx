import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { Stack } from "@mui/material";

const EditPeminjaman = ({ setApiResponse, setActiveButton, jabatan }) => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const id = userData?.userData.id;
  const [inputs, setInputs] = useState({});
  const [kegiatan, setKegiatan] = useState([]);
  const [dosen, setDosen] = useState([]);

  const [optionsValue, setOptionsValue] = useState({
    kegiatan: null,
    dosen: null,
  });

  const [peminjaman, setPeminjaman] = useState([]);
  const [initialOptionValue, setInitialOptionValue] = useState({
    dosen: null,
    kegiatan: null,
  });

  const { name, idPeminjaman } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!jabatan || jabatan !== "Pengurus") {
      navigate(`/ukm-ormawa/${name}`);
      setActiveButton("home");
    }
  }, [jabatan]);

  useEffect(() => {
    axios
      .get("http://localhost/pweb-uas/api/peminjaman.php", {
        params: {
          action: "getById",
          id_peminjaman: idPeminjaman,
        },
      })
      .then((response) => {
        const data = response.data.data.peminjaman;
        console.log(data);
        setPeminjaman(data);

        console.log(optionsValue);

        const initialDosen = optionsValue.dosen.find(
          (option) => option.id == data.id_dosen
        );
        const initialKegiatan = optionsValue.kegiatan.find(
          (option) => option.id == data.id_kegiatan
        );

        setInitialOptionValue({
          dosen: initialDosen || null,
          kegiatan: initialKegiatan || null,
        });

        console.log(initialOptionValue);
        console.log(initialDosen);
        // console.log(data.id_kegiatan);
      });
  }, [dosen, kegiatan]);

  useEffect(() => {
    axios
      .get("http://localhost/pweb-uas/api/kegiatan.php", {
        params: {
          action: "getByName",
          ukmName: name,
        },
      })
      .then((response) => {
        const dataKegiatan = response.data.data.jadwal;
        const dataDosen = response.data.data.dosen;

        console.log(dataKegiatan);
        setKegiatan(dataKegiatan);
        setDosen(dataDosen);

        const optionsKegiatan = dataKegiatan.map((option) => {
          const firstLetter = option.nama_kegiatan[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
            ...option,
          };
        });

        const optionsDosen = dataDosen.map((option) => {
          const firstLetter = option.nama[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
            ...option,
          };
        });

        setOptionsValue({
          kegiatan: optionsKegiatan,
          dosen: optionsDosen,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(inputs);
  };

  const truncateText = (text, length = 80) => {
    if (!text || text.length <= length) {
      return text || "";
    }
    return text.substring(0, length) + "...";
  };

  return (
    <Box className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10">
      <h1 className="font-bold">Edit Peminjaman</h1>
      {/* {console.log(initialOptionValue.kegiatan && initialOptionValue.dosen)} */}
      {initialOptionValue.kegiatan && initialOptionValue.dosen ? (
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
            value={initialOptionValue.kegiatan}
            options={optionsValue.kegiatan.sort(
              (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.nama_kegiatan}
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
            value={initialOptionValue.dosen}
            options={optionsValue.dosen.sort(
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
      ) : (
        <Stack gap={2}>
          <Skeleton variant="rectangular" height={50} width={500} />
          <Skeleton variant="rectangular" height={50} width={500} />
          <Skeleton variant="rectangular" height={50} width={500} />
          <Skeleton variant="rectangular" height={50} width={500} />
        </Stack>
      )}
    </Box>
  );
};

export default EditPeminjaman;
