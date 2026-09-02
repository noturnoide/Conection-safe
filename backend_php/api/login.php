<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "detail" => "Método não permitido"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$senhaInformada = $dados["senha"] ?? "";

$config = require __DIR__ . "/../config.php";

if (!isset($config["senha_supervisao"])) {
    http_response_code(500);
    echo json_encode([
        "detail" => "Senha da supervisão não configurada"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!password_verify($senhaInformada, $config["senha_supervisao"])) {
    http_response_code(401);
    echo json_encode([
        "detail" => "Senha incorreta"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$_SESSION["supervisao_autenticada"] = true;

echo json_encode([
    "message" => "Login realizado com sucesso"
], JSON_UNESCAPED_UNICODE);
