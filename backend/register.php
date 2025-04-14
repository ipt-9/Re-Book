<?php
require 'connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['username'], $data['password'], $data['region'])) {
    exit(json_encode(['success' => false, 'message' => 'Invalid input.']));
}

$email = $conn->real_escape_string($data['email']);
$username = $conn->real_escape_string($data['username']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$region = $conn->real_escape_string($data['region']);

$checkUser = $conn->query("SELECT 1 FROM users WHERE email='$email' OR username='$username'");
if ($checkUser->num_rows) {
    exit(json_encode(['success' => false, 'message' => 'User already exists.']));
}

$query = "INSERT INTO users (email, username, password, region) VALUES ('$email', '$username', '$password', '$region')";

exit(json_encode(['success' => (bool) $conn->query($query), 'message' => $conn->error ?: 'Registration successful.']));
