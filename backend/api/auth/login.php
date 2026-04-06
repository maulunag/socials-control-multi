<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../db_connection.php';
require_once '../../utils/jwt.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    $email = $data->email;
    $password = $data->password;

    try {
        $stmt = $pdo->prepare("SELECT u.id, u.company_id, u.role, u.name, u.email, u.password_hash, c.name as company_name FROM users u LEFT JOIN companies c ON u.company_id = c.id WHERE u.email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $issuedAt = time();
            $expirationTime = $issuedAt + (60 * 60 * 24); // valid for 1 day
            $payload = array(
                'iat' => $issuedAt,
                'exp' => $expirationTime,
                'userId' => $user['id'],
                'role' => $user['role'],
                'companyId' => $user['company_id']
            );

            $token = JWTUtil::encode($payload);

            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "company_id" => $user['company_id'],
                    "company_name" => $user['company_name']
                ]
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Invalid email or password."));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("message" => "Database error.", "error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
}
