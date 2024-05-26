import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";
import { Alert, IconButton } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function RegisterPage() {
  const [inputs, setInputs] = useState({});
  const [apiResponse, setApiResponse] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setInputs((values) => ({ ...values, [id]: value }));
  };

  const handleSucessResponse = () => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 4000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(inputs.name);

    axios
      .post("http://localhost/pweb-uas/api/auth.php", {
        action: "register",
        name: inputs.name,
        nim: inputs.nim,
        phone: inputs.phone,
        username: inputs.username,
        email: inputs.email,
        password: inputs.password,
      })
      .then((response) => {
        console.log(response.data);
        setApiResponse(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        setApiResponse(error.response.message);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      {apiResponse && (
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
      {apiResponse.includes("success") && handleSucessResponse()}

      <Box className="px-4 py-10 rounded-md shadow-lg bg-slate-200">
        <Container sx={{ width: "100%" }}>
          <div className="flex flex-col gap-8 bg-slate-200">
            <h1 className="m-0 text-2xl font-bold text-center text-slate-900">
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
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </form>
          </div>
        </Container>
      </Box>
    </div>
  );
}

export default RegisterPage;
