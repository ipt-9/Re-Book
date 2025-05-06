<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'auth.php';
require 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

error_log("User ID: " . ($user_id ?? 'not set'));

$stmt = $conn->prepare("UPDATE users SET token = NULL WHERE user_id = ?");
$stmt->bind_param("i", $user_id);


if ($stmt->execute()) {
    http_response_code(200);
    if (ob_get_length()) ob_clean();  // important
    echo json_encode(['success' => true, 'message' => 'Item added to cart']);
} else {
    http_response_code(500);
    echo "Logged out failed";
}


