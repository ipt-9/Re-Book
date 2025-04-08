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
        p.subject,
        p.category,
        p.format,
        p.image,
        l.listing_condition,
        l.status,
		l.price,
        l.created_at
    FROM
        products p
    JOIN
        listings l ON p.product_id = l.fk_product_id
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
