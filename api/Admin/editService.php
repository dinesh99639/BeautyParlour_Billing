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

$userData = new stdClass();

if (isset($_POST['edit'])) {
    $sid = $_POST['sid'];
    $serviceName = $_POST['serviceName'];
    $price = $_POST['price'];

    if ($sid == 0) $query = "INSERT INTO services (`serviceName`, `price`) VALUES ('$serviceName', '$price')";
    else $query = "UPDATE services set `serviceName`='$serviceName', `price`='$price' WHERE `sid`='$sid' ";
    $res = mysqli_query($db, $query);

    if ($res) {
        $userData->error = false;
        $userData->services = Array();

        $query = "SELECT * FROM services";
        $res = mysqli_query($db, $query);

        while($row = mysqli_fetch_assoc($res)) {
            array_push($userData->services, $row);
        }
    }
    else $userData->error = true;
}

else if (isset($_POST['delete'])) {
    $sid = $_POST['sid'];

    $query = "DELETE FROM services WHERE `sid`='$sid' ";
    $res = mysqli_query($db, $query);

    if ($res) {
        $userData->error = false;
        $userData->services = Array();

        $query = "SELECT * FROM services";
        $res = mysqli_query($db, $query);

        while($row = mysqli_fetch_assoc($res)) {
            array_push($userData->services, $row);
        }
    }
    else $userData->error = true;
}

    

$json = json_encode($userData);
echo $json;

?>