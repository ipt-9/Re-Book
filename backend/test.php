<?php
// Uncomment phpinfo if needed for debugging purposes
// phpinfo();
echo "Hello World";

// Database connection parameters
$host = "localhost:3306";
$db_name = "BMSD22a_ReBook";
$username = "Rebook"; // Update if necessary
$password = "U1sOja2bgN7&opq?"; // Update if necessary


try {
    // Create a new PDO instance
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully<br>";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die(); // Exit the script if the connection fails
}



try {
    // Prepare and execute the SQL query
    $sql = "SELECT count(*) FROM orders";
    $result = $conn->query($sql)->fetchColumn();

    // Output the count result
    echo "User count: " . $result . "<br>";

    // Note: The use of `mysql_fetch_array` is incorrect here since it's from the old MySQL extension
    // Iterate over rows properly using PDO or fetch results if necessary (example shown below)
    $sql = "SELECT * FROM orders"; // Example to fetch all user data
    $stmt = $conn->query($sql);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
        echo "<br>";
    }
} catch (PDOException $e) {
    echo "Query failed: " . $e->getMessage();
}

try {
    // Prepare and execute the SQL query
    $sql = "SELECT count(*) FROM users";
    $result = $conn->query($sql)->fetchColumn();

    // Output the count result
    echo "User count: " . $result . "<br>";

    // Note: The use of `mysql_fetch_array` is incorrect here since it's from the old MySQL extension
    // Iterate over rows properly using PDO or fetch results if necessary (example shown below)
    $sql = "SELECT * FROM orders"; // Example to fetch all user data
    $stmt = $conn->query($sql);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
        echo "<br>";
    }
} catch (PDOException $e) {
    echo "Query failed: " . $e->getMessage();
}

// Close the connection (optional as PHP closes it automatically at the end of the script)
$conn = null;
?>
