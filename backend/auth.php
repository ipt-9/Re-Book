<?php
require 'connection.php';
header('Content-Type: application/json');

// Get the Authorization header
$headers = getallheaders();

$token = null;

// Check if token exists in Authorization header
if (isset($headers['Authorization'])) {
    if (str_starts_with($headers['Authorization'], 'Bearer ')) {
        $token = substr($headers['Authorization'], 7); // remove "Bearer "
    } else {
        // Fallback: treat the entire header as token (not ideal, but flexible)
        $token = $headers['Authorization'];
    }
}

// Reject if no token found
if (!$token) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'No token provided.'
    ]);
    exit;
}

// Query the database to validate token
$stmt = $conn->prepare("SELECT user_id, username, email FROM users WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// If no user found, token is invalid or expired
if (!$user) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid or expired token.'
    ]);
    exit;
}

// Token is valid → user data is available
$user_id = $user['user_id'];
$username = $user['username'];
$email = $user['email'];
