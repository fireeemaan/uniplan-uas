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

function validateUsername($username)
{
    global $conn;
    $sql = "SELECT * FROM credentials WHERE username = '$username'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        return false;
    }
    return true;
}

function validateNIM($nim)
{
    global $conn;
    $sql = "SELECT * FROM users WHERE nim = '$nim'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        return false;
    }
    return true;

}

function saveRegister($nama, $nim, $no_hp, $username, $password, $email)
{
    global $conn;

    $created_at = date('Y-m-d H:i:s');

    $sql_users = "INSERT INTO users SET nama = ?, nim = ?, no_hp = ?, email = ?, id_roles = 1, created_at = ?;";
    $stmt_users = $conn->prepare($sql_users);
    $stmt_users->bind_param('sssss', $nama, $nim, $no_hp, $email, $created_at);
    $stmt_users->execute();

    $id_user = $conn->insert_id;

    $sql_cred = "INSERT INTO credentials SET username = ?, password = ?, id_user = ?;";
    $stmt_cred = $conn->prepare($sql_cred);
    $stmt_cred->bind_param('ssi', $username, $password, $id_user);
    $stmt_cred->execute();

}


function login()
{
    global $conn;
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

        $sql = "SELECT * FROM credentials WHERE username = '$username'";
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
                $_SESSION['credentials'] = $result;


                $id_user = $result['id_user'];

                $sql = "SELECT * FROM users WHERE id = '$id_user'";
                $userData = $conn->query($sql);
                $userData = $userData->fetch_assoc();

                echo createResponse('success', 'Login success', ['credentials' => $result, 'userData' => $userData]);
            } else {
                echo createResponse('error', 'Username or password is incorrect');
            }
        } else {
            return false;
        }
    }
}


function register()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $data = json_decode(file_get_contents('php://input'), true);


        if ($data) {
            $name = isset($data['name']) ? $data['name'] : '';
            $nim = isset($data['nim']) ? $data['nim'] : '';
            $no_hp = isset($data['phone']) ? $data['phone'] : '';
            $username = isset($data['username']) ? $data['username'] : '';
            $password = isset($data['password']) ? $data['password'] : '';
            $email = isset($data['email']) ? $data['email'] : '';

            if (!validateInput($username) || !validateInput($password) || !validateInput($email) || !validateInput($name) || !validateInput($nim) || !validateInput($no_hp)) {
                echo createResponse('error', 'Invalid input');
                exit;
            }

            if (empty($username) || empty($password) || empty($email) || empty($name) || empty($nim) || empty($no_hp)) {
                echo createResponse('error', 'Username, password, and email are required');
                exit;
            }

            $pattern = '/^(?=.*[0-9])(?=.*[A-Z]).{8,24}$/';
            if (!preg_match($pattern, $password)) {
                echo createResponse('error', 'Password must contain at least 8-24 characters length and contain 1 uppercase letter and number.');
                exit;
            }

            if (!validateUsername($username)) {
                echo createResponse('error', 'Username already exists');
                exit;
            }

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);


            echo createResponse('success', 'Register success');
            saveRegister($name, $nim, $no_hp, $username, $hashedPassword, $email);

        } else {
            echo createResponse('error', 'Register failed');
        }

    }
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['action'])) {
        $action = $data['action'];

        switch ($action) {
            case 'login':
                login();
                break;
            case 'register':
                register();
                break;
            default:
                echo createResponse('error', 'Invalid action');
        }
    }
}