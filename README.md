# Here are your Instructions
backend/       → backend original em Python/FastAPI (referência)
backend_php/   → backend convertido para PHP + PDO + MySQL
frontend/      → interface React do Canal de Escuta

reports.php (NO PLURAL): criação e listagem geral dos relatos. A criação é pública; a listagem geral é restrita à supervisão.

report.php (NO SINGULAR): consulta individual de um relato por protocolo, utilizada pelo canal público.


para ativar o backend é necessário, na raiz do projeto: /usr/bin/php8.3 -S 127.0.0.1:8000 -t backend_php backend_php/router.php

para ativar o canal pelo terminal é necessario npm start na pasta frontend

o npm (seja la por qual motivo) só está funcionando se a porta 8000 estiver com a visibilidade me PUBLICA
