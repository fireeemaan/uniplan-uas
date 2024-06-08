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


function getAllByUKM($id_ukmormawa)
{
    global $conn;
    $sql = "SELECT p.id, p.hal, p.tanggal, p.isi_surat, u.nama as nama_ukm, k.nama_kegiatan, k.tanggal, k.tempat, k.start, k.end, p.deleted_at  FROM pengajuan_peminjaman p JOIN kegiatan k ON k.id = p.id_kegiatan JOIN dosen d ON d.id = p.id_dosen JOIN ukmormawa u ON p.id_ukmormawa = u.id WHERE p.id_ukmormawa = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_ukmormawa);
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
    createResponse('success', 'Test');

    if (isset($_GET['action'])) {
        $action = $_GET['action'];

        switch ($action) {
            case "getAllByUKM":
                $id_ukm = isset($_GET['id_ukmormawa']) ? $_GET['id_ukmormawa'] : '';
                getAllByUKM($id_ukm);
                break;
        }
    } else {
        echo createResponse('error', 'Invalid request');
    }

} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
    createResponse('success', 'Peminjaman berhasil diajukan');
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
            default:
                echo createResponse('error', 'Invalid action');
        }
    } else {
        echo createResponse('error', 'Action not specified');
    }
} else {
    echo createResponse('error', 'Invalid request');
}

