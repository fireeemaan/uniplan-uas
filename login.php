<?php

require_once '../config/dbconfig.php';
require_once '../config/request_config.php';

header('Access-Control-Allow-Origin: *');


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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = isset($data['username']) ? $data['username'] : '';
    $password = isset($data['password']) ? $data['password'] : '';

    if (!$data || empty($data['username']) || empty($data['password'])) {
        echo createResponse('error', 'Username and password are required');
        exit;
    }

    if (!validateInput($username) || !validateInput($password)) {

        echo createResponse('error', 'Invalid input');
        exit;
    }

    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows == 0) {
        echo createResponse('error', 'Your username is not registered yet');
        exit;
    }
    if ($result = $result->fetch_assoc()) {
        $hashedPassword = $result['password'];
        $verify = password_verify($password, $hashedPassword);
        if ($verify) {
            session_start();
            $_SESSION['user'] = $result;
            echo createResponse('success', 'Login success', ['user' => $result]);
        } else {
            echo createResponse('error', 'Username or password is incorrect');
        }
    } else {
        return false;
    }
}