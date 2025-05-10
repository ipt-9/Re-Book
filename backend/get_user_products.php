<?php
// Enable debugging in development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connection.php';
header('Content-Type: application/json; charset=utf-8');

// Get Authorization header (case-insensitive)
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
$authHeader = $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;

if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No or invalid token provided']);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);

// Step 1: Get user ID from token
$stmt = $conn->prepare("SELECT user_id FROM users WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

$user_id = $user['user_id'];

// Step 2: Fetch advertised products
$stmt = $conn->prepare("
    SELECT p.*, l.status, l.listing_id
    FROM listings l
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE l.fk_user_id = ? AND l.status = 'Available'
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$advertised = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

// Step 3: Fetch sold products
$stmt = $conn->prepare("
    SELECT p.*, l.status, l.listing_id
    FROM listings l
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE l.fk_user_id = ? AND l.status = 'Sold'
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$sold = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();

/*
// Step 4: Fetch bought products
$stmt = $conn->prepare("
    SELECT p.*, l.listing_condition, l.status, l.listing_id
    FROM orders o
    JOIN cart c ON o.fk_cart_id = c.cart_id
    JOIN listings l ON c.fk_listing_id = l.listing_id
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE o.fk_user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$bought = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
$stmt->close();
*/

// Step 5: Return response
echo json_encode([
    'success' => true,
    'data' => [
        'advertised' => $advertised,
        'sold' => $sold,
        //'bought' => $bought
    ]
]);
