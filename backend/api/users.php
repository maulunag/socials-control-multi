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

// SUPERADMIN y ADMIN pueden administrar, pero con distintos limites.
if ($authUser['role'] === 'USER') {
    http_response_code(403);
    echo json_encode(["message" => "Acceso denegado. Permisos insuficientes."]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$myCompanyId = $authUser['companyId'];
$isSuperAdmin = $authUser['role'] === 'SUPERADMIN';

try {
    switch ($method) {
        case 'GET':
            if ($isSuperAdmin) {
                // Return all users (excluding system superadmins maybe, or just all)
                $stmt = $pdo->prepare("SELECT u.id, u.name, u.email, u.role, u.company_id, u.created_at, c.name as company_name 
                                       FROM users u 
                                       LEFT JOIN companies c ON u.company_id = c.id 
                                       ORDER BY u.created_at DESC");
                $stmt->execute();
            } else {
                // Return only users from my company
                $stmt = $pdo->prepare("SELECT id, name, email, role, company_id, created_at 
                                       FROM users WHERE company_id = ? ORDER BY created_at DESC");
                $stmt->execute([$myCompanyId]);
            }
            $users = $stmt->fetchAll();
            echo json_encode($users);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->name) || empty($data->email) || empty($data->password) || empty($data->role) || (!$isSuperAdmin && empty($myCompanyId))) {
                http_response_code(400);
                echo json_encode(["message" => "Faltan datos requeridos."]);
                exit;
            }

            // Validar que un Admin no cree un Superadmin o usuarios de otra empresa
            $targetCompanyId = $isSuperAdmin ? (!empty($data->company_id) ? $data->company_id : null) : $myCompanyId;
            $targetRole = $data->role;
            if (!$isSuperAdmin && $targetRole === 'SUPERADMIN') {
                $targetRole = 'USER'; // Fallback for security
            }

            $hash = password_hash($data->password, PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("INSERT INTO users (company_id, role, name, email, password_hash) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$targetCompanyId, $targetRole, $data->name, $data->email, $hash]);
            echo json_encode(["message" => "Usuario creado exitosamente.", "id" => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->id) || empty($data->name) || empty($data->email) || empty($data->role)) {
                http_response_code(400);
                echo json_encode(["message" => "Faltan datos requeridos."]);
                exit;
            }

            // Check ownership for Admin
            if (!$isSuperAdmin) {
                $check = $pdo->prepare("SELECT id FROM users WHERE id = ? AND company_id = ?");
                $check->execute([$data->id, $myCompanyId]);
                if (!$check->fetch()) {
                    http_response_code(403);
                    echo json_encode(["message" => "No puedes editar este usuario."]);
                    exit;
                }
            }

            $targetRole = $data->role;
            if (!$isSuperAdmin && $targetRole === 'SUPERADMIN') {
                $targetRole = 'USER'; // Fallback for security
            }

            $targetCompanyId = $isSuperAdmin ? (!empty($data->company_id) ? $data->company_id : null) : $myCompanyId;

            if (!empty($data->password)) {
                $hash = password_hash($data->password, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, role = ?, company_id = ?, password_hash = ? WHERE id = ?");
                $stmt->execute([$data->name, $data->email, $targetRole, $targetCompanyId, $hash, $data->id]);
            } else {
                $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, role = ?, company_id = ? WHERE id = ?");
                $stmt->execute([$data->name, $data->email, $targetRole, $targetCompanyId, $data->id]);
            }

            echo json_encode(["message" => "Usuario actualizado exitosamente."]);
            break;

        case 'DELETE':
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode(["message" => "Falta el ID."]);
                exit;
            }
            
            // Check ownership for Admin
            if (!$isSuperAdmin) {
                $check = $pdo->prepare("SELECT id FROM users WHERE id = ? AND company_id = ?");
                $check->execute([$_GET['id'], $myCompanyId]);
                if (!$check->fetch()) {
                    http_response_code(403);
                    echo json_encode(["message" => "No puedes eliminar este usuario."]);
                    exit;
                }
            }

            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["message" => "Usuario eliminado."]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["message" => "Método no permitido."]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error de BD posiblemente email duplicado", "error" => $e->getMessage()]);
}
