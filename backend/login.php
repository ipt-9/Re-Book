<?php
include('connection.php');

// Stelle sicher, dass keine unerwünschten Leerzeichen vor <?php existieren!

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200'); // Angular URL
header('Access-Control-Allow-Credentials: true'); // Sessions aktivieren
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

session_start();

// Falls unerwartete Zeichen vorhanden sind, diese entfernen
ob_end_clean();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// JSON-Daten einlesen
$inputJSON = file_get_contents("php://input");
$input = json_decode($inputJSON, true);

// Falls JSON fehlerhaft ist oder Felder fehlen
if (!$input || empty($input['email']) || empty($input['password'])) {
    echo json_encode(["status" => "error", "message" => "Missing email or password"]);
    exit;
}

$email = trim($input['email']);
$password = $input['password'];

// Prüfe, ob der Benutzer existiert
$stmt = $conn->prepare("SELECT user_id, username, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($user_id, $username, $hashedPassword);
$stmt->fetch();

if ($stmt->num_rows === 0 || !password_verify($password, $hashedPassword)) {
    echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
    exit;
}

// Session speichern
$_SESSION['user_id'] = $user_id;

$response = [
    "status" => "success",
    "message" => "Login successful",
    "user_id" => $user_id,
    "username" => $username
];

// **JSON sauber ausgeben**
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
exit;
?>
