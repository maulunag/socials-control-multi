<?php
/**
 * Database Connection
 * 
 * MySQL PDO connection for the TampaTeks Voice Call system.
 * Update the credentials below to match your environment.
 */

$db_host = 'localhost';
$db_name = 'tampatek_socials_control_multi_db';
$db_user = 'tampatek_socials_control_multi_user';         // EDIT: your MySQL username
$db_pass = '..tampateks--';             // EDIT: your MySQL password
$db_charset = 'utf8mb4';

try {
    $dsn = "mysql:host={$db_host};dbname={$db_name};charset={$db_charset}";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
    exit;
}
