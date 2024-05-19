// import React from 'react'
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, IconButton } from "@mui/material";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost/pweb-uas/api/auth.php", {
        action: "login",
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "success") {
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem(
            "userData",
            JSON.stringify(response.data.data)
          );
          window.location.href = "/dashboard";
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
        {error && (
          <Alert severity="error" variant="outlined" className="mb-5">
            {error}
          </Alert>
        )}
        <Box className="flex flex-col px-4 py-10 rounded-md shadow-lg bg-slate-200">
          <Container>
            <div className="flex flex-col gap-8 bg-slate-200">
              <h1 className="text-2xl font-bold text-center text-slate-900">
                Log in
              </h1>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextField
                  onChange={handleUsernameChange}
                  className="w-full"
                  size="small"
                  id="username"
                  label="Username"
                  variant="outlined"
                />
                <TextField
                  onChange={handlePasswordChange}
                  size="small"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  variant="outlined"
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
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </form>
            </div>
          </Container>
        </Box>
      </div>
    </>
  );
}

export default LoginPage;
