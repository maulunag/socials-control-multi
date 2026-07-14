<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
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
            // Superadmins can request any company URL param, others only their own
            $targetCompanyId = $myCompanyId;
            if ($isSuperAdmin && isset($_GET['company_id'])) {
                $targetCompanyId = $_GET['company_id'];
            }

            if (!$targetCompanyId) {
                http_response_code(400);
                echo json_encode(["message" => "Falta especificar la empresa."]);
                exit;
            }

            $stmt = $pdo->prepare("SELECT * FROM company_details WHERE company_id = ?");
            $stmt->execute([$targetCompanyId]);
            $details = $stmt->fetch();
            
            if (!$details) {
                // Return empty profile object instead of 404 to avoid frontend breaking
                echo json_encode(["company_id" => $targetCompanyId, "description" => "", "website_url" => ""]);
            } else {
                echo json_encode($details);
            }
            break;

        case 'POST':
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            
            $targetCompanyId = $myCompanyId;
            if ($isSuperAdmin && isset($data->company_id)) {
                $targetCompanyId = $data->company_id;
            }

            if (!$targetCompanyId) {
                http_response_code(400);
                echo json_encode(["message" => "Falta especificar la empresa para guardar el detalle."]);
                exit;
            }

            $description = $data->description ?? '';
            $websiteUrl = $data->website_url ?? '';

            // Upsert technique
            $stmt = $pdo->prepare("
                INSERT INTO company_details (company_id, description, website_url) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                description = VALUES(description), 
                website_url = VALUES(website_url)
            ");
            
            $stmt->execute([$targetCompanyId, $description, $websiteUrl]);
            
            echo json_encode(["message" => "Detalles actualizados exitosamente."]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["message" => "Método no permitido."]);
            break;
    }
} catch (PDOException $e) {
    if (strpos($e->getMessage(), "Table") !== false && strpos($e->getMessage(), "doesn't exist") !== false) {
        // Automatically create table if it does not exist (safeguard)
        try {
            $pdo->exec("
            CREATE TABLE IF NOT EXISTS company_details (
                company_id INT PRIMARY KEY,
                description LONGTEXT DEFAULT NULL,
                website_url VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
            
            // Retry the original query for GET/POST
            http_response_code(500);
            echo json_encode(["message" => "Tabla creada exitosamente. Por favor intente la operación nuevamente."]);
            exit;
        } catch(PDOException $e2) {
             http_response_code(500);
             echo json_encode(["message" => "Error al auto-generar la base de datos", "error" => $e2->getMessage()]);
             exit;
        }
    }
    
    http_response_code(500);
    echo json_encode(["message" => "Error de base de datos", "error" => $e->getMessage()]);
}
