<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'auth.php';
require 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

$data = json_decode(file_get_contents("php://input"), true);
$listing_id = $data['listing_id'] ?? null;

// Check for user_id from auth
if (!isset($user_id)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if (!$listing_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing listing_id']);
    exit;
}

// Optional: check if listing exists before inserting
$stmt = $conn->prepare("SELECT listing_id FROM listings WHERE listing_id = ?");
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Listing does not exist']);
    exit;
}

// Check if already in cart
$stmt = $conn->prepare("SELECT cart_id FROM cart WHERE fk_user_id = ? AND fk_listing_id = ?");
$stmt->bind_param("ii", $user_id, $listing_id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Item already in cart']);
    exit;
}

// Add to cart
$stmt = $conn->prepare("INSERT INTO cart (fk_user_id, fk_listing_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $listing_id);

try {
    $stmt->execute();
    if (ob_get_length()) ob_clean(); // prevent hidden characters
    echo json_encode(['success' => true, 'message' => 'Item added to cart']);
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
