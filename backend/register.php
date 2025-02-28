<?php
include('connection.php');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200'); // Angular app URL
header('Access-Control-Allow-Credentials: true'); // Required for sessions
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
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

// Validate password strength
if (!preg_match('/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d).{8,}$/', $input['password'])) {
    echo json_encode(["status" => "error", "message" => "Password must be at least 8 characters long, include at least one special character and one number."]);
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
$school = $input['school'];
$region = $input['region'];

// Check if email already exists
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

// Insert user into database
$stmt = $conn->prepare("INSERT INTO users (username, email, password, school, region) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $username, $email, $hashedPassword, $school, $region);
if ($stmt->execute()) {
    session_start();
    $_SESSION['user_id'] = $stmt->insert_id;
    echo json_encode(["status" => "success", "message" => "User registered successfully");
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
}
$_SESSION['user_id'] = $user_id;

$stmt->close();
$conn->close();
exit;
?>
