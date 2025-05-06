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
$quantity = $data['quantity'] ?? 1;

if (!$listing_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing listing_id']);
    exit;
}

$stmt = $conn->prepare("SELECT cart_id FROM cart WHERE fk_user_id = ? AND fk_listing_id = ?");
$stmt->bind_param("ii", $user_id, $listing_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $stmt = $conn->prepare("UPDATE cart SET quantity = quantity + ? WHERE fk_user_id = ? AND fk_listing_id = ?");
    $stmt->bind_param("iii", $quantity, $user_id, $listing_id);
} else {
    $stmt = $conn->prepare("INSERT INTO cart (fk_user_id, fk_listing_id, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $user_id, $listing_id, $quantity);
}
$stmt->execute();

if (ob_get_length()) ob_clean(); // prevent hidden characters
echo json_encode(['success' => true, 'message' => 'Item added to cart']);
