<?php
require '../config.php';

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM users");
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($books);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
