<?php
require 'connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['password'])) {
    exit(json_encode(['success' => false, 'message' => 'Invalid input.']));
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

$query = $conn->prepare("SELECT user_id, username, password FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    exit(json_encode([
        'success' => true,
        'message' => 'Login successful.',
        'user' => [
            'user_id' => $user['user_id'],
            'username' => $user['username'],
            'email' => $email
        ]
    ]));
}

exit(json_encode(['success' => false, 'message' => 'Invalid credentials.']));
