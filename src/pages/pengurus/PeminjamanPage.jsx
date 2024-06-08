import React from "react";
import { useState, useEffect } from "react";
import {
  Collapse,
  IconButton,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Tooltip,
  Box,
  TableRow,
  Zoom,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";

const Row = ({ props, fetchData, setApiResponse, jabatan }) => {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const confirm = useConfirm();

  const { name } = useParams();

  const handleEdit = (id) => {
    navigate(`/ukm-ormawa/${name}/jadwal/${id}/edit`);
  };

  const handleDelete = (id) => {
    confirm({
      title: "Hapus Kegiatan",
      description: "Apakah Anda yakin ingin menghapus kegiatan ini?",
    })
      .then(() => {
        axios
          .get("http://localhost/pweb-uas/api/kegiatan.php", {
            params: {
              action: "deleteJadwal",
              id_kegiatan: id,
            },
          })
          .then((response) => {
            console.log(response.data.status);
            setApiResponse(response.data);
            if (response.data.status === "success") {
              // console.log("HELLO!");
              fetchData();
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch(() => {});
  };

  const formatTime = (time) => {
    const dateTime = `1970-01-01T${time}`;
    return dayjs(dateTime).format("HH:mm");
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ maxWidth: 50, minWidth: 50 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.hal}</TableCell>
        <TableCell align="left">
          {dayjs(row.tanggal).format("d MMMM YYYY")}
        </TableCell>
        <TableCell align="left" sx={{ maxWidth: 200 }}>
          {row.nama_kegiatan.length > 15 ? (
            <Tooltip title={row.nama_kegiatan}>
              <Typography noWrap>{row.nama_kegiatan}</Typography>
            </Tooltip>
          ) : (
            <Typography noWrap>{row.nama_kegiatan}</Typography>
          )}
        </TableCell>
        <TableCell align="left">{row.tempat}</TableCell>
        <TableCell align="left">
          {formatTime(row.start)} - {row.end ? formatTime(row.end) : "Selesai"}
        </TableCell>
        <TableCell align="right">
          {jabatan === "Pengurus" ? (
            <Stack
              direction="row"
              spacing={1}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <IconButton color="error" onClick={() => handleDelete(row.id)}>
                <MdDelete />
              </IconButton>
              <IconButton color="info" onClick={() => handleEdit(row.id)}>
                <MdEdit />
              </IconButton>
            </Stack>
          ) : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, gap: "10px" }}>
              <h1 className="text-lg font-bold mb-5">Lampiran</h1>
              <Table
                size="small"
                aria-label="purchases"
                sx={{ borderTop: 1, borderColor: "rgba(0, 0, 0, 0.1)" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      Nama
                    </TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      Jumlah
                    </TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      Keterangan
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.lampiran.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">{item.nama}</TableCell>
                      <TableCell align="left">{item.jumlah}</TableCell>
                      <TableCell align="left">
                        {item.keterangan ? item.keterangan : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const PeminjamanPage = ({ setApiResponse, jabatan }) => {
  const [data, setData] = useState([]);
  // const [peminjaman, setPeminjaman] = useState([]);

  const navigate = useNavigate();

  const { name } = useParams();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost/pweb-uas/api/peminjaman.php",
        {
          params: {
            action: "getAllByUKM",
            id_ukmormawa: 1,
          },
        }
      );
      console.log(response.data);
      setData(response.data.data.peminjaman);
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
            <TableCell />
            <TableCell align="left">Hal</TableCell>
            <TableCell align="left">Tanggal</TableCell>
            <TableCell align="left">Nama Kegiatan</TableCell>
            <TableCell align="left">Tempat</TableCell>
            <TableCell align="left">Waktu</TableCell>
            <TableCell align="left" width={10}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.filter((row) => row.deleted_at === null).length > 0 ? (
            data
              .filter((row) => row.deleted_at === null)
              .map((row) => (
                <Row
                  key={row.id}
                  props={{ row }}
                  fetchData={fetchData}
                  setApiResponse={setApiResponse}
                  jabatan={jabatan}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <h1 className="text-lg font-bold">Tidak Ada Peminjaman</h1>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PeminjamanPage;
