CREATE DATABASE IF NOT EXISTS conexao_segura
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE conexao_segura;

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    protocolo VARCHAR(20) NOT NULL UNIQUE,
    tipo VARCHAR(100) NOT NULL,
    localidade VARCHAR(255) NOT NULL,
    vivencia VARCHAR(100) NOT NULL,
    tempo VARCHAR(100) NOT NULL,
    detalhes TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE denunciados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    turma VARCHAR(100) NULL,
    nome VARCHAR(255) NULL,

    FOREIGN KEY (report_id)
        REFERENCES reports(id)
        ON DELETE CASCADE
);

/* para ativar o backend é necessário ➜ /workspaces/Conection-safe (main) /usr/bin/php8.3 -S 127.0.0.1:8000 -t backend_php backend_php/router.php
/* para ativar o bglh pelo terminal é necessario npm start na pasta frontend*/
/* o npm (seja la por qual motivo) só está funcionando se a porta 8000 estiver com a visibilidade me PUBLICA

