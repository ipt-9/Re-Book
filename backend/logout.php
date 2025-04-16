<?php
require 'auth.php';

$stmt = $conn->prepare("UPDATE users SET token = NULL WHERE user_id = ?");
$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Logout failed']);
}
