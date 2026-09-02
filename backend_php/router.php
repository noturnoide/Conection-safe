<?php

$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// CORS para permitir que o frontend converse com o backend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

// GET /api/
if ($uri === "/api/" || $uri === "/api") {
    require __DIR__ . "/api/index.php";
    exit;
}

//para a senha da tela de supervisão, inclusive.
if ($uri === "/api/login") {
    require __DIR__ . "/api/login.php";
    exit;
}


// GET ou POST /api/reports
if ($uri === "/api/reports") {
    require __DIR__ . "/api/reports.php";
    exit;
}

// GET /api/reports/ESC-XXXX-XXXX
if (preg_match('#^/api/reports/([^/]+)$#', $uri, $matches)) {
    $_GET["protocolo"] = $matches[1];

    require __DIR__ . "/api/report.php";
    exit;
}

http_response_code(404);

header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "detail" => "Rota não encontrada"
], JSON_UNESCAPED_UNICODE);
