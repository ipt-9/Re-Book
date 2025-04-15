<?php
require 'auth.php';

$stmt = $conn->prepare("SELECT user_id, username, email, school, region FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

echo json_encode(['success' => true, 'user' => $user]);
