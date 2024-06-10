// import React from "react";
import Navbar from "../components/Navbar";
import { Typography, Stack } from "@mui/material";

function LandingPage() {
  return (
    <>
      <Navbar type="landing" />
      <div className="flex items-center justify-center h-screen w-screen">
        <Stack spacing={1}>
          <Typography variant="h3" align="center" sx={{ fontWeight: "bold" }}>
            UniPlan
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "", width: 500 }}
          >
            Sistem Informasi Pengelolaan Kegiatan UKM/ORMAWA
          </Typography>
        </Stack>
      </div>
    </>
  );
}

export default LandingPage;
