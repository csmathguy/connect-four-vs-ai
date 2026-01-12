# Connect4 Human vs AI (Agent Guide)

## Core commands (use these)

- Install: `npm install`
- Dev (client + server): `npm run dev`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Tests: `npm run test`
- Production-like local run: `npm run build` then `npm run start`

## Coding conventions

- TypeScript `strict: true` in all packages; no `any` unless unavoidable.
- Prefer pure functions for game logic; keep UI components small and focused.
- Validate all server inputs at runtime (never trust the client).
- Keep types shared by copying minimal `types.ts` between client/server (no extra workspace for now).

## Dependencies (do / do not)

- Do: prefer small, widely used libraries (`zod`, `express`, `vite`, `react`).
- Do: add dependencies only when they reduce complexity or improve safety.
- Do not: add heavy UI frameworks or state management libraries for the starter.
- Do not: add OpenAI client code to the browser bundle.

## Safety and secrets

- Never log or return API keys; keep `OPENAI_API_KEY` server-side only.
- Do not print environment variables in logs or docs.
- The OpenAI provider is optional and must fall back safely to local AI.

## Small-step feature workflow

- Make one focused change at a time (game logic → server → client wiring → polish).
- Add/extend a unit test when changing Connect4 rules or win/draw detection.
- For new API fields: update `server/src/ai/schemas.ts` first, then route logic, then client types.

