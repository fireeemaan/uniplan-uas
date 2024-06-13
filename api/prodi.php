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


function getAllProdi()
{
    global $conn;
    $sql = "SELECT * FROM prodi";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['prodi' => $result]);
}


if ($_SERVER["REQUEST_METHOD"] == "GET") {

    if (isset($_GET['action'])) {
        $action = $_GET['action'];

        switch ($action) {
            case "getAllProdi":
                getAllProdi();
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    } else {
        echo createResponse('error', 'Invalid request');
    }
}