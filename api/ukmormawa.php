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

function getAllUKM()
{
    global $conn;
    $sql = "SELECT * FROM ukmormawa ORDER BY nama";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['ukmormawa' => $result]);
}


function getAll($id_user)
{
    global $conn;
    $sql_ukmormawa = "SELECT * FROM ukmormawa";
    $ukmormawa = $conn->query($sql_ukmormawa);
    $ukmormawa = $ukmormawa->fetch_all(MYSQLI_ASSOC);

    $sql_ukmormawa_user = "SELECT u.*, j.jabatan FROM ukmormawa_user uu LEFT JOIN ukmormawa u ON uu.id_ukmormawa = u.id JOIN jabatan j ON uu.id_jabatan = j.id WHERE uu.id_user = ?";
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
    $sql = "SELECT uu.id, u.nama, j.jabatan 
            FROM ukmormawa_user uu 
            JOIN ukmormawa u ON uu.id_ukmormawa = u.id 
            JOIN jabatan j ON uu.id_jabatan = j.id 
            WHERE uu.id_user = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_user);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_all(MYSQLI_ASSOC);

    $sql_user = "SELECT us.*, p.prodi FROM users us JOIN prodi p on us.id_prodi = p.id WHERE us.id = ?";
    $stmt_user = $conn->prepare($sql_user);
    $stmt_user->bind_param('i', $id_user);
    $stmt_user->execute();
    $user = $stmt_user->get_result();
    $user = $user->fetch_assoc();

    echo createResponse('success', 'Data retrieved successfully', ['user' => $user, 'ukmormawa' => $result]);
}

function getAnggotaByUKMName($ukm_name)
{
    global $conn;
    $sql = "SELECT us.id, us.nama, us.nim, us.no_hp, us.email, j.jabatan, p.prodi FROM users us JOIN ukmormawa_user uu ON uu.id_user = us.id JOIN jabatan j ON uu.id_jabatan = j.id JOIN ukmormawa u ON uu.id_ukmormawa = u.id LEFT JOIN prodi p ON us.id_prodi = p.id WHERE u.singkatan = ? ORDER BY j.jabatan DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $ukm_name);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['anggota' => $result]);
}

function getUkmormawaUserById($id_ukmormawauser)
{
    global $conn;
    $sql = "SELECT uu.*, u.nama, j.jabatan FROM ukmormawa_user uu 
            JOIN ukmormawa u ON uu.id_ukmormawa = u.id 
            JOIN jabatan j ON uu.id_jabatan = j.id WHERE uu.id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_ukmormawauser);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();

    echo createResponse('success', 'Data retrieved successfully', ['ukmormawa_user' => $result]);
}
function checkMembership($id_user, $id_ukmormawa)
{
    global $conn;
    $sql = "SELECT * FROM ukmormawa_user WHERE id_user = ? AND id_ukmormawa = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_user, $id_ukmormawa);
    $stmt->execute();
    $result = $stmt->get_result();
    $result = $result->fetch_assoc();

    if ($result) {
        return true;
    } else {
        return false;
    }
}


function addUkmormawaUser($id_user, $id_ukmormawa, $id_jabatan)
{
    try {
        global $conn;

        if (checkMembership($id_user, $id_ukmormawa)) {
            echo createResponse('error', 'User already a member of this UKM/Mormawa');
            return;
        }

        $sql = "INSERT INTO ukmormawa_user SET id_user = ?, id_ukmormawa = ?, id_jabatan = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('iii', $id_user, $id_ukmormawa, $id_jabatan);
        $stmt->execute();

        echo createResponse('success', 'Data added successfully');
    } catch (Exception $e) {
        echo createResponse('error', $e->getMessage());
    }
}

function deleteUkmormawauser($id_ukmormawauser)
{
    global $conn;
    $sql = "DELETE FROM ukmormawa_user WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_ukmormawauser);
    $stmt->execute();

    echo createResponse('success', 'Data deleted successfully');
}


function updateUkmormawaUser($id, $id_user, $id_ukmormawa, $id_jabatan)
{
    try {
        global $conn;
        $sql = "UPDATE ukmormawa_user SET id_user = ?, id_ukmormawa = ?, id_jabatan = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('iiii', $id_user, $id_ukmormawa, $id_jabatan, $id);
        $stmt->execute();

        echo createResponse('success', 'Data updated successfully');
    } catch (Exception $e) {
        echo createResponse('error', $e->getMessage());
    }


}



if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'getAll':
                $id_user = $_GET['id_user'];
                getAll($id_user);
                break;
            case 'getAnggota':
                $ukm_name = $_GET['ukm_name'];
                getAnggotaByUKMName($ukm_name);
                break;
            case 'getAllUKM':
                getAllUKM();
                break;
            case 'getByUser':
                $id_user = $_GET['id_user'];
                getByUser($id_user);
                break;
            case 'getUkmormawaUserById':
                $id_ukmormawauser = $_GET['id_ukmormawauser'];
                getUkmormawaUserById($id_ukmormawauser);
                break;
            case 'deleteUkmormawaUser':
                $id_ukmormawauser = $_GET['id_ukmormawauser'];
                deleteUkmormawauser($id_ukmormawauser);
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
            case 'addUkmormawaUser':
                $id_user = $data['id_user'];
                $id_ukmormawa = $data['id_ukmormawa'];
                $id_jabatan = $data['id_jabatan'];
                addUkmormawaUser($id_user, $id_ukmormawa, $id_jabatan);
                break;
            case 'updateUkmormawaUser':
                $id = $data['id_ukmormawauser'];
                $id_user = $data['id_user'];
                $id_ukmormawa = $data['id_ukmormawa'];
                $id_jabatan = $data['id_jabatan'];
                updateUkmormawaUser($id, $id_user, $id_ukmormawa, $id_jabatan);
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    }
}