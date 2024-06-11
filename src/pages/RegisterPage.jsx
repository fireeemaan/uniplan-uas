import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";
import { Alert, Autocomplete, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { Height, Visibility, VisibilityOff } from "@mui/icons-material";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function RegisterPage() {
  const [inputs, setInputs] = useState({});
  const [apiResponse, setApiResponse] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [ukmormawa, setUkmormawa] = useState([]);
  const [prodi, setProdi] = useState([]);

  useEffect(() => {
    if (apiResponse.status) {
      if (apiResponse.status === "success") {
        toast.success(apiResponse.message);
        navigate("/login");
      } else {
        toast.error(apiResponse.message);
      }
    }
  }, [apiResponse]);

  useEffect(() => {
    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmormawa.php", {
        params: {
          action: "getAllUKM",
        },
      })
      .then((response) => {
        console.log(response.data.data.ukmormawa);
        setUkmormawa(response.data.data.ukmormawa);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://222410101074.pbw.ilkom.unej.ac.id/api/api/prodi.php", {
        params: {
          action: "getAllProdi",
        },
      })
      .then((response) => {
        const dataProdi = response.data.data.prodi;
        console.log(dataProdi);
        setProdi(dataProdi);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const optionsUkmormawa = ukmormawa.map((option) => {
    const firstLetter = option.nama[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setInputs((values) => ({ ...values, [id]: value }));
  };

  const handleAutoCompleteChange = (event, value, field) => {
    if (Array.isArray(value)) {
      setInputs((values) => ({
        ...values,
        [field]: value.map((option) => option.id),
      }));
    } else {
      setInputs((values) => ({ ...values, [field]: value ? value.id : null }));
    }

    console.log(inputs);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(inputs);

    axios
      .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/auth.php", {
        action: "register",
        name: inputs.name,
        nim: inputs.nim,
        prodi: inputs.prodi,
        phone: inputs.phone,
        username: inputs.username,
        email: inputs.email,
        password: inputs.password,
        ukmormawa: inputs.ukmormawa,
      })
      .then((response) => {
        console.log(response.data);
        setApiResponse(response.data);
      })
      .catch((error) => {
        console.log(error);
        setApiResponse(error.response);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      {/* {apiResponse && (
        <Alert
          variant="outlined"
          className="mb-5"
          severity={apiResponse.includes("success") ? "success" : "error"}
          sx={{ width: "40%" }}
        >
          {apiResponse}
        </Alert>
      )}

      {/* redirect to login page when success */}
      {/* {apiResponse.includes("success") && handleSucessResponse()} */}
      <div className="flex flex-col gap-2">
        <button
          className="flex flex-row items-center cursor-pointer gap-1"
          onClick={handleBack}
        >
          <FaAngleLeft />
          <h1>Back</h1>
        </button>

        <Box className="px-4 py-8 rounded-md shadow-lg bg-slate-200">
          <Container sx={{ width: 500 }}>
            <div className="flex flex-col gap-4 bg-slate-200">
              <h1 className="m-0 text-2xl font-bold text-center text-slate-900 bg-re">
                Register
              </h1>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center gap-3"
              >
                <TextField
                  onChange={handleInputChange}
                  className="w-full"
                  size="small"
                  id="name"
                  label="Name"
                  variant="outlined"
                  required
                />
                <TextField
                  onChange={handleInputChange}
                  className="w-full"
                  size="small"
                  id="nim"
                  label="NIM"
                  variant="outlined"
                  required
                />
                <Autocomplete
                  id="prodi"
                  options={prodi}
                  getOptionLabel={(option) => option.prodi}
                  isOptionEqualToValue={(option, value) =>
                    option.prodi === value.prodi
                  }
                  onChange={(event, value) =>
                    handleAutoCompleteChange(event, value, "prodi")
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Prodi" size="small" />
                  )}
                />
                <TextField
                  onChange={handleInputChange}
                  className="w-full"
                  size="small"
                  id="phone"
                  label="Phone Number"
                  variant="outlined"
                  required
                />
                <TextField
                  onChange={handleInputChange}
                  className="w-full"
                  size="small"
                  id="username"
                  label="Username"
                  variant="outlined"
                  required
                />
                <TextField
                  onChange={handleInputChange}
                  size="small"
                  id="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  required
                />
                <TextField
                  onChange={handleInputChange}
                  size="small"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  variant="outlined"
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleShowPassword} size="small">
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    ),
                  }}
                />
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="ukmormawa"
                  options={optionsUkmormawa.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  )}
                  groupBy={(option) => option.firstLetter}
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
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </form>
            </div>
          </Container>
        </Box>
      </div>
    </div>
  );
}

export default RegisterPage;
