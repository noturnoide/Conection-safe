# PRD — Canal de Escuta Anônima

## Problem Statement
Anonymous listening/reporting channel (pt-BR) for students to report situations (Assédio moral, Assédio sexual, Cyberbullying) at school. Based on two provided HTML questionnaire screens. User asked for a soft green + navy-blue gradient background and stylized heavily-rounded input boxes.

## User Choices
- No login/auth.
- Keep the two questionnaire screens separate (Part 1 → Part 2).
- Keep only the fields present in the original HTML.
- Generate an anonymous protocol code (removable later if needed).
- Owner must be able to view submitted reports + codes later (review page).

## Architecture
- **Backend** (FastAPI + MongoDB): `POST /api/reports` (creates report, unique protocol `ESC-XXXX-XXXX`), `GET /api/reports` (list desc), `GET /api/reports/{protocolo}` (lookup, 404 if missing). Collection: `reports`.
- **Frontend** (React + framer-motion + lenis): routes `/` (Landing hero), `/relatar` (Step 1), `/relatar/detalhes` (Step 2), `/protocolo` (confirmation), `/consultar` (lookup by code), `/revisao` (review all).
- Step data passed between separate screens via `sessionStorage` (`esc_step1`, `esc_protocolo`).
- Design: green+navy mesh gradient, glassmorphism, rounded-[2rem] inputs, kinetic hero reveal, marquee, numbered manifesto chapters, Outfit + DM Sans fonts.

## Implemented (2026-07-26)
- MVP complete and fully tested (19/19 checks passed, backend + frontend + integration).
- Two-step anonymous questionnaire with conditional "turma" field for Aluno, dynamic add/remove of accused people.
- Anonymous protocol generation + copy-to-clipboard.
- Consultar (lookup by protocol) and Revisão (list all reports) pages.

## Backlog / Next
- P1: Optional owner protection for /revisao (JWT or Emergent Google Auth) if privacy of admin view is desired.
- P2: Report status/triage (novo/em análise/resolvido) and notes on the review page.
- P2: Export reports (CSV/PDF) for institutional records.
- P2: Basic analytics (counts by tipo/localidade/tempo).
