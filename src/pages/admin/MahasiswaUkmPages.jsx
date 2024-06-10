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
import { grey } from "@mui/material/colors";

const Row = ({ props, fetchData, setApiResponse, index }) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const confirm = useConfirm();

  const { name, idMahasiswa } = useParams();

  const handleEdit = (id) => {
    navigate(`/admin/${name}/${idMahasiswa}/${id}/edit`);
  };

  return (
    <>
      <TableRow>
        <TableCell align="left" sx={{ width: 10 }}></TableCell>
        <TableCell align="left">{index}.</TableCell>
        <TableCell align="left" sx={{ maxWidth: 100 }}>
          {row.nama}
        </TableCell>
        <TableCell align="left">{row.jabatan}</TableCell>
        <TableCell align="right">
          <Stack
            direction="row"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <IconButton color="info" onClick={() => handleEdit(row.id)}>
              <MdEdit />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};

const MahasiswaUkmPages = ({ setApiResponse }) => {
  const [ukmormawa, setUkmormawa] = useState([]);
  const [user, setUser] = useState([]);

  const navigate = useNavigate();

  const { name, idMahasiswa } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://222410101074.pbw.ilkom.unej.ac.id/api/api/ukmOrmawa.php",
        {
          params: {
            action: "getByUser",
            id_user: idMahasiswa,
          },
        }
      );
      console.log(response.data.data);
      setUkmormawa(response.data.data.ukmormawa);
      setUser(response.data.data.user);
      console.log(ukmormawa);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name]);
  return (
    <>
      <div className="flex flex-col p-6 rounded-lg mb-4 shadow-lg border border-black/5">
        <Typography variant="h8" sx={{ fontWeight: "bold" }}>
          {user.nama}
        </Typography>
        <Typography color="#474747" sx={{ fontSize: 15 }}>
          {user.prodi}
        </Typography>
        <Typography color="#a6a6a6" sx={{ fontSize: 15 }}>
          {user.nim}
        </Typography>
      </div>
      <TableContainer
        sx={{
          borderRadius: "12px",
          borderWidth: 1,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
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
              <TableCell align="left">Nama UKM/Ormawa</TableCell>
              <TableCell align="left">Jabatan</TableCell>
              <TableCell align="left" width={10}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ukmormawa.length > 0 ? (
              ukmormawa
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
    </>
  );
};

export default MahasiswaUkmPages;