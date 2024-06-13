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

function saveRegister($username, $password, $email)
{
    global $conn;

    $sql = "INSERT INTO users SET username = ?, password = ?, email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sss', $username, $password, $email);
    $stmt->execute();


}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if ($data) {
        $username = isset($data['username']) ? $data['username'] : '';
        $password = isset($data['password']) ? $data['password'] : '';
        $email = isset($data['email']) ? $data['email'] : '';

        if (!validateInput($username) || !validateInput($password) || !validateInput($email)) {
            echo createResponse('error', 'Invalid input');
            exit;
        }

        if (empty($username) || empty($password) || empty($email)) {
            echo createResponse('error', 'Username, password, and email are required');
            exit;
        }

        $pattern = '/^(?=.*[0-9])(?=.*[A-Z]).{8,24}$/';
        if (!preg_match($pattern, $password)) {
            echo createResponse('error', 'Password must contain at least 8-24 characters length and contain 1 uppercase letter and number.');
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        echo createResponse('success', 'Register success');

        saveRegister($username, $hashedPassword, $email);

    } else {
        echo createResponse('error', 'Register failed');
    }

}