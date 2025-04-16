<?php
require 'connection.php';
header('Content-Type: application/json');

$headers = array_change_key_case(getallheaders(), CASE_LOWER);


if (!isset($headers['authorization'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided.']);
    exit;
}

$token = str_replace('Bearer ', '', $headers['authorization']);

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
