import type { BoardState, Cell, Player } from "./types";

export const ROWS = 6 as const;
export const COLUMNS = 7 as const;

export function createEmptyBoard(): BoardState {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLUMNS }, () => 0 as Cell));
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map((row) => row.slice()) as BoardState;
}

export function getValidMoves(board: BoardState): number[] {
  const moves: number[] = [];
  for (let c = 0; c < COLUMNS; c++) {
    if (board[0]?.[c] === 0) moves.push(c);
  }
  return moves;
}

export function dropPiece(board: BoardState, column: number, player: Player): BoardState {
  if (!Number.isInteger(column) || column < 0 || column >= COLUMNS) {
    throw new Error(`Invalid column: ${column}`);
  }
  const next = cloneBoard(board);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (next[r]?.[column] === 0) {
      next[r]![column] = player;
      return next;
    }
  }
  throw new Error(`Column ${column} is full`);
}

function winnerAt(board: BoardState, r: number, c: number): Player | 0 {
  const cell = board[r]?.[c] ?? 0;
  if (cell === 0) return 0;
  const player = cell as Player;

  const directions: Array<[dr: number, dc: number]> = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ];

  for (const [dr, dc] of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const rr = r + dr * i;
      const cc = c + dc * i;
      if (board[rr]?.[cc] === player) count++;
      else break;
    }
    if (count >= 4) return player;
  }
  return 0;
}

export function winnerForBoard(board: BoardState): Player | 0 {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const w = winnerAt(board, r, c);
      if (w) return w;
    }
  }
  return 0;
}

export function isDraw(board: BoardState): boolean {
  if (winnerForBoard(board) !== 0) return false;
  return getValidMoves(board).length === 0;
}

