<?php
require 'connection.php';
header('Content-Type: application/json');

$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided.']);
    exit;
}

$token = str_replace('Bearer ', '', $headers['Authorization']);

$stmt = $conn->prepare("SELECT user_id FROM users WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token.']);
    exit;
}

$user_id = $user['user_id'];

$stmt = $conn->prepare("SELECT user_id, username, email, school, region FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$userData = $result->fetch_assoc();

echo json_encode(['success' => true, 'user' => $userData]);
