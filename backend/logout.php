<?php
ob_clean();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

require 'connection.php';
require 'auth.php';

error_log("User ID: " . ($user_id ?? 'not set'));

$stmt = $conn->prepare("UPDATE users SET token = NULL WHERE user_id = ?");
$stmt->bind_param("i", $user_id);


if ($stmt->execute()) {
    http_response_code(200);
    echo "Logged out successfully";
} else {
    http_response_code(500);
    echo "Logged out failed";
}
