<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db_connection.php';
require_once '../utils/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$myCompanyId = $authUser['companyId'];
$isSuperAdmin = $authUser['role'] === 'SUPERADMIN';

try {
    switch ($method) {
        case 'GET':
            // If superadmin, allow getting any company's IA settings via ?company_id=X
            $targetCompanyId = $isSuperAdmin && isset($_GET['company_id']) ? $_GET['company_id'] : $myCompanyId;

            if (!$targetCompanyId) {
                http_response_code(400);
                echo json_encode(["message" => "No se especificó la compañía."]);
                exit;
            }

            $stmt = $pdo->prepare("SELECT * FROM companies_api_ia WHERE id_company = ?");
            $stmt->execute([$targetCompanyId]);
            $settings = $stmt->fetch();

            if ($settings) {
                echo json_encode($settings);
            } else {
                echo json_encode(["message" => "Configuración IA no encontrada"]);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            $targetCompanyId = $isSuperAdmin && isset($data->company_id) ? $data->company_id : $myCompanyId;

            if (!$targetCompanyId) {
                http_response_code(400);
                echo json_encode(["message" => "No se especificó la compañía para guardar los settings."]);
                exit;
            }

            // Check if settings already exist
            $checkStmt = $pdo->prepare("SELECT id FROM companies_api_ia WHERE id_company = ?");
            $checkStmt->execute([$targetCompanyId]);
            $exists = $checkStmt->fetch();

            $geminiKey = $data->gemini_api_key ?? null;

            if ($exists) {
                $stmt = $pdo->prepare("UPDATE companies_api_ia SET gemini_api_key = ? WHERE id_company = ?");
                $stmt->execute([$geminiKey, $targetCompanyId]);
                echo json_encode(["message" => "IA Settings actualizados exitosamente."]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO companies_api_ia (id_company, gemini_api_key) VALUES (?, ?)");
                $stmt->execute([$targetCompanyId, $geminiKey]);
                echo json_encode(["message" => "IA Settings guardados exitosamente."]);
            }
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
