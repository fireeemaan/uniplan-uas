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


function getAll($id_user)
{
    global $conn;
    $sql_ukmormawa = "SELECT * FROM ukmormawa";
    $ukmormawa = $conn->query($sql_ukmormawa);
    $ukmormawa = $ukmormawa->fetch_all(MYSQLI_ASSOC);

    $sql_ukmormawa_user = "SELECT u.*, j.jabatan FROM ukmormawa_user uu JOIN ukmormawa u ON uu.id_ukmormawa = u.id JOIN jabatan j ON uu.id_jabatan = j.id WHERE uu.id_user = ?";
    $stmt = $conn->prepare($sql_ukmormawa_user);
    $stmt->bind_param('i', $id_user);
    $stmt->execute();
    $ukm_user = $stmt->get_result();
    $ukm_user = $ukm_user->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['ukmormawa' => $ukmormawa, 'ukm_user' => $ukm_user]);
}

function getByUser($id_user)
{
    global $conn;
    $sql = "SELECT u.* FROM ukmormawa_user uu JOIN ukmormawa u ON uu.id_ukmormawa = u.id WHERE uu.id_user = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_user);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['ukmormawa' => $result]);
}

function getAnggota($id_ukm)
{
    global $conn;
    $sql = "SELECT us.id, us.nama, us.nim, us.no_hp, us.email, j.jabatan, p.prodi FROM users us JOIN ukmormawa_user uu ON uu.id_user = us.id JOIN jabatan j ON uu.id_jabatan = j.id JOIN ukmormawa u ON uu.id_ukmormawa = u.id JOIN prodi p ON us.id_prodi = p.id WHERE u.id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_ukm);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['anggota' => $result]);
}



if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id_user = "";
    $id_ukm = "";
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        if (isset($_GET['id_user'])) {
            $id_user = $_GET['id_user'];
        }
        if (isset($_GET['id_ukm'])) {
            $id_ukm = $_GET['id_ukm'];
        }
        switch ($action) {
            case 'getAll':
                getAll($id_user);
                break;
            case 'getAnggota':
                getAnggota($id_ukm);
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    }
}