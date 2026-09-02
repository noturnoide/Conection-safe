<?php

header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "message" => "Canal de Escuta Anônima - API"
], JSON_UNESCAPED_UNICODE);
