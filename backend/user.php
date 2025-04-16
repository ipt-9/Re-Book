<?php
// 📌 Fehlerausgabe aktivieren (nur in Entwicklung)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'connection.php';
header('Content-Type: application/json');

// 🔐 Authentifizierung prüfen
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
$authHeader = $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? null);

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No token provided.']);
    exit;
}

$token = str_replace('Bearer ', '', $authHeader);

// ✅ Token überprüfen
$stmt = $conn->prepare("SELECT user_id FROM users WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token.']);
    exit;
}

$user_id = $user['user_id'];

// ⚠️ Stelle sicher: Alle Felder existieren in der Tabelle `users`
$stmt = $conn->prepare("
    SELECT user_id, username, email, school, region, nickname, gender, language
    FROM users
    WHERE user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$userData = $result->fetch_assoc();

if (!$userData) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'User data not found.']);
    exit;
}

// 🔁 Null-Werte durch leere Strings ersetzen
foreach ($userData as $key => $value) {
    if (is_null($value)) {
        $userData[$key] = '';
    }
}

echo json_encode(['success' => true, 'user' => $userData]);
