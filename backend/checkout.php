<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'auth.php'; // sets $user_id
require 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

// Step 1: Validate card input
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

// Step 2: Get latest "Not Paid" order
$stmt = $conn->prepare("SELECT order_id, total_price FROM orders WHERE fk_user_id = ? AND status = 'Not Paid' ORDER BY order_id DESC LIMIT 1");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();
$stmt->close();

if (!$order) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'No unpaid order found']);
    exit;
}

$order_id = $order['order_id'];
$total_price = $order['total_price'];

// Step 3: Get listing_ids from user's cart
$stmt = $conn->prepare("SELECT fk_listing_id FROM cart WHERE fk_user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$listing_ids = [];
while ($row = $result->fetch_assoc()) {
    $listing_ids[] = $row['fk_listing_id'];
}
$stmt->close();

// Step 4: Update listings to 'Sold'
if (!empty($listing_ids)) {
    $placeholders = implode(',', array_fill(0, count($listing_ids), '?'));
    $types = str_repeat('i', count($listing_ids));
    $stmt = $conn->prepare("UPDATE listings SET status = 'Sold' WHERE listing_id IN ($placeholders)");
    $stmt->bind_param($types, ...$listing_ids);
    $stmt->execute();
    $stmt->close();
}

// Step 5: Mark the order as Paid
$stmt = $conn->prepare("UPDATE orders SET status = 'Paid' WHERE order_id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$stmt->close();

// Step 6: Delete cart entries for this user
$stmt = $conn->prepare("DELETE FROM cart WHERE fk_user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->close();

// ✅ Done
if (ob_get_length()) ob_clean(); // prevent hidden characters
echo json_encode([
    'success' => true,
    'message' => 'Checkout complete. Order paid and listings marked as sold.',
    'total_price' => number_format($total_price, 2)
]);
