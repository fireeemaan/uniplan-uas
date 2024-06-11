import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import {
  Collapse,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

const Row = ({ props, fetchData, setApiResponse, index }) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const confirm = useConfirm();

  const { name } = useParams();

  const handleShow = (id) => {
    navigate(`/admin/${name}/${id}`);
  };

  return (
    <>
      <TableRow sx={{ backgroundColor: "white" }}>
        <TableCell align="left" sx={{ width: 10 }}></TableCell>
        <TableCell align="left">{index}.</TableCell>
        <TableCell align="left" sx={{ maxWidth: 100 }}>
          {row.nama}
        </TableCell>
        <TableCell align="left">{row.nim}</TableCell>
        <TableCell align="left">{row.prodi}</TableCell>
        <TableCell align="right">
          <Stack
            direction="row"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Tooltip title="Lihat UKM/Ormawa Yang Diikuti">
              <IconButton color="info" onClick={() => handleShow(row.id)}>
                <IoMdEye />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};

const MahasiswaPages = ({ setApiResponse }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { name } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://222410101074.pbw.ilkom.unej.ac.id/api/api/user.php",
        {
          params: {
            action: "getAllUser",
          },
        }
      );
      console.log(response.data.data.users);
      setData(response.data.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name]);
  return (
    <TableContainer sx={{ borderRadius: "12px" }}>
      <Table sx={{ maxWidth: 1000, minWidth: 1000 }}>
        <TableHead
          sx={{
            "& .MuiTableCell-root": { color: "black", fontWeight: "bold" },
            backgroundColor: "#f2f2f2",
          }}
        >
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="left">No.</TableCell>
            <TableCell align="left">Nama Mahasiswa</TableCell>
            <TableCell align="left">NIM</TableCell>
            <TableCell align="left">Prodi</TableCell>
            <TableCell align="left" width={10}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data
              .filter((row) => row.prodi !== null)
              .map((row, index) => (
                <Row
                  key={row.id}
                  index={index + 1}
                  props={{ row }}
                  fetchData={fetchData}
                  setApiResponse={setApiResponse}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <h1 className="text-lg font-bold">Tidak Ada Kegiatan</h1>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MahasiswaPages;
