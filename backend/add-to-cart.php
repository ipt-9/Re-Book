<?php
require 'auth.php'; // sets $user_id
require 'connection.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$listing_id = $data['listing_id'] ?? null;
$quantity = $data['quantity'] ?? 1;

if (!$listing_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing listing_id']);
    exit;
}

// check if already in cart
$stmt = $conn->prepare("SELECT cart_id FROM cart WHERE fk_user_id = ? AND fk_listing_id = ?");
$stmt->bind_param("ii", $user_id, $listing_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // update quantity
    $stmt = $conn->prepare("UPDATE cart SET quantity = quantity + ? WHERE fk_user_id = ? AND fk_listing_id = ?");
    $stmt->bind_param("iii", $quantity, $user_id, $listing_id);
} else {
    // insert new
    $stmt = $conn->prepare("INSERT INTO cart (fk_user_id, fk_listing_id, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $user_id, $listing_id, $quantity);
}
$stmt->execute();

echo json_encode(['success' => true, 'message' => 'Item added to cart']);
