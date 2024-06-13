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


function getAllUser()
{
    global $conn;
    $sql = "SELECT u.id, u.nama, u.nim, p.prodi, u.no_hp, u.email 
            FROM users u 
            LEFT JOIN prodi p 
            ON u.id_prodi = p.id 
            ORDER BY u.id_prodi";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['users' => $result]);
}

function getJabatan()
{
    global $conn;
    $sql = "SELECT * FROM jabatan";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['jabatan' => $result]);
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {

    if (isset($_GET['action'])) {
        $action = $_GET['action'];

        switch ($action) {
            case "getAllUser":
                getAllUser();
                break;
            case "getJabatan":
                getJabatan();
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    } else {
        echo createResponse('error', 'Invalid request');
    }
}

