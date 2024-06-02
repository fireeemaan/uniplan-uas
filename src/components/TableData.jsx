import React from "react";
import { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import dayjs from "dayjs";

const Row = ({ props }) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const formatTime = (time) => {
    const dateTime = `1970-01-01T${time}`;
    return dayjs(dateTime).format("HH:mm");
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ maxWidth: 20, minWidth: 20 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.nama_kegiatan}</TableCell>
        <TableCell align="left">
          {dayjs(row.tanggal).format("d MMMM YYYY")}
        </TableCell>
        <TableCell align="left">{row.tempat}</TableCell>
        <TableCell align="left">
          {formatTime(row.start)} - {row.end ? formatTime(row.end) : "Selesai"}
        </TableCell>
        <TableCell align="left">Action</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableBody>
                <TableCell
                  sx={{
                    maxWidth: 500,
                    minWidth: 500,
                    padding: "10px 10px 10px 10px",
                  }}
                >
                  <h1 className="text-lg font-bold">Deskripsi</h1>
                  <p>{row.deskripsi ? row.deskripsi : "Tidak Ada Deskripsi"}</p>
                </TableCell>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TableData = ({ ukmName }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/pweb-uas/api/kegiatan.php",
          {
            params: {
              action: "getByName",
              ukmName: ukmName,
            },
          }
        );
        console.log(response.data.data.jadwal);
        setData(response.data.data.jadwal);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [ukmName]);
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
            <TableCell />
            <TableCell align="left">Nama Kegiatan</TableCell>
            <TableCell align="left">Tanggal</TableCell>
            <TableCell align="left">Tempat</TableCell>
            <TableCell align="left">Waktu</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => <Row key={row.id} props={{ row }} />)
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

export default TableData;
