<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'connection.php';

$query = "
    SELECT
      p.product_id,
      p.title,
      p.author,
      p.description,
      p.image,
      p.price,
      p.category,
      p.subject,
      l.listing_id
    FROM products p
    JOIN listings l ON l.fk_product_id = p.product_id
    WHERE l.status = 'Available'
";
$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed: " . $conn->error]);
    exit;
}

$books = [];

while ($row = $result->fetch_assoc()) {
    $books[] = $row;
}

echo json_encode($books);

$conn->close();
?>
