<?php

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "detail" => "Método não permitido"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$protocolo = $_GET["protocolo"] ?? null;

if (!$protocolo) {
    http_response_code(400);

    echo json_encode([
        "detail" => "Protocolo não informado"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmt = $pdo->prepare("
    SELECT *
    FROM reports
    WHERE protocolo = ?
");

$stmt->execute([strtoupper($protocolo)]);

$report = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$report) {
    http_response_code(404);

    echo json_encode([
        "detail" => "Protocolo não encontrado"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmtDenunciados = $pdo->prepare("
    SELECT cargo, turma, nome
    FROM denunciados
    WHERE report_id = ?
");

$stmtDenunciados->execute([$report["id"]]);

$report["denunciados"] = $stmtDenunciados->fetchAll(PDO::FETCH_ASSOC);

$report["id"] = $report["uuid"];

unset($report["uuid"]);

echo json_encode($report, JSON_UNESCAPED_UNICODE);
