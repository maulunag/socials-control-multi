<?php
// Worker meant to be called by a cronjob or manually via GET request
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../db_connection.php';

// Limitar el tiempo de ejecución si son muchos posts
set_time_limit(300); 

try {
    // 1. Encontrar todos los posts en estado 'draft' y 'pending' que necesiten proceso de IA.
    // Usualmente sabremos que necesitan proceso de IA si la imagen o contenido tienen las banderas por defecto ("Variante", etc) o simplemente todos los drafts.
    $stmt = $pdo->prepare("
        SELECT m.*, c.gemini_api_key 
        FROM metricool_posts m
        LEFT JOIN companies_api_ia c ON m.id_company = c.id_company
        WHERE m.status = 'draft' 
          AND m.approval_status = 'pending' 
          AND (m.contenido LIKE 'Contenido extenso generado por IA%' 
               OR m.titulo LIKE 'Generado:%') 
        LIMIT 10 
    ");
    $stmt->execute();
    $posts = $stmt->fetchAll();

    if (count($posts) === 0) {
        echo json_encode(["status" => "success", "message" => "No pending posts to process."]);
        exit;
    }

    $processedIds = [];
    $errors = [];

    foreach ($posts as $post) {
        $apiKey = $post['gemini_api_key'];
        
        if (empty($apiKey)) {
            $errors[] = "Post ID {$post['id']} skipped: No Gemini API Key for company {$post['id_company']}";
            continue;
        }

        // --- 1. GENERACIÓN DE TEXTO CON GEMINI 3.1 (Cambiado a petición del usuario) --- //
        
        // Asignar un enfoque creativo al azar para forzar a la IA a que CADA post sea radicalmente distinto
        $angles = [
            "Educational and informative",
            "Storytelling and personal anecdote",
            "Controversial or thought-provoking",
            "Humorous and entertaining",
            "Action-oriented and motivational",
            "Listicle or step-by-step format",
            "Questioning and engaging the audience",
            "Behind-the-scenes or transparent approach"
        ];
        $randomAngle = $angles[array_rand($angles)];

        $promptText = "You are an expert Community Manager. You need to create a totally unique social media post for the following platforms: {$post['platforms']}. 
        
        The core topic you must organically discuss comes from this idea/variant: '" . $post['titulo'] . "'. 
        
        CRITICAL INSTRUCTIONS: 
        1. You must generate all the content STRICTLY AND ENTIRELY IN ENGLISH.
        2. To ensure maximum variety across multiple generated posts, you MUST adopt the following creative angle/tone for this specific post: **{$randomAngle}**.
        3. Do NOT repeat generic advice. Make the content highly engaging, creative, and completely distinct from standard posts.
        4. NEVER, UNDER ANY CIRCUMSTANCE, put tags, prefixes, or labels at the beginning of the title or content. Do not output 'Educational:', 'Title:', or 'Generado:'. Just output the pure final text!
        5. Do not include 'Variante N' in your response. The title must be a real, catchy, natural title for a real audience.
        
        Return exactly a JSON object with the following keys:
        - 'titulo': A catchy, unique title in English WITHOUT any prefixes or tags. (max 80 chars)
        - 'resumen': A short description/summary in English (1 or 2 lines)
        - 'contenido': The main body of the post in English, well-structured, adopting the '{$randomAngle}' tone, and including emojis.
        - 'hashtags': 3 to 5 relevant hashtags separated by space in English.
        - 'promt_idea_image': Write a highly detailed, highly imaginative prompt IN ENGLISH for nano banana 2 / DALL-E to generate a totally unique image that visually accompanies this post. Describe specific subjects, lighting, and composition to guarantee the image is different every time.";

        $urlText = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" . $apiKey;
        // Agregamos Temperature alta para obligar a la IA a que sea hiper creativa y nunca de resultados iguales
        $dataText = [
            "contents" => [
                ["parts" => [["text" => $promptText]]]
            ],
            "generationConfig" => [
                "temperature" => 1.0, 
                "topK" => 64,
                "topP" => 0.95,
                "responseMimeType" => "application/json"
            ]
        ];

        $ch = curl_init($urlText);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataText));
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            $errors[] = "Post ID {$post['id']} error Gemini Text: " . $response;
            continue;
        }

        $resJson = json_decode($response, true);
        $geminiOutput = $resJson['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!$geminiOutput) {
            $errors[] = "Post ID {$post['id']} malformed Gemini response.";
            continue;
        }

        // Clean ```json ... ``` markdown wrappers if Gemini returns them
        $cleanOutput = preg_replace('/^```json\s*|```\s*$/i', '', trim($geminiOutput));
        $parsedContent = json_decode($cleanOutput, true);
        
        if (!$parsedContent) {
           $errors[] = "Post ID {$post['id']} failed to parse JSON from Gemini: " . $geminiOutput;
           continue;
        }

        $newTitulo = $parsedContent['titulo'] ?? $post['titulo'];
        $newResumen = $parsedContent['resumen'] ?? $post['resumen'];
        $newContenido = $parsedContent['contenido'] ?? $post['contenido'];
        $newHashtags = $parsedContent['hashtags'] ?? $post['hashtags'];
        $newPromptImage = $parsedContent['promt_idea_image'] ?? $post['promt_idea_image'];

        // --- 2. GENERACIÓN DE IMAGEN CON IMAGEN 3 (Vía Google AI Studio) --- //
        $imageUrl = ""; 
        
        $urlImg = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=" . $apiKey;
        $dataImg = [
            "instances" => [
                ["prompt" => $newPromptImage]
            ],
            "parameters" => [
                "sampleCount" => 1,
                "aspectRatio" => "1:1",
                "outputOptions" => ["mimeType" => "image/jpeg"]
            ]
        ];

        $chImg = curl_init($urlImg);
        curl_setopt($chImg, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($chImg, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($chImg, CURLOPT_POST, true);
        curl_setopt($chImg, CURLOPT_POSTFIELDS, json_encode($dataImg));
        
        $responseImg = curl_exec($chImg);
        $httpCodeImg = curl_getinfo($chImg, CURLINFO_HTTP_CODE);
        curl_close($chImg);

        if ($httpCodeImg === 200) {
            $imgJson = json_decode($responseImg, true);
            $base64Image = $imgJson['predictions'][0]['bytesBase64Encoded'] ?? null;
            
            if ($base64Image) {
                // Ensure uploads directory exists in socials-control-multi/uploads
                $uploadDir = __DIR__ . '/../../../uploads/';
                if (!is_dir($uploadDir)) {
                    @mkdir($uploadDir, 0777, true); // Added @ to suppress permission errors if any
                }
                
                $fileName = 'ia_img_' . $post['id_company'] . '_' . time() . '_' . rand(100,999) . '.jpg';
                $filePath = $uploadDir . $fileName;
                
                // Decode and save to file system
                $saved = @file_put_contents($filePath, base64_decode($base64Image));
                
                if ($saved !== false) {
                    // Return the public accessible path relative to domain
                    $imageUrl = '/socials-control-multi/uploads/' . $fileName;
                } else {
                    $errors[] = "Post ID {$post['id']} error: Could not write generated image to {$filePath}. Permission denied.";
                }
            }
        } else {
            $errors[] = "Post ID {$post['id']} error Image API: " . $responseImg;
        }

        // --- 3. ACTUALIZAR BASE DE DATOS --- //
        $updateStmt = $pdo->prepare("
            UPDATE metricool_posts 
            SET titulo = ?, resumen = ?, contenido = ?, hashtags = ?, promt_idea_image = ?, url_image = ?
            WHERE id = ?
        ");

        $updateStmt->execute([
            $newTitulo,
            $newResumen,
            $newContenido,
            $newHashtags,
            $newPromptImage,
            $imageUrl,
            $post['id']
        ]);

        $processedIds[] = $post['id'];
    }

    echo json_encode([
        "status" => "success",
        "processed_count" => count($processedIds),
        "processed_ids" => $processedIds,
        "errors" => $errors
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
