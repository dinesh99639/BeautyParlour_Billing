<?php

session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 1000');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
    }
    exit(0);
}

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: GET, POST');
// header("Access-Control-Allow-Headers: X-Requested-With");

require("../db.php");

$_POST = json_decode(file_get_contents("php://input"),true);

$name = $_POST['name'];
$phone = $_POST['phone'];
$servicesObtained = $_POST['services'];
$total = $_POST['total'];

$query = "INSERT INTO receipts (`name`, `phone`, `servicesObtained`, `total`) VALUES ('$name', '$phone', '$servicesObtained', '$total')";
$res = mysqli_query($db, $query);

$userData = new stdClass();

if ($res) {
    $userData->error = false;
}
else {
    $userData->error = true;
}

$json = json_encode($userData);
echo $json;

?>