<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'auth.php';
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

// Step 1: Get product_id (even if not in cart)
$stmt = $conn->prepare("SELECT fk_product_id FROM listings WHERE listing_id = ?");
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stmt->close();

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Listing not found']);
    exit;
}

$product_id = $row['fk_product_id'];

// Step 2: Get cart_id if exists
$cart_id = null;
$stmt = $conn->prepare("SELECT cart_id FROM cart WHERE fk_listing_id = ?");
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$result = $stmt->get_result();
if ($cart = $result->fetch_assoc()) {
    $cart_id = $cart['cart_id'];
}
$stmt->close();

// Step 3: Delete from orders if cart_id exists
if ($cart_id) {
    $stmt = $conn->prepare("DELETE FROM orders WHERE fk_cart_id = ?");
    $stmt->bind_param("i", $cart_id);
    $stmt->execute();
    $stmt->close();
}

// Step 4: Delete from cart (if exists)
$stmt = $conn->prepare("DELETE FROM cart WHERE fk_listing_id = ?");
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$stmt->close();

// Step 5: Delete from favorite (if exists)
$stmt = $conn->prepare("DELETE FROM favorite WHERE fk_listing_id = ?");
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$stmt->close();

// Step 6: Delete from listings
$stmt = $conn->prepare("DELETE FROM listings WHERE listing_id = ?");
$stmt->bind_param("i", $listing_id);
$stmt->execute();
$stmt->close();

// Step 7: Delete from products
$stmt = $conn->prepare("DELETE FROM products WHERE product_id = ?");
$stmt->bind_param("i", $product_id);
$stmt->execute();
$stmt->close();

echo json_encode(['success' => true]);
