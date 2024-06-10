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
import Autocomplete from "@mui/material/Autocomplete";

const EditJabatan = ({ setApiResponse, setActiveButton }) => {
  const [jabatan, setJabatan] = useState([]);

  const [optionsValue, setOptionsValue] = useState({
    jabatan: null,
  });
  const [initialOptionValue, setInitialOptionValue] = useState({
    jabatan: null,
  });

  useEffect(() => {
    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/user.php", {
        params: {
          action: "getJabatan",
        },
      })
      .then((response) => {
        const dataJabatan = response.data.data.jabatan;

        console.log(dataJabatan);

        const optionsJabatan = dataJabatan.map((option) => {
          const firstLetter = option.jabatan[0].toUpperCase();
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
            ...option,
          };
        });

        setOptionsValue({
          jabatan: optionsJabatan,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {};

  return (
    <Box className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10">
      <h1 className="font-bold">Edit Jadwal</h1>
      <form className="flex flex-col gap-5">
        <Autocomplete
          id="jabatan"
          options={optionsValue.jabatan.sort(
            (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
          )}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.jabatan}
          isOptionEqualToValue={(option, value) =>
            option.jabatan === value.jabatan
          }
          onChange={(event, value) =>
            handleAutoCompleteChange(event, value, "jabatan")
          }
          renderInput={(params) => (
            <TextField {...params} label="Dosen Tertuju" size="small" />
          )}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default EditJabatan;
