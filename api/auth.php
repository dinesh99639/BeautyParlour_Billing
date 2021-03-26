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

require("db.php");

$_POST = json_decode(file_get_contents("php://input"),true);

if (isset($_POST['login'])) {
	$username = mysqli_escape_string($db,$_POST['username']);
	$password = mysqli_escape_string($db,$_POST['password']);
	$password = md5(sha1(crypt($password,10)));

	$query = "SELECT * FROM users where username='$username' and password='$password'";
	$res = mysqli_query($db, $query);

	if ($res->num_rows)
    {
		$row = mysqli_fetch_assoc($res);

		unset($row['password']);

    	$_SESSION['userid'] = $row['userid'];
    	$_SESSION['usertype'] = $row['usertype'];

        $userData = new stdClass();

		$userData->error = false;
		$userData->status = "Login success";
		$userData->session = session_id();
		$userData->data = $row;

        $json = json_encode($userData);
        echo $json;
    }
    else {
		$userData = new stdClass();
		
		$userData->error = true;
		$userData->status = "Login failed, invalid credentials";

        $json = json_encode($userData);
        echo $json;
    }
}


?>