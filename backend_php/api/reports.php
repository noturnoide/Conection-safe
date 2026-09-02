<?php

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../conexao.php";

session_start();

function gerarProtocolo(): string
{
    $caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    $bloco = function () use ($caracteres) {
        $resultado = "";

        for ($i = 0; $i < 4; $i++) {
            $resultado .= $caracteres[random_int(0, strlen($caracteres) - 1)];
        }

        return $resultado;
    };

    return "ESC-" . $bloco() . "-" . $bloco();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (
    !isset($_SESSION["supervisao_autenticada"]) ||
    $_SESSION["supervisao_autenticada"] !== true
) {
    http_response_code(401);
    echo json_encode([
        "detail" => "Acesso restrito à supervisão"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

    $stmt = $pdo->query("
        SELECT *
        FROM reports
        ORDER BY created_at DESC
    ");

    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($reports as &$report) {

        $stmtDenunciados = $pdo->prepare("
            SELECT cargo, turma, nome
            FROM denunciados
            WHERE report_id = ?
        ");

        $stmtDenunciados->execute([$report["id"]]);

        $report["denunciados"] = $stmtDenunciados->fetchAll(PDO::FETCH_ASSOC);

        $report["id"] = $report["uuid"];

        unset($report["uuid"]);
    }

    echo json_encode($reports, JSON_UNESCAPED_UNICODE);

    exit;
}
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "detail" => "Método não permitido"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    http_response_code(400);

    echo json_encode([
        "detail" => "Dados inválidos"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$camposObrigatorios = [
    "tipo",
    "localidade",
    "vivencia",
    "tempo",
    "detalhes"
];

foreach ($camposObrigatorios as $campo) {
    if (
        !isset($dados[$campo]) ||
        trim((string) $dados[$campo]) === ""
    ) {
        http_response_code(400);

        echo json_encode([
            "detail" => "Campo obrigatório ausente: " . $campo
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}

$protocolo = gerarProtocolo();

$stmt = $pdo->prepare("
    SELECT id
    FROM reports
    WHERE protocolo = ?
");

$stmt->execute([$protocolo]);

while ($stmt->fetch()) {
    $protocolo = gerarProtocolo();
    $stmt->execute([$protocolo]);
}

$bytes = random_bytes(16);

$bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
$bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);

$uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO reports (
            uuid,
            protocolo,
            tipo,
            localidade,
            vivencia,
            tempo,
            detalhes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $uuid,
        $protocolo,
        $dados["tipo"],
        $dados["localidade"],
        $dados["vivencia"],
        $dados["tempo"],
        $dados["detalhes"]
    ]);

    $reportId = $pdo->lastInsertId();

    $stmtData = $pdo->prepare("
        SELECT created_at
        FROM reports
        WHERE id = ?
    ");

    $stmtData->execute([$reportId]);

    $createdAt = $stmtData->fetchColumn();

    if (!empty($dados["denunciados"])) {

        $stmtDenunciado = $pdo->prepare("
            INSERT INTO denunciados (
                report_id,
                cargo,
                turma,
                nome
            )
            VALUES (?, ?, ?, ?)
        ");

        foreach ($dados["denunciados"] as $denunciado) {
            $stmtDenunciado->execute([
                $reportId,
                $denunciado["cargo"],
                $denunciado["turma"] ?? null,
                $denunciado["nome"] ?? null
            ]);
        }
    }

    $pdo->commit();

} catch (Throwable $erro) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "detail" => "Erro ao salvar relato"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

http_response_code(201);

echo json_encode([
    "id" => $uuid,
    "protocolo" => $protocolo,
    "tipo" => $dados["tipo"],
    "localidade" => $dados["localidade"],
    "vivencia" => $dados["vivencia"],
    "tempo" => $dados["tempo"],
    "detalhes" => $dados["detalhes"],
    "denunciados" => $dados["denunciados"] ?? [],
    "created_at" => $createdAt
], JSON_UNESCAPED_UNICODE);