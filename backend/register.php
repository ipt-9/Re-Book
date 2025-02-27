<?php
include('connection.php');


$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit;
}

// Validate required fields
if (empty($input['username']) || empty($input['email']) || empty($input['password']) || empty($input['confirmPassword'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

// Check password match
if ($input['password'] !== $input['confirmPassword']) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match"]);
    exit;
}

$username = trim($input['username']);
$email = trim($input['email']);
$password = $input['password'];

// Check if email already exists (use prepared statements)
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already exists"]);
    $stmt->close();
    exit;
}
$stmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert user into the database (use prepared statements)
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hashedPassword);
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
}
$stmt->close();
$conn->close();
exit;
?>
