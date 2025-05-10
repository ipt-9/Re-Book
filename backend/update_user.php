<?php
require 'auth.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("
    UPDATE users
    SET nickname = ?, gender = ?, region = ?, language = ?, school = ?
    WHERE user_id = ?
");

$stmt->bind_param("sssssi",
    $data['nickname'],
    $data['gender'],
    $data['region'],
    $data['language'],
    $data['school'],
    $user_id
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}
