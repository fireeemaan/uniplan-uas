// import React from 'react'
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, IconButton } from "@mui/material";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../assets/bg-cover.png";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [apiResponse, setApiResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cancelSource, setCancelSource] = useState(null);
  // const [error, setError] = useState("");

  const handleBack = () => {
    navigate("/");
  };

  const handleRedirect = (to) => {
    navigate(to);
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

    if (!isLoading) {
      setIsLoading(true);
    }

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setCancelSource(source);

    const timeout = setTimeout(() => {
      source.cancel("Request timed out");
      toast.error("Request Timed Out");
      setIsLoading(false);
    }, 5000);

    axios
      .post(
        "https://222410101074.pbw.ilkom.unej.ac.id/api/api/auth.php",
        {
          action: "login",
          username: username,
          password: password,
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        clearTimeout(timeout);
        console.log(response.data);
        if (response.data.status === "success") {
          setIsLoading(false);
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem(
            "userData",
            JSON.stringify(response.data.data)
          );
          // window.location.href = "/homepage";
          navigate("/homepage");
        } else {
          setIsLoading(false);
          setApiResponse(response.data);
        }
      })
      .catch((error) => {
        clearTimeout(timeout);
        console.error(error);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center w-full justify-center h-screen bg-blue-500">
        <div className="size-[29rem] rounded-full blur-[100px] bg-white opacity-35 absolute"></div>
        {/* <div
          className="absolute inset-0 z-0 blur-sm"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        ></div>
        <div
          className="absolute inset-0 z-0 blur-md"
          style={{
            backgroundColor: "black",
            opacity: 0.5,
          }}
        ></div> */}
        <div className="flex flex-col gap-2 z-10">
          <button
            className="flex flex-row items-center cursor-pointer gap-1"
            onClick={handleBack}
          >
            <FaAngleLeft color="white" />
            <h1 className="text-white">Back</h1>
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
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                  >
                    Submit
                    {isLoading && (
                      <CircularProgress
                        size={25}
                        sx={{ position: "absolute" }}
                      />
                    )}
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
