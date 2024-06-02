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


function addJadwal()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        if ($data) {
            $id_ukmormawa = isset($data['id_ukmormawa']) ? $data['id_ukmormawa'] : '';
            $nama_kegiatan = isset($data['namaKegiatan']) ? $data['namaKegiatan'] : '';
            $tanggal = isset($data['tanggal']) ? $data['tanggal'] : '';
            $waktu_mulai = isset($data['waktuMulai']) ? $data['waktuMulai'] : '';
            $waktu_selesai = isset($data['waktuSelesai']) ? $data['waktuSelesai'] : '';
            $tempat = isset($data['tempat']) ? $data['tempat'] : '';
            $deskripsi = isset($data['deskripsi']) ? $data['deskripsi'] : '';
            $created_by = isset($data['id_user']) ? $data['id_user'] : '';

            echo createResponse('success', 'Data added successfully');
            saveJadwal($id_ukmormawa, $nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $created_by);
        } else {
            echo createResponse('error', 'Invalid input');
        }
    }



    // global $conn;
    // $id_ukmormawa = $_POST['id_ukmormawa'];
    // $nama_kegiatan = $_POST['namaKegiatan'];
    // $tanggal = $_POST['tanggal'];
    // $waktu_mulai = $_POST['waktuMulai'];
    // $waktu_selesai = $_POST['waktuSelesai'];
    // $tempat = $_POST['tempat'];
    // $deskripsi = $_POST['deskripsi'];
    // $created_by = $_POST['id_user'];

    // $sql = "INSERT INTO kegiatan (id_ukmormawa, nama_kegiatan, tanggal, start, end, tempat, deskripsi, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    // $stmt = $conn->prepare($sql);
    // $stmt->bind_param('issssssi', $id_ukmormawa, $nama_kegiatan, $tanggal, $waktu_mulai, $waktu_selesai, $tempat, $deskripsi, $created_by);
    // $stmt->execute();

    // if ($stmt->execute()) {
    //     echo createResponse('success', 'Data added successfully');
    // } else {
    //     echo createResponse('error', 'Failed to add data');
    // }

}



if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        $ukmName = $_GET['ukmName'];
        switch ($action) {
            case 'getByName':
                getByName($ukmName);
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
            default:
                echo createResponse('error', 'Invalid action');
        }
    }
} else {
    echo createResponse('error', 'Invalid request method');
}

// echo createResponse('error', 'Invalid request method', ['method' => $_SERVER['REQUEST_METHOD']]);
