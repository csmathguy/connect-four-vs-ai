# Connect4 Human vs AI

A starter template for a local Connect4 game with a simple web GUI (React) and an API server (Express). Play Human (Player 1) vs AI (Player 2). The AI defaults to a local fallback and can optionally call OpenAI server-side when configured.

## Install

Prerequisites: Node.js 18+ and npm.

```bash
npm install
```

## Run (dev)

Runs:
- Server on `PORT` (default `4444`)
- Vite client on `4445` with `/api` proxied to the server

```bash
npm run dev
```

Open `http://localhost:4445`.

## Run (production-like locally)

Build the client and server, then start the server which serves the built client assets:

```bash
npm run build
npm run start
```

Open `http://localhost:4444` (or your `PORT`).

## Configure AI provider and difficulty

Difficulty presets live in `server/ai_difficulty.json` and are loaded at server startup. You can change strategy/provider/depth without code changes.

Server environment config:

  - Copy `server/env.example` to `server/.env` (optional)
  - Set:
  - `PORT` (default `4444`)
  - `OPENAI_API_KEY` (optional; enables OpenAI provider for presets that request it)
  - `OPENAI_MODEL` (optional; defaults in code)

The client fetches available difficulties from `GET /api/config`.

## Security notes

- API keys are read only by the server from environment variables.
- The browser never receives `OPENAI_API_KEY` or any secret; the client only calls `/api/*`.
- Server validates all inputs and rejects invalid boards and moves.

## Roadmap

- Improve local AI heuristics and add more tests
- Add better UI (hover previews, animations, accessibility)
- Add move history + undo
- Add more robust OpenAI response validation and retry logic

