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


function getAllVisitor()
{
    global $conn;

    $twoweeksago = date('Y-m-d H:i:s', strtotime('-2 weeks'));

    $sql = "SELECT time FROM visitor_log WHERE time >= '$twoweeksago' ORDER BY time ASC";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['visitor' => $result]);
}

function getAllUkmMember()
{
    global $conn;

    $sql = "SELECT u.singkatan as ukm, p.prodi FROM ukmormawa_user uu 
            JOIN ukmormawa u ON uu.id_ukmormawa = u.id
            JOIN users us ON uu.id_user = us.id
            JOIN prodi p ON us.id_prodi = p.id";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['data_member' => $result]);

}

function getAllUkmName()
{
    global $conn;

    $sql = "SELECT singkatan as ukm_name FROM ukmormawa";
    $result = $conn->query($sql);
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo createResponse('success', 'Data retrieved successfully', ['ukm' => $result]);

}


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $action = $_GET['action'];
    if (isset($action)) {
        switch ($action) {
            case 'getAllVisitor':
                getAllVisitor();
                break;
            case 'getAllUkmMember':
                getAllUkmMember();
                break;
            case 'getAllUkmName':
                getAllUkmName();
                break;
            default:
                echo createResponse('error', 'Invalid action');
                break;
        }
    } else {
        echo createResponse('error', 'Action is required');
    }
}