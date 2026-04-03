<?php
require_once __DIR__ . '/jwt.php';

function authenticate() {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

    // Handle Nginx / FastCGI cases
    if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["message" => "Token de autorización no proveído."]);
        exit;
    }

    $jwt = $matches[1];

    try {
        $decodedData = JWTUtil::decode($jwt);
        return $decodedData; // Devuelve userId, role, companyId, etc.
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["message" => "Sesión inválida o token expirado. Detalles: " . $e->getMessage()]);
        exit;
    }
}

// Automatically enforce authentication as soon as this is included.
$authUser = authenticate();
