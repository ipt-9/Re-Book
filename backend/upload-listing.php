<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'auth.php';

$imagePath = '';
if (!empty($_FILES['image']['name'])) {
    $targetDir = "uploads/";
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $fileName = uniqid() . "_" . basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
        $imagePath = $targetFile;
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Picture could not be uploaded.']);
        exit;
    }
}

$stmt = $conn->prepare("INSERT INTO products (title, author, description, subject, category, format, image, price)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssd",
    $_POST['title'],
    $_POST['author'],
    $_POST['description'],
    $_POST['subject'],
    $_POST['category'],
    $_POST['format'],
    $imagePath,
    $_POST['price']
);
$stmt->execute();
$product_id = $conn->insert_id;

$stmt = $conn->prepare("INSERT INTO listings (fk_product_id, fk_user_id, listing_condition, status, created_at)
                        VALUES (?, ?, ?, 'Available', NOW())");
$stmt->bind_param("iis", $product_id, $user_id, $_POST['listing_condition']);
$stmt->execute();

echo json_encode(['success' => true, 'message' => 'Product saved successfully']);
