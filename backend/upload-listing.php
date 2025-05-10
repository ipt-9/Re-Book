<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'auth.php'; // must set $user_id
header('Content-Type: application/json');

// 🔹 Extract fields from multipart/form-data
$title = $_POST['title'] ?? null;
$author = $_POST['author'] ?? null;
$description = $_POST['description'] ?? null;
$subject = $_POST['subject'] ?? null;
$category = $_POST['category'] ?? null;
$price = $_POST['price'] ?? 0;
$listing_condition = $_POST['listing_condition'] ?? 'Good';

// 🔹 Basic validation
if (!$title || !$author || !$user_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// 🔹 Handle file upload (optional)
$imagePath = null;
if (!empty($_FILES['image']['tmp_name'])) {
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $filename = uniqid() . '_' . basename($_FILES['image']['name']);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        $imagePath = 'uploads/' . $filename; // used in frontend
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Image upload failed']);
        exit;
    }
}

// 🔹 Insert into `products` table
$stmt = $conn->prepare("
    INSERT INTO products (title, author, description, subject, category, image, price)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("ssssssd", $title, $author, $description, $subject, $category, $imagePath, $price);
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
