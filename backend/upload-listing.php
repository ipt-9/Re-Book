<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'auth.php';
header('Content-Type: application/json');

// 🔹 Read and decode JSON body
$data = json_decode(file_get_contents("php://input"), true);

// 🔸 Extract fields safely
$title = $data['title'] ?? null;
$author = $data['author'] ?? null;
$description = $data['description'] ?? null;
$subject = $data['subject'] ?? null;
$category = $data['category'] ?? null;
$format = $data['format'] ?? null;
$imagePath = $data['image'] ?? ''; // Optional: set to default or null
$price = $data['price'] ?? 0;
$listing_condition = $data['listing_condition'] ?? 'Good'; // fallback value

// 🔹 Basic validation
if (!$title || !$author || !$subject || !$category || !$format) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// 🔹 Insert into `products` table
$stmt = $conn->prepare("
    INSERT INTO products (title, author, description, subject, category, format, image, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("ssssssss",
    $title,
    $author,
    $description,
    $subject,
    $category,
    $format,
    $imagePath,
    $price
);
$stmt->execute();

if ($stmt->error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Insert failed: ' . $stmt->error]);
    exit;
}

$product_id = $conn->insert_id;

// 🔹 Insert into `listings` table
$stmt = $conn->prepare("
    INSERT INTO listings (fk_product_id, fk_user_id, listing_condition, status, created_at)
    VALUES (?, ?, ?, 'Available', NOW())
");
$stmt->bind_param("iis", $product_id, $user_id, $listing_condition);
$stmt->execute();

if ($stmt->error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Listing creation failed: ' . $stmt->error]);
    exit;
}

// ✅ Success
echo json_encode(['success' => true, 'message' => 'Product saved successfully']);
