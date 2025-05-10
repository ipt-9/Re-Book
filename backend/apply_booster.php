require 'auth.php';
$data = json_decode(file_get_contents("php://input"), true);
$ids = $data['item_ids'] ?? [];

foreach ($ids as $id) {
    $stmt = $conn->prepare("UPDATE listings SET boosted = 1 WHERE fk_user_id = ? AND fk_product_id = ?");
    $stmt->bind_param("ii", $user_id, $id);
    $stmt->execute();
}
echo json_encode(['success' => true]);
