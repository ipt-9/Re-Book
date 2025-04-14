<?php
$DB_HOST = 'localhost';
$DB_USER = 'Rebook';
$DB_PASSWORD = 'U1sOja2bgN7&opq?';
$DB_NAME = 'BMSD22a_ReBook';
$DB_PORT = 3306;

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME, $DB_PORT);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}
?>
