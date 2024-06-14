// import React from "react";
import Navbar from "../components/Navbar";
import { Typography, Stack, duration } from "@mui/material";
import bgImage from "../assets/bg-cover.png";
import booksImage from "../assets/books.webp";
import pencilImage from "../assets/pencil.webp";
import { useEffect } from "react";
import { delay, easeIn, motion } from "framer-motion";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios
      .post("https://222410101074.pbw.ilkom.unej.ac.id/api/api/auth.php", {
        action: "addVisitor",
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const randomDelay = () => Math.random() * 3;

  const upDownAnimation = {
    y: ["0%", "10%", "0%"],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
      delay: randomDelay(),
    },
  };

  return (
    <>
      <Navbar type="landing" />
      <div className="flex items-center justify-center h-screen w-screen bg-blue-500">
        {/* <div
          className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>

        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: "black", opacity: 0.2 }}
        ></div> */}

        <motion.img
          src={booksImage}
          className="z-[1] size-72 absolute right-0"
          animate={upDownAnimation}
        ></motion.img>
        <motion.img
          src={booksImage}
          className="z-[1] size-60 absolute left-20 top-32 blur-md"
          initial={{ scaleX: -1 }}
          animate={upDownAnimation}
        ></motion.img>
        <motion.img
          src={pencilImage}
          className="z-[1] size-60 absolute left-32 bottom-20"
          initial={{ scaleX: -1 }}
          animate={upDownAnimation}
        ></motion.img>
        <motion.img
          src={pencilImage}
          className="z-[1] size-44 absolute right-60 top-20 blur-sm"
          animate={upDownAnimation}
        ></motion.img>
        <div className="size-[29rem] rounded-full blur-[100px] bg-white opacity-35 absolute"></div>

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
