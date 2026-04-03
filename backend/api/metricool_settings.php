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

if ($authUser['role'] === 'USER') {
    http_response_code(403);
    echo json_encode(["message" => "Acceso denegado."]);
    exit;
}
$method = $_SERVER['REQUEST_METHOD'];
$myCompanyId = $authUser['companyId'];
$isSuperAdmin = $authUser['role'] === 'SUPERADMIN';

try {
    switch ($method) {
        case 'GET':
            $targetCompanyId = $myCompanyId;
            if ($isSuperAdmin) {
                if (isset($_GET['company_id'])) {
                    $targetCompanyId = intval($_GET['company_id']);
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Falta parámetro company_id."]);
                    exit;
                }
            } else if (empty($targetCompanyId)) {
                http_response_code(400);
                echo json_encode(["message" => "Usuario no asociado a una empresa."]);
                exit;
            }

            $stmt = $pdo->prepare("SELECT * FROM company_metricool_settings WHERE company_id = ?");
            $stmt->execute([$targetCompanyId]);
            $settings = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$settings) {
                // If it doesn't exist for some reason, create an empty one
                $stmtInsert = $pdo->prepare("INSERT INTO company_metricool_settings (company_id) VALUES (?)");
                $stmtInsert->execute([$targetCompanyId]);

                $stmt = $pdo->prepare("SELECT * FROM company_metricool_settings WHERE company_id = ?");
                $stmt->execute([$targetCompanyId]);
                $settings = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            // Convert boolean-like values for JSON output
            $fieldsToBool = ['facebook_active', 'instagram_active', 'linkedin_active', 'gmb_active', 'twitter_active', 'youtube_active', 'tiktok_active'];
            foreach ($fieldsToBool as $field) {
                if (isset($settings[$field])) {
                    $settings[$field] = (bool)$settings[$field];
                }
            }

            echo json_encode($settings);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            
            $targetCompanyId = $myCompanyId;
            if ($isSuperAdmin) {
                if (isset($data->company_id)) {
                    $targetCompanyId = intval($data->company_id);
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Falta parámetro company_id."]);
                    exit;
                }
            } else if (empty($targetCompanyId)) {
                http_response_code(400);
                echo json_encode(["message" => "Usuario no asociado a una empresa."]);
                exit;
            }

            $userId = isset($data->metricool_user_id) ? $data->metricool_user_id : null;
            $token = isset($data->metricool_token) ? $data->metricool_token : null;
            $fb = isset($data->facebook_active) ? (int)$data->facebook_active : 0;
            $ig = isset($data->instagram_active) ? (int)$data->instagram_active : 0;
            $li = isset($data->linkedin_active) ? (int)$data->linkedin_active : 0;
            $gmb = isset($data->gmb_active) ? (int)$data->gmb_active : 0;
            $tw = isset($data->twitter_active) ? (int)$data->twitter_active : 0;
            $yt = isset($data->youtube_active) ? (int)$data->youtube_active : 0;
            $tk = isset($data->tiktok_active) ? (int)$data->tiktok_active : 0;

            $stmt = $pdo->prepare("
                UPDATE company_metricool_settings 
                SET metricool_user_id = ?, metricool_token = ?, 
                    facebook_active = ?, instagram_active = ?, linkedin_active = ?, 
                    gmb_active = ?, twitter_active = ?, youtube_active = ?, tiktok_active = ?
                WHERE company_id = ?
            ");
            $stmt->execute([$userId, $token, $fb, $ig, $li, $gmb, $tw, $yt, $tk, $targetCompanyId]);

            echo json_encode(["message" => "Configuración guardada exitosamente."]);
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
