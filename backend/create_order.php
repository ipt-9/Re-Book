<?php
require 'auth.php';
require 'connection.php';

header('Content-Type: application/json');

// Step 1: Calculate total price of all listings in user's cart
$stmt = $conn->prepare("
    SELECT SUM(p.price) AS total
    FROM cart c
    JOIN listings l ON c.fk_listing_id = l.listing_id
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE c.fk_user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$total_price = $row['total'] ?? 0;
$stmt->close();

if ($total_price <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Cart is empty or price error']);
    exit;
}

// Step 2: Insert ONE order with full total
$stmt = $conn->prepare("INSERT INTO orders (fk_user_id, total_price, status) VALUES (?, ?, 'Not Paid')");
$stmt->bind_param("id", $user_id, $total_price);
$stmt->execute();
$order_id = $stmt->insert_id;
$stmt->close();

if (ob_get_length()) ob_clean(); // prevent hidden characters
echo json_encode([
    'success' => true,
    'message' => 'Order created',
    'order_id' => $order_id,
    'total_price' => number_format($total_price, 2)
]);
