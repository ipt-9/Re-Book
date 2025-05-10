<?php
// Assumes token is verified and user_id is available
require 'auth.php';
require 'connection.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE fk_user_id = ? AND fk_listings_id = ?");
$stmt->execute([$data['quantity'], $user_id, $data['listing_id']]);
