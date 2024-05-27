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

function getAll()
{
    global $conn;
    $sql = "SELECT * FROM ukmormawa";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['ukmormawa' => $result]);
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



if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];
        switch ($action) {
            case 'getAll':
                getAll();
                break;
            case 'getByUser':
                // echo createResponse('error', 'Invalid action');
                getByUser($_GET['id_user']);
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    } else {
        echo createResponse('error', 'Invalid action', ['test' => $_GET]);
    }
}