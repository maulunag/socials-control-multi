<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db_connection.php';
require_once '../utils/auth_middleware.php';

// Solo el SUPERADMIN puede acceder a este mantenedor
if ($authUser['role'] !== 'SUPERADMIN') {
    http_response_code(403);
    echo json_encode(["message" => "Acceso denegado. Permisos insuficientes."]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->prepare("SELECT c.*, 
                (SELECT COUNT(*) FROM users u WHERE u.company_id = c.id) as user_count 
                FROM companies c ORDER BY c.created_at DESC");
            $stmt->execute();
            $companies = $stmt->fetchAll();
            echo json_encode($companies);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->name)) {
                http_response_code(400);
                echo json_encode(["message" => "Falta el nombre de la empresa."]);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO companies (name) VALUES (?)");
            $stmt->execute([$data->name]);
            $companyId = $pdo->lastInsertId();

            // Auto-crear config vacía de metricool settings para la nueva empresa
            $stmtMetricool = $pdo->prepare("INSERT INTO company_metricool_settings (company_id) VALUES (?)");
            $stmtMetricool->execute([$companyId]);

            echo json_encode(["message" => "Empresa creada exitosamente.", "id" => $companyId]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->id) || empty($data->name)) {
                http_response_code(400);
                echo json_encode(["message" => "Faltan datos de la empresa."]);
                exit;
            }
            $stmt = $pdo->prepare("UPDATE companies SET name = ? WHERE id = ?");
            $stmt->execute([$data->name, $data->id]);
            echo json_encode(["message" => "Empresa actualizada."]);
            break;

        case 'DELETE':
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode(["message" => "Falta el ID."]);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM companies WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["message" => "Empresa eliminada."]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["message" => "Método no permitido."]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error de base de datos", "error" => $e->getMessage()]);
}
