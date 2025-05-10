<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require 'auth.php'; // sets $user_id

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // 🔹 Add to favorites
    $data = json_decode(file_get_contents('php://input'), true);
    $listing_id = $data['listing_id'] ?? null;

    if (!$listing_id || !$user_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing listing_id or user_id']);
        exit;
    }

    $stmt = $conn->prepare("SELECT 1 FROM favorite WHERE fk_user_id = ? AND fk_listing_id = ?");
    $stmt->bind_param("ii", $user_id, $listing_id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Already in favorites']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO favorite (fk_user_id, fk_listing_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $listing_id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Added to favorites']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
    }
} else if ($method === 'GET') {
    // 🔹 Get all favorites
    $stmt = $conn->prepare("
        SELECT l.id AS listing_id, p.title, p.author, p.image, p.price
        FROM favorite f
        JOIN listings l ON f.fk_listing_id = l.id
        JOIN products p ON l.fk_product_id = p.id
        WHERE f.fk_user_id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $favorites = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode(['success' => true, 'favorites' => $favorites]);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
