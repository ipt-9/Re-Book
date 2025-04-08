<?php
// get_books.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'connection.php'; // use your existing DB connection

$query = "SELECT title, author, price, image FROM products"; // adjust if needed
$result = $conn->query($query);

$books = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
}

echo json_encode($books);

$conn->close();
?>
