// import React from 'react'
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, IconButton } from "@mui/material";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [apiResponse, setApiResponse] = useState({});
  const [error, setError] = useState("");

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    if (apiResponse.status) {
      if (apiResponse.status === "success") {
        toast.success(apiResponse.message);
      } else {
        toast.error(apiResponse.message);
      }
    }
  }, [apiResponse]);

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
      .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/auth.php", {
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
          window.location.href = "/homepage";
        } else {
          setApiResponse(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <div className="flex flex-col items-center w-full justify-center h-screen">
        <div className="flex flex-col gap-2">
          <button
            className="flex flex-row items-center cursor-pointer gap-1"
            onClick={handleBack}
          >
            <FaAngleLeft />
            <h1>Back</h1>
          </button>

          <Box className="flex flex-col px-4 py-10 rounded-md shadow-lg bg-slate-200">
            <Container>
              <div className="flex flex-col gap-8 bg-slate-200">
                <h1 className="text-2xl font-bold text-center text-slate-900">
                  Log in
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <TextField
                    onChange={handleUsernameChange}
                    value={username}
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
                    value={password}
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
      </div>
    </>
  );
}

export default LoginPage;
