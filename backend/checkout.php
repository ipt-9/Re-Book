<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connection.php';
require 'auth.php'; // Sets $user_id

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

// Step 1: Read and validate card input
$data = json_decode(file_get_contents("php://input"), true);
$card = $data['card'] ?? null;

if (
    !$card || empty($card['name']) || empty($card['number']) ||
    empty($card['expiry']) || empty($card['cvv']) ||
    !preg_match('/^[0-9]{16}$/', str_replace(' ', '', $card['number'])) ||
    !preg_match('/^[0-9]{3}$/', $card['cvv']) ||
    !preg_match('/^(0[1-9]|1[0-2])\/[0-9]{2}$/', $card['expiry'])
) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid card input']);
    exit;
}

// Step 2: Get cart listings and total
$stmt = $conn->prepare("
    SELECT l.listing_id, p.price
    FROM orders o
    JOIN cart c ON o.fk_cart_id = c.cart_id
    JOIN listings l ON c.fk_listing_id = l.listing_id
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE o.fk_user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$listings = [];
$total_price = 0;

while ($row = $result->fetch_assoc()) {
    $listings[] = $row['listing_id'];
    $total_price += (float) $row['price'];
}
$stmt->close();

// Step 3: Mark listings as sold
if (!empty($listings)) {
    $placeholders = implode(',', array_fill(0, count($listings), '?'));
    $types = str_repeat('i', count($listings));

    $stmt = $conn->prepare("UPDATE listings SET status = 'Sold' WHERE listing_id IN ($placeholders)");
    $stmt->bind_param($types, ...$listings);
    $stmt->execute();
    $stmt->close();
}

echo json_encode([
    'success' => true,
    'message' => 'Checkout complete',
    'total_price' => number_format($total_price, 2)
]);
