<?php
include('connection.php');
include(login.php);

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true)
{
  $imagePath = '';
  if (!empty($_FILES['image']['name'])) {
    $targetDir = "uploads/";
    if (!file_exists($targetDir)) {
      mkdir($targetDir, 0777, true);
    }

    $fileName = uniqid() . "_" . basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
      $imagePath = $targetFile;
    } else {
      http_response_code(400);
      echo json_encode(['error' => 'Picture could not be uploaded.']);
      exit;
    }
  }

  $stmt = $conn->prepare("INSERT INTO products (title, author, description, subject, category, format, image)
                          VALUES (?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("sssssss",
    $_POST['title'],
    $_POST['author'],
    $_POST['description'],
    $_POST['subject'],
    $_POST['category'],
    $_POST['format'],
    $imagePath
  );
  $stmt->execute();
  $product_id = $conn->insert_id;

  // replace with Login-ID
  $user_id = 1;

  $stmt = $conn->prepare("INSERT INTO listings (fk_product_id, fk_user_id, price, listing_condition, status, created_at)
                          VALUES (?, ?, ?, ?, 'Available', NOW())");
  $stmt->bind_param("iids", $product_id, $user_id, $_POST['price'], $_POST['listing_condition']);
  $stmt->execute();

  echo json_encode(['success' => true, 'message' => 'Product saved succesfully']);
} else{
    http_response_code(400);
    echo json_encode(['error' => 'User is not logged in']);
}
