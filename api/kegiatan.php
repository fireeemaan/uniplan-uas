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

function validateInput($input)
{

    if (preg_match('/<script\b[^>]*>(.*?)<\/script>/is', $input)) {
        return false;
    }


    if (preg_match('/<[^>]*>/', $input)) {
        return false;
    }

    return true;
}


function isDeleted($id_kegiatan)
{
    global $conn;
    $sql = "SELECT * FROM kegiatan WHERE id = ? AND deleted_at IS NOT NULL";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_kegiatan);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        return true;
    } else {
        return false;
    }
}

function getById($id)
{
    global $conn;
    $sql = "SELECT * FROM kegiatan WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();

    if ($result) {
        if (isDeleted($id)) {
            echo createResponse('error', 'Data not found');
        } else {
            echo createResponse('success', 'Data retrieved successfully', ['kegiatan' => $result]);
        }
    } else {
        echo createResponse('error', 'Data not found');
    }
}


function getByName($ukmName)
{
    global $conn;
    $sql = "SELECT k.* FROM kegiatan k JOIN ukmormawa u ON k.id_ukmormawa = u.id WHERE u.singkatan = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $ukmName);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['jadwal' => $result]);
}

function saveJadwal($id_ukmormawa, $nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $created_by)
{
    global $conn;

    $sql = "INSERT INTO kegiatan (id_ukmormawa, nama_kegiatan, tanggal, start, end, tempat, deskripsi, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('issssssi', $id_ukmormawa, $nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $created_by);

    if ($stmt->execute()) {
        echo createResponse('success', 'Data added successfully');
    } else {
        echo createResponse('error', 'Failed to add data');
    }
}

function putJadwal($nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $id_kegiatan)
{
    global $conn;

    $sql = "UPDATE kegiatan SET nama_kegiatan = ?, tanggal = ?, start = ?, end = ?, tempat = ?, deskripsi = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssi', $nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $id_kegiatan);

    if ($stmt->execute()) {
        echo createResponse('success', 'Data updated successfully');
    } else {
        echo createResponse('error', 'Failed to add data');
    }
}


function addJadwal()
{

    $data = json_decode(file_get_contents('php://input'), true);

    if ($data) {
        $id_ukmormawa = isset($data['id_ukmormawa']) ? $data['id_ukmormawa'] : '';
        $nama_kegiatan = isset($data['namaKegiatan']) ? $data['namaKegiatan'] : '';
        $tanggal = isset($data['tanggal']) ? $data['tanggal'] : '';
        $waktu_mulai = isset($data['waktuMulai']) ? $data['waktuMulai'] : '';
        $waktu_selesai = isset($data['waktuSelesai']) ? $data['waktuSelesai'] : null;
        $tempat = isset($data['tempat']) ? $data['tempat'] : '';
        $deskripsi = isset($data['deskripsi']) ? $data['deskripsi'] : '';
        $created_by = isset($data['id_user']) ? $data['id_user'] : '';

        saveJadwal($id_ukmormawa, $nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $created_by);
        // echo createResponse('success', 'Data added successfully');
        // echo createResponse('success', 'Data sended', ['data' => $data]);
    } else {
        echo createResponse('error', 'Invalid input');
    }

}

function updateJadwal()
{
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data) {
        $nama_kegiatan = isset($data['namaKegiatan']) ? $data['namaKegiatan'] : '';
        $tanggal = isset($data['tanggal']) ? $data['tanggal'] : '';
        $waktu_mulai = isset($data['waktuMulai']) ? $data['waktuMulai'] : '';
        $waktu_selesai = isset($data['waktuSelesai']) ? $data['waktuSelesai'] : '';
        $tempat = isset($data['tempat']) ? $data['tempat'] : '';
        $deskripsi = isset($data['deskripsi']) ? $data['deskripsi'] : '';
        $id_kegiatan = isset($data['id_kegiatan']) ? $data['id_kegiatan'] : '';

        putJadwal($nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $id_kegiatan);
        // echo createResponse('success', 'Data added successfully', ['data' => $data]);

    } else {
        echo createResponse('error', 'Invalid input');
    }

}

function deleteJadwal($id_kegiatan)
{
    $data = json_decode(file_get_contents('php://input'), true);


    $deleted_at = date('Y-m-d H:i:s');

    global $conn;
    $sql = "UPDATE kegiatan SET deleted_at = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $deleted_at, $id_kegiatan);

    if ($stmt->execute()) {
        echo createResponse('success', 'Data deleted successfully');
    } else {
        echo createResponse('error', 'Failed to delete data');
    }





}



if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'getByName':
                $ukmName = $_GET['ukmName'];
                getByName($ukmName);
                break;
            case 'getById':
                $id = $_GET['id_kegiatan'];
                getById($id);
                break;
            case 'deleteJadwal':
                $id_kegiatan = $_GET['id_kegiatan'];
                deleteJadwal($id_kegiatan);
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['action'])) {
        $action = $data['action'];
        switch ($action) {
            case 'addJadwal':
                addJadwal();
                break;
            case 'updateJadwal':
                updateJadwal();
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    }
} else {
    echo createResponse('error', 'Invalid request method');
}

// echo createResponse('error', 'Invalid request method', ['method' => $_SERVER['REQUEST_METHOD']]);
