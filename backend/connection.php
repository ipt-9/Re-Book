<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$host = "localhost"; // Your database host
$user = "root";      // Your database username
$password = "";      // Your database password
$database = "bmsd22a_rebook"; // Replace with your actual database name

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed" . $conn->connect_error]));
}
?>
