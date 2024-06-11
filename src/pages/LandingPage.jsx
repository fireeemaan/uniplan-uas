// import React from "react";
import Navbar from "../components/Navbar";
import { Typography, Stack } from "@mui/material";
import bgImage from "../assets/bg-cover.png";

function LandingPage() {
  return (
    <>
      <Navbar type="landing" />
      <div className="flex items-center justify-center h-screen w-screen">
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: "black", opacity: 0.2 }}
        ></div>
        <Stack spacing={1} zIndex={2}>
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            UniPlan
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "", width: 500, color: "white" }}
          >
            Sistem Informasi Pengelolaan Kegiatan UKM/ORMAWA
          </Typography>
        </Stack>
      </div>
    </>
  );
}

export default LandingPage;
