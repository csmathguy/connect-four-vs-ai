import { dropPiece, getValidMoves, winnerForBoard } from "../lib/connect4";
import type { BoardState, Player } from "../lib/types";

type MinimaxResult = { score: number; column: number };

function opponent(player: Player): Player {
  return player === 1 ? 2 : 1;
}

function scoreTerminal(board: BoardState, maximizingPlayer: Player): number | null {
  const w = winnerForBoard(board);
  if (w === maximizingPlayer) return 1_000_000;
  if (w === opponent(maximizingPlayer)) return -1_000_000;
  return null;
}

function heuristic(board: BoardState, maximizingPlayer: Player): number {
  let score = 0;
  const centerColumn = 3;
  for (let r = 0; r < 6; r++) {
    if (board[r]?.[centerColumn] === maximizingPlayer) score += 3;
    if (board[r]?.[centerColumn] === opponent(maximizingPlayer)) score -= 3;
  }
  return score;
}

function minimax(
  board: BoardState,
  depth: number,
  maximizingPlayer: Player,
  currentTurn: Player,
  alpha: number,
  beta: number
): MinimaxResult {
  const terminalScore = scoreTerminal(board, maximizingPlayer);
  const moves = getValidMoves(board);
  if (terminalScore !== null) return { score: terminalScore, column: moves[0] ?? 0 };
  if (depth === 0 || moves.length === 0) return { score: heuristic(board, maximizingPlayer), column: moves[0] ?? 0 };

  const isMaximizingTurn = currentTurn === maximizingPlayer;

  let best: MinimaxResult = { score: isMaximizingTurn ? -Infinity : Infinity, column: moves[0]! };

  for (const col of moves) {
    const nextBoard = dropPiece(board, col, currentTurn);
    const child = minimax(nextBoard, depth - 1, maximizingPlayer, opponent(currentTurn), alpha, beta);
    const candidate: MinimaxResult = { score: child.score, column: col };

    if (isMaximizingTurn) {
      if (candidate.score > best.score) best = candidate;
      alpha = Math.max(alpha, candidate.score);
    } else {
      if (candidate.score < best.score) best = candidate;
      beta = Math.min(beta, candidate.score);
    }
    if (alpha >= beta) break;
  }

  return best;
}

export function pickMoveRandom(board: BoardState): number {
  const moves = getValidMoves(board);
  if (moves.length === 0) throw new Error("No valid moves");
  return moves[Math.floor(Math.random() * moves.length)]!;
}

export function pickMoveMinimax(board: BoardState, player: Player, depth: number): number {
  const moves = getValidMoves(board);
  if (moves.length === 0) throw new Error("No valid moves");
  const { column } = minimax(board, depth, player, player, -Infinity, Infinity);
  return column;
}

