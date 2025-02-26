<?php
// Error reporting (for debugging purposes)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Allow cross-origin requests (CORS) for APIs
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


// Database credentials
$host = "localhost"; // Your database host
$user = "root";      // Your database username
$password = "";      // Your database password
$database = "rebookdb"; // Replace with your actual database name

// Create a connection to the database
$conn = new mysqli($host, $user, $password, $database);

// Check if the connection was successful
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed" . $conn->connect_error]));
}
?>
