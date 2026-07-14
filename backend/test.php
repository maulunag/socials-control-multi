<?php
require_once 'db_connection.php';
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'companies_api_ia'");
    $exists = $stmt->fetch();
    if ($exists) {
        echo "Table exists!\n";
    } else {
        echo "Table DOES NOT exist!\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
