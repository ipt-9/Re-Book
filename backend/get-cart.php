<?php
// Immer ganz oben, um BOM / Leerzeichen zu verhindern
if (ob_get_length()) ob_clean();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'auth.php';
require 'connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    exit(0);
}

if (!isset($user_id)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized'
    ]);
    exit;
}

$stmt = $conn->prepare("
    SELECT
        c.cart_id,
        c.quantity,
        p.title,
        p.author,
        p.price,
        p.image,
        l.listing_id
    FROM cart c
    JOIN listings l ON c.fk_listing_id = l.listing_id
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE c.fk_user_id = ?
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Prepare failed: ' . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $cart = [];

    while ($row = $result->fetch_assoc()) {
        $cart[] = $row;
    }

    http_response_code(200);
    if (ob_get_length()) ob_clean(); // wichtig!

    echo json_encode([
        'success' => true,
        'message' => 'Cart data loaded successfully',
        'data' => $cart
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Execute failed: ' . $stmt->error
    ]);
}
exit;
