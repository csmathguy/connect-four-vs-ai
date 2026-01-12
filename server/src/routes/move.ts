import { Router } from "express";
import type { DifficultyConfig } from "../ai/difficulty";
import { pickAiMove } from "../ai/ai";
import { getValidMoves, isDraw, winnerForBoard } from "../lib/connect4";
import { moveRequestSchema } from "../ai/schemas";

export function createMoveRouter(difficultyConfig: DifficultyConfig) {
  const router = Router();

  router.post("/move", async (req, res) => {
    const parsed = moveRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
    }

    const { board, difficulty } = parsed.data;

    const preset = difficultyConfig.presets[difficulty];
    if (!preset) {
      return res.status(400).json({ error: "Unknown difficulty" });
    }

    if (winnerForBoard(board) !== 0) {
      return res.status(400).json({ error: "Game is already finished" });
    }
    if (isDraw(board)) {
      return res.status(400).json({ error: "Game is a draw" });
    }

    const validMoves = getValidMoves(board);
    if (validMoves.length === 0) {
      return res.status(400).json({ error: "No valid moves" });
    }

    try {
      const move = await pickAiMove(board, preset);
      return res.json(move);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return res.status(500).json({ error: message });
    }
  });

  return router;
}

