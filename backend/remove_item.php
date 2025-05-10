<?php
// Debug settings (disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

$data = json_decode(file_get_contents("php://input"), true);
$listing_id = $data['listing_id'] ?? null;

if (!$listing_id) {
    http_response_code(400);
    echo json_encode(['error' => 'listing_id is required']);
    exit;
}

// Step 1: Find related cart_id
$stmt = $conn->prepare("SELECT cart_id FROM cart WHERE fk_listing_id = ?");
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$result = $stmt->get_result();
$cart = $result->fetch_assoc();
$stmt->close();

// Step 2: If a cart entry exists, delete its orders first
if ($cart) {
    $cart_id = $cart['cart_id'];

    $stmt = $conn->prepare("DELETE FROM orders WHERE fk_cart_id = ?");
    $stmt->bind_param("i", $cart_id);
    $stmt->execute();
    $stmt->close();
}

// Step 3: Now safely delete from cart
$stmt = $conn->prepare("DELETE FROM cart WHERE fk_listing_id = ?");
$stmt->bind_param("i", $listing_id);
$success = $stmt->execute();
$stmt->close();

$conn->close();

if ($success) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete item from cart']);
}
