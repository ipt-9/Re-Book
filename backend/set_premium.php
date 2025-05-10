require 'auth.php';
$conn->query("UPDATE users SET premium = 1 WHERE id = $user_id");
echo json_encode(['success' => true]);
