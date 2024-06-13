import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import toast from "react-hot-toast";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const AddUKMOrmawa = ({ setActivePage }) => {
  const [inputs, setInputs] = useState({
    jabatan: null,
    ukmormawa: null,
  });

  const [optionsValue, setOptionsValue] = useState({
    jabatan: null,
    ukmormawa: null,
  });
  const [initialOptionValue, setInitialOptionValue] = useState({
    jabatan: null,
    ukmormawa: null,
  });

  const navigate = useNavigate();

  const { name, idMahasiswa } = useParams();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [jabatanResponse, ukmormawaResponse] = await Promise.all([
          axios.get(
            "https://222410101074.pbw.ilkom.unej.ac.id/api/api/user.php",
            {
              params: {
                action: "getJabatan",
              },
            }
          ),
          axios.get(
            "https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmormawa.php",
            {
              params: {
                action: "getAllUKM",
              },
            }
          ),
        ]);

        const jabatanData = jabatanResponse.data.data.jabatan;
        const ukmormawaData = ukmormawaResponse.data.data.ukmormawa;
        console.log(ukmormawaData);

        setOptionsValue({
          jabatan: jabatanData,
          ukmormawa: ukmormawaData,
        });
        console.log(optionsValue);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOptions();
  }, []);

  const handleAutoCompleteChange = (event, value, field) => {
    setInputs((values) => ({ ...values, [field]: value ? value.id : null }));

    setInitialOptionValue((values) => ({ ...values, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);

    axios
      .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmormawa.php", {
        action: "addUkmormawaUser",
        id_ukmormawa: inputs.ukmormawa,
        id_jabatan: inputs.jabatan,
        id_user: idMahasiswa,
      })
      .then((response) => {
        console.log(response);
        // setApiResponse(response.data);
        if (response.data.status === "success") {
          toast.success(response.data.message);
          navigate(`/admin/${name}/${idMahasiswa}`);
          setActivePage("mahasiswa-ukm");
        } else {
          toast.error(response.data.message);
        }
      });
  };

  return (
    <Box
      sx={{ width: 1000 }}
      className="flex flex-col gap-2 bg-white p-5 rounded-lg shadow-lg border border-black/10"
    >
      {optionsValue.jabatan === null || optionsValue.ukmormawa === null ? (
        <Stack spacing={1}>
          <Skeleton
            variant="rectangular"
            width={200}
            height={25}
            sx={{ borderRadius: 1.5 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={50}
            sx={{ borderRadius: 1.5 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={50}
            sx={{ borderRadius: 1.5 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={35}
            sx={{ borderRadius: 1.5 }}
          />
        </Stack>
      ) : (
        <>
          <h1 className="font-bold">Tambah UKM / Ormawa Mahasiswa</h1>
          <form className="flex flex-col gap-5">
            <Autocomplete
              id="UKM / Ormawa"
              options={optionsValue.ukmormawa}
              getOptionLabel={(option) => option.nama}
              isOptionEqualToValue={(option, value) =>
                option.nama === value.nama
              }
              onChange={(event, value) =>
                handleAutoCompleteChange(event, value, "ukmormawa")
              }
              renderInput={(params) => (
                <TextField {...params} label="UKM / Ormawa" size="small" />
              )}
            />
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
        </>
      )}
    </Box>
  );
};

export default AddUKMOrmawa;
