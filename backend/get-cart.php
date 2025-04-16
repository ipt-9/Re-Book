<?php
require 'auth.php';
require 'connection.php';
header('Content-Type: application/json');

$stmt = $conn->prepare("
    SELECT
      c.id AS cart_id,
      c.quantity,
      p.title,
      p.author,
      p.price,
      p.image,
      l.id AS listing_id
    FROM cart c
    JOIN listings l ON c.fk_listing_id = l.id
    JOIN products p ON l.fk_product_id = p.product_id
    WHERE c.fk_user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$cart = [];
while ($row = $result->fetch_assoc()) {
    $cart[] = $row;
}

echo json_encode($cart);
