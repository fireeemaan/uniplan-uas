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

const EditUKMOrmawa = ({ setApiResponse, setActiveButton }) => {
  const [jabatan, setJabatan] = useState([]);

  const [optionsValue, setOptionsValue] = useState({
    jabatan: null,
    ukmormawa: null,
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
        setOptionsValue({
          ...optionsValue,
          jabatan: dataJabatan,
        });
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmormawa.php", {
        params: {
          action: "getAllUKM",
        },
      })
      .then((response) => {
        const dataUkmormawa = response.data.data.ukmormawa;
        console.log(dataUkmormawa);
        setOptionsValue({
          ...optionsValue,
          ukmormawa: dataUkmormawa,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {};

  return (
    <Box
      sx={{ width: 1000 }}
      className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10"
    >
      <h1 className="font-bold">Edit UKM / Ormawa</h1>
      <form className="flex flex-col gap-5">
        <Autocomplete
          id="jabatan"
          options={optionsValue.jabatan}
          getOptionLabel={(option) => option.jabatan}
          isOptionEqualToValue={(option, value) =>
            option.jabatan === value.jabatan
          }
          onChange={(event, value) =>
            handleAutoCompleteChange(event, value, "jabatan")
          }
          renderInput={(params) => (
            <TextField {...params} label="Jabatan" size="small" />
          )}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default EditUKMOrmawa;
