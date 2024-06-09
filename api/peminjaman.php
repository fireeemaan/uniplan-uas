<?php

require_once '../config/dbconfig.php';
require_once '../config/request_config.php';

function createResponse($status, $message, $data = [])
{
    $response = [
        'status' => $status,
        'message' => $message,
        'data' => $data
    ];
    return json_encode($response);
}

function addPeminjaman($hal, $tanggal, $id_kegiatan, $id_dosen, $id_ukmormawa, $id_user)
{
    global $conn;
    $timenow = date('Y-m-d H:i:s');
    $sql = "INSERT INTO pengajuan_peminjaman 
            SET hal = ?, tanggal = ?, id_kegiatan = ?, id_dosen = ?, id_ukmormawa = ?, created_at = ?, created_by = ?;";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssiiisi', $hal, $tanggal, $id_kegiatan, $id_dosen, $id_ukmormawa, $timenow, $id_user);
    $stmt->execute();

    echo createResponse('success', 'Peminjaman berhasil diajukan');
}

function updatePeminjaman($hal, $tanggal, $id_kegiatan, $id_dosen, $id_peminjaman)
{
    global $conn;

    $sql = "UPDATE pengajuan_peminjaman SET hal = ?, tanggal = ?, id_kegiatan = ?, id_dosen = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssiii', $hal, $tanggal, $id_kegiatan, $id_dosen, $id_peminjaman);
    $stmt->execute();

    echo createResponse('success', 'Peminjaman Berhasil di Perbarui');
}

function deletePeminjaman($id_peminjaman)
{
    global $conn;
    $deleted_at = date('Y-m-d H:i:s');
    $sql_pengajuan = "UPDATE pengajuan_peminjaman SET deleted_at = ? WHERE id = ?;";
    $stmt_pengajuan = $conn->prepare($sql_pengajuan);
    $stmt_pengajuan->bind_param('si', $deleted_at, $id_peminjaman);
    $stmt_pengajuan->execute();

    $sql_lampiran = "UPDATE lampiran_peminjaman SET deleted_at = ? WHERE id_pengajuan = ?;";
    $stmt_lampiran = $conn->prepare($sql_lampiran);
    $stmt_lampiran->bind_param('si', $deleted_at, $id_peminjaman);
    $stmt_lampiran->execute();

    echo createResponse('success', 'Peminjaman Berhasil di Hapus');
}

function getById($id_peminjaman)
{
    global $conn;
    $sql = "SELECT * FROM pengajuan_peminjaman WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_peminjaman);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();

    echo createResponse('success', 'Data retrieved successfully', ['peminjaman' => $result]);
}


function getAllByUKM($singkatan)
{
    global $conn;
    $sql = "SELECT p.id, p.hal, p.tanggal, p.isi_surat, u.nama as nama_ukm, k.nama_kegiatan, k.tanggal as tanggal_kegiatan, k.tempat, k.start, k.end, p.deleted_at  FROM pengajuan_peminjaman p JOIN kegiatan k ON k.id = p.id_kegiatan JOIN dosen d ON d.id = p.id_dosen JOIN ukmormawa u ON p.id_ukmormawa = u.id WHERE u.singkatan = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $singkatan);
    $stmt->execute();
    $result = $stmt->get_result();
    $peminjaman = $result->fetch_all(MYSQLI_ASSOC);

    foreach ($peminjaman as &$p) {
        $peminjaman_id = $p['id'];

        $sql = "SELECT * FROM lampiran_peminjaman WHERE id_pengajuan= ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $peminjaman_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $p_data = $result->fetch_all(MYSQLI_ASSOC);
        $p['lampiran'] = $p_data;
    }




    echo createResponse('success', 'Data retrieved successfully', ['peminjaman' => $peminjaman]);
}


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    if (isset($_GET['action'])) {
        $action = $_GET['action'];

        switch ($action) {
            case "getAllByUKM":
                $singkatan = isset($_GET['abbrevation']) ? $_GET['abbrevation'] : '';
                getAllByUKM($singkatan);
                break;
            case "getById":
                $id_peminjaman = isset($_GET['id_peminjaman']) ? $_GET['id_peminjaman'] : '';
                getById($id_peminjaman);
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    } else {
        echo createResponse('error', 'Invalid request');
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['action'])) {
        $action = $data['action'];

        switch ($action) {
            case "addPeminjaman":
                $hal = isset($data['hal']) ? $data['hal'] : '';
                $tanggal = isset($data['tanggal']) ? $data['tanggal'] : '';
                $id_kegiatan = isset($data['id_kegiatan']) ? $data['id_kegiatan'] : '';
                $id_dosen = isset($data['id_dosen']) ? $data['id_dosen'] : '';
                $id_ukmormawa = isset($data['id_ukmormawa']) ? $data['id_ukmormawa'] : '';
                $id_user = isset($data['id_user']) ? $data['id_user'] : '';
                addPeminjaman($hal, $tanggal, $id_kegiatan, $id_dosen, $id_ukmormawa, $id_user);
                break;
            case "updatePeminjaman":
                // echo createResponse('error', 'Test', ['data' => $data]);
                $hal = isset($data['hal']) ? $data['hal'] : '';
                $tanggal = isset($data['tanggal']) ? $data['tanggal'] : '';
                $id_kegiatan = isset($data['id_kegiatan']) ? $data['id_kegiatan'] : '';
                $id_dosen = isset($data['id_dosen']) ? $data['id_dosen'] : '';
                $id_peminjaman = isset($data['id_peminjaman']) ? $data['id_peminjaman'] : '';
                updatePeminjaman($hal, $tanggal, $id_kegiatan, $id_dosen, $id_peminjaman);
                break;
            case "deletePeminjaman":
                $id_peminjaman = isset($data['id_peminjaman']) ? $data['id_peminjaman'] : '';
                deletePeminjaman($id_peminjaman);
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    } else {
        echo createResponse('error', 'Action not specified');
    }
} else {
    echo createResponse('error', 'Invalid request');
}

