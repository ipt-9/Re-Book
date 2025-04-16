<?php
require 'connection.php';
header('Content-Type: application/json');

$headers = array_change_key_case(getallheaders(), CASE_LOWER);
$authHeader = $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? null);

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided']);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);

// Nutzer anhand Token holen
$stmt = $conn->prepare("SELECT user_id FROM users WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

$user_id = $user['user_id'];

// 📦 Advertised Products (status = 'Available')
$stmt = $conn->prepare("
    SELECT p.*, l.listing_condition, l.status
    FROM listings l
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE l.fk_user_id = ? AND l.status = 'Available'
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$advertised = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ✅ Sold Products (status = 'Sold')
$stmt = $conn->prepare("
    SELECT p.*, l.listing_condition, l.status
    FROM listings l
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE l.fk_user_id = ? AND l.status = 'Sold'
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$sold = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// 🛒 Bought Products über cart → listings → products
$stmt = $conn->prepare("
    SELECT p.*, l.listing_condition, l.status
    FROM orders o
    JOIN cart c ON o.fk_cart_id = c.cart_id
    JOIN listings l ON c.fk_listing_id = l.listing_id
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE o.fk_user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$bought = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ✅ Rückgabe
echo json_encode([
    'success' => true,
    'data' => [
        'advertised' => $advertised,
        'sold' => $sold,
        'bought' => $bought
    ]
]);
?>
