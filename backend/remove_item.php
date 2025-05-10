<?php
// Debug settings (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

// Read input JSON
$data = json_decode(file_get_contents("php://input"), true);
$listing_id = $data['listing_id'] ?? null;

if (!$listing_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'listing_id is required']);
    exit;
}

// ✅ Delete from cart directly
$stmt = $conn->prepare("DELETE FROM cart WHERE fk_listing_id = ?");
$stmt->bind_param("i", $listing_id);
$success = $stmt->execute();
$stmt->close();

$conn->close();

if ($success) {
    if (ob_get_length()) ob_clean(); // prevent hidden characters
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to delete item from cart']);
}
