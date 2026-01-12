import type { DifficultyPreset } from "./difficulty";
import { getValidMoves } from "../lib/connect4";
import type { BoardState, Provider } from "../lib/types";
import { pickMoveMinimax, pickMoveRandom } from "./local_ai";
import { pickMoveOpenAI } from "./openai_ai";

export async function pickAiMove(
  board: BoardState,
  preset: DifficultyPreset
): Promise<{ column: number; provider: Provider; notes: string }> {
  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) throw new Error("No valid moves");

  if (preset.provider === "openai" && process.env.OPENAI_API_KEY) {
    try {
      const column = await pickMoveOpenAI(board, preset);
      return { column, provider: "openai", notes: "OpenAI move" };
    } catch (err) {
      const notes = err instanceof Error ? `OpenAI failed, falling back: ${err.message}` : "OpenAI failed, falling back";
      const fallback = pickLocal(board, preset);
      return { column: fallback, provider: "local", notes };
    }
  }

  const column = pickLocal(board, preset);
  return { column, provider: "local", notes: "Local move" };
}

function pickLocal(board: BoardState, preset: DifficultyPreset): number {
  if (preset.strategy === "random") return pickMoveRandom(board);
  return pickMoveMinimax(board, 2, preset.searchDepth);
}

