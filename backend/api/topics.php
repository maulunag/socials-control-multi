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

$method = $_SERVER['REQUEST_METHOD'];
$myCompanyId = $authUser['companyId'];
$isSuperAdmin = $authUser['role'] === 'SUPERADMIN';

try {
    switch ($method) {
        case 'GET':
            if ($isSuperAdmin) {
                // If a specific company is requested
                if (isset($_GET['company_id'])) {
                    $stmt = $pdo->prepare("SELECT t.*, c.name as company_name 
                                           FROM content_topics t 
                                           LEFT JOIN companies c ON t.id_company = c.id 
                                           WHERE t.id_company = ? 
                                           ORDER BY t.created_at DESC LIMIT 200");
                    $stmt->execute([$_GET['company_id']]);
                } else {
                    $stmt = $pdo->prepare("SELECT t.*, c.name as company_name 
                                           FROM content_topics t 
                                           LEFT JOIN companies c ON t.id_company = c.id 
                                           ORDER BY t.created_at DESC LIMIT 200");
                    $stmt->execute();
                }
            } else {
                $stmt = $pdo->prepare("SELECT t.*, c.name as company_name 
                                       FROM content_topics t 
                                       LEFT JOIN companies c ON t.id_company = c.id 
                                       WHERE t.id_company = ? 
                                       ORDER BY t.created_at DESC LIMIT 200");
                $stmt->execute([$myCompanyId]);
            }
            $topics = $stmt->fetchAll();
            echo json_encode($topics);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->title) || empty($data->status)) {
                http_response_code(400);
                echo json_encode(["message" => "El título y el estado son obligatorios."]);
                exit;
            }

            $targetCompanyId = $isSuperAdmin ? (!empty($data->id_company) ? $data->id_company : $myCompanyId) : $myCompanyId;
            if (!$targetCompanyId) { // Fallback if Superadmin didn't provide and has no company
                http_response_code(400);
                echo json_encode(["message" => "Debe especificar la empresa para este topic."]);
                exit;
            }

            $stmt = $pdo->prepare("INSERT INTO content_topics (id_company, title, description, keywords, category, status) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $targetCompanyId,
                $data->title,
                $data->description ?? null,
                $data->keywords ?? null,
                $data->category ?? null,
                $data->status
            ]);
            echo json_encode(["message" => "Topic creado exitosamente.", "id" => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->id) || empty($data->title) || empty($data->status)) {
                http_response_code(400);
                echo json_encode(["message" => "Faltan datos requeridos para actualizar."]);
                exit;
            }

            // Check ownership for non-Superadmin
            if (!$isSuperAdmin) {
                $check = $pdo->prepare("SELECT id FROM content_topics WHERE id = ? AND id_company = ?");
                $check->execute([$data->id, $myCompanyId]);
                if (!$check->fetch()) {
                    http_response_code(403);
                    echo json_encode(["message" => "No tienes permiso para editar este topic."]);
                    exit;
                }
            }

            $stmt = $pdo->prepare("UPDATE content_topics SET title = ?, description = ?, keywords = ?, category = ?, status = ? WHERE id = ?");
            $stmt->execute([
                $data->title,
                $data->description ?? null,
                $data->keywords ?? null,
                $data->category ?? null,
                $data->status,
                $data->id
            ]);

            echo json_encode(["message" => "Topic actualizado exitosamente."]);
            break;

        case 'DELETE':
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode(["message" => "Falta el ID del topic."]);
                exit;
            }
            
            // Check ownership for non-Superadmin
            if (!$isSuperAdmin) {
                $check = $pdo->prepare("SELECT id FROM content_topics WHERE id = ? AND id_company = ?");
                $check->execute([$_GET['id'], $myCompanyId]);
                if (!$check->fetch()) {
                    http_response_code(403);
                    echo json_encode(["message" => "No tienes permiso para eliminar este topic."]);
                    exit;
                }
            }

            $stmt = $pdo->prepare("DELETE FROM content_topics WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["message" => "Topic eliminado."]);
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
