<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost:3306"; // Change if needed
$username = "Rebook";
$password = "U1sOja2bgN7&opq?";
$database = "BMSD22a_ReBook";

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT * FROM users";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();
?>

