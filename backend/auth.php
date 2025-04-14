<?php
require 'connection.php';

header('Content-Type: application/json');

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided.']);
    exit;
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);
session_start();

if (!isset($_SESSION['token']) || $_SESSION['token'] !== $token) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token.']);
    exit;
}
?>
