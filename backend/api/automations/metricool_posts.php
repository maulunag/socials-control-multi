<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Adjust the path to db_connection based on the new folder structure (../../)
require_once '../../db_connection.php';
require_once '../../utils/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$myCompanyId = $authUser['companyId'];
$isSuperAdmin = $authUser['role'] === 'SUPERADMIN';

try {
    switch ($method) {
        case 'GET':
            // Allow filtering by blog_id or source_file
            $query = "SELECT * FROM metricool_posts WHERE 1=1";
            $params = [];

            // Multi-tenant isolation
            if (!$isSuperAdmin) {
                $query .= " AND id_company = ?";
                $params[] = $myCompanyId;
            } elseif (isset($_GET['company_id'])) {
                $query .= " AND id_company = ?";
                $params[] = $_GET['company_id'];
            }

            if (isset($_GET['blog_id'])) {
                $query .= " AND blog_id = ?";
                $params[] = $_GET['blog_id'];
            }
            if (isset($_GET['source_file'])) {
                $query .= " AND source_file = ?";
                $params[] = $_GET['source_file'];
            }
            if (isset($_GET['status'])) {
                $query .= " AND status = ?";
                $params[] = $_GET['status'];
            }

            $query .= " ORDER BY created_at DESC LIMIT 100";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            
            $posts = $stmt->fetchAll();
            echo json_encode($posts);
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"));
            
            // Allow inserting multiple posts at once (Batch insert from UI generation)
            if (isset($data->posts) && is_array($data->posts)) {
                $insertedIds = [];
                $pdo->beginTransaction();
                
                try {
                    $stmt = $pdo->prepare("INSERT INTO metricool_posts (
                        id_company, action, blog_id, titulo, resumen, contenido, hashtags, 
                        categoria, url_image, promt_idea_image, fecha_registro, 
                        status, approval_status, source_file, fotos, platforms, 
                        complete_html_content
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

                    foreach ($data->posts as $post) {
                        $stmt->execute([
                            $post->id_company ?? $myCompanyId,
                            $post->action ?? 'post_general',
                            $post->blog_id ?? 0,
                            $post->titulo ?? null,
                            $post->resumen ?? null,
                            $post->contenido ?? null,
                            $post->hashtags ?? null,
                            $post->categoria ?? null,
                            $post->url_image ?? null,
                            $post->promt_idea_image ?? null,
                            $post->fecha_registro ?? null,
                            $post->status ?? 'draft',
                            $post->approval_status ?? 'pending',
                            $post->source_file ?? null,
                            $post->fotos ?? null,
                            $post->platforms ?? null,
                            $post->complete_html_content ?? null
                        ]);
                        $insertedIds[] = $pdo->lastInsertId();
                    }
                    $pdo->commit();
                    echo json_encode(["message" => "Lote de posts creado exitosamente.", "ids" => $insertedIds]);
                } catch (Exception $e) {
                    $pdo->rollBack();
                    throw $e;
                }
            } else {
                // Single insert
                if (empty($data->action)) {
                    http_response_code(400);
                    echo json_encode(["message" => "El campo 'action' es obligatorio."]);
                    exit;
                }

                $stmt = $pdo->prepare("INSERT INTO metricool_posts (
                    id_company, action, blog_id, slug, titulo, resumen, contenido, hashtags, 
                    categoria, url_image, promt_idea_image, fecha_registro, 
                    status, approval_status, source_file, fotos, platforms, 
                    metricool_response, metricool_post_id, scheduled_date, complete_html_content
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                $stmt->execute([
                    $data->id_company ?? $myCompanyId,
                    $data->action,
                    $data->blog_id ?? 0,
                    $data->slug ?? null,
                    $data->titulo ?? null,
                    $data->resumen ?? null,
                    $data->contenido ?? null,
                    $data->hashtags ?? null,
                    $data->categoria ?? null,
                    $data->url_image ?? null,
                    $data->promt_idea_image ?? null,
                    $data->fecha_registro ?? null,
                    $data->status ?? 'draft',
                    $data->approval_status ?? 'pending',
                    $data->source_file ?? null,
                    $data->fotos ?? null,
                    $data->platforms ?? null,
                    $data->metricool_response ?? null,
                    $data->metricool_post_id ?? null,
                    $data->scheduled_date ?? null,
                    $data->complete_html_content ?? null
                ]);
                echo json_encode(["message" => "Post creado exitosamente.", "id" => $pdo->lastInsertId()]);
            }
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
            if (empty($data->id)) {
                http_response_code(400);
                echo json_encode(["message" => "Falta el ID del post para actualizar."]);
                exit;
            }

            $stmt = $pdo->prepare("UPDATE metricool_posts SET 
                titulo = ?, resumen = ?, contenido = ?, hashtags = ?, 
                categoria = ?, url_image = ?, promt_idea_image = ?, status = ?, 
                approval_status = ?, platforms = ?, scheduled_date = ?, complete_html_content = ?
                WHERE id = ?");
            
            $stmt->execute([
                $data->titulo ?? null,
                $data->resumen ?? null,
                $data->contenido ?? null,
                $data->hashtags ?? null,
                $data->categoria ?? null,
                $data->url_image ?? null,
                $data->promt_idea_image ?? null,
                $data->status ?? 'draft',
                $data->approval_status ?? 'pending',
                $data->platforms ?? null,
                $data->scheduled_date ?? null,
                $data->complete_html_content ?? null,
                $data->id
            ]);

            echo json_encode(["message" => "Post actualizado exitosamente."]);
            break;

        case 'DELETE':
            if (empty($_GET['id'])) {
                http_response_code(400);
                echo json_encode(["message" => "Falta el ID del post."]);
                exit;
            }

            $stmt = $pdo->prepare("DELETE FROM metricool_posts WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["message" => "Post eliminado exitosamente."]);
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
