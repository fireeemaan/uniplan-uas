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

function addLampiran($id_peminjaman, $nama_barang, $jumlah, $keterangan)
{
    global $conn;
    $sql = "INSERT INTO lampiran_peminjaman 
            SET id_pengajuan = ?, nama = ?, jumlah = ?, keterangan = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('isis', $id_peminjaman, $nama_barang, $jumlah, $keterangan);
    $stmt->execute();

    echo createResponse('success', 'Lampiran berhasil diajukan');
}

function updateLampiran($id_lampiran, $nama_barang, $jumlah, $keterangan)
{
    global $conn;
    $sql = "UPDATE lampiran_peminjaman SET nama = ?, jumlah = ?, keterangan = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sisi', $nama_barang, $jumlah, $keterangan, $id_lampiran);
    $stmt->execute();

    echo createResponse('success', 'Lampiran Berhasil di Perbarui');
}

function deleteLampiran($id_lampiran)
{
    global $conn;
    $deleted_at = date('Y-m-d H:i:s');
    $sql = "UPDATE lampiran_peminjaman SET deleted_at = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $deleted_at, $id_lampiran);
    $stmt->execute();

    echo createResponse('success', 'Lampiran Berhasil di Hapus');
}

function getById($id_lampiran)
{
    global $conn;
    $sql = "SELECT * FROM lampiran_peminjaman WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_lampiran);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();

    echo createResponse('success', 'Data retrieved successfully', ['lampiran' => $result]);
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
                $id_lampiran = isset($_GET['id_lampiran']) ? $_GET['id_lampiran'] : '';
                getById($id_lampiran);
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
            case "addLampiran":
                $id_peminjaman = isset($data['id_peminjaman']) ? $data['id_peminjaman'] : '';
                $nama_barang = isset($data['nama_barang']) ? $data['nama_barang'] : '';
                $jumlah = isset($data['jumlah']) ? $data['jumlah'] : '';
                $keterangan = isset($data['keterangan']) ? $data['keterangan'] : '';
                addLampiran($id_peminjaman, $nama_barang, $jumlah, $keterangan);
                break;
            case "updateLampiran":
                $id_lampiran = isset($data['id_lampiran']) ? $data['id_lampiran'] : '';
                $nama_barang = isset($data['nama_barang']) ? $data['nama_barang'] : '';
                $jumlah = isset($data['jumlah']) ? $data['jumlah'] : '';
                $keterangan = isset($data['keterangan']) ? $data['keterangan'] : '';
                updateLampiran($id_lampiran, $nama_barang, $jumlah, $keterangan);
                break;
            case "deleteLampiran":
                $id_lampiran = isset($data['id_lampiran']) ? $data['id_lampiran'] : '';
                deleteLampiran($id_lampiran);
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

