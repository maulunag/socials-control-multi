<?php
/**
 * Database Connection
 *
 * MySQL PDO connection for the TampaTeks Socials Control system.
 * Credentials are loaded from backend/.env (never committed to git).
 */

$_envPath = __DIR__ . '/.env';
if (!file_exists($_envPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing .env file in backend/']);
    exit;
}
$_env = parse_ini_file($_envPath);

$db_host    = $_env['DB_HOST']    ?? 'localhost';
$db_name    = $_env['DB_NAME']    ?? '';
$db_user    = $_env['DB_USER']    ?? '';
$db_pass    = $_env['DB_PASS']    ?? '';
$db_charset = $_env['DB_CHARSET'] ?? 'utf8mb4';

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
