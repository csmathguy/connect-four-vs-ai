import { describe, expect, it } from "vitest";
import { createEmptyBoard, dropPiece, winnerForBoard } from "../lib/connect4";

describe("connect4", () => {
  it("detects a simple horizontal win", () => {
    let board = createEmptyBoard();
    board = dropPiece(board, 0, 1);
    board = dropPiece(board, 1, 1);
    board = dropPiece(board, 2, 1);
    board = dropPiece(board, 3, 1);
    expect(winnerForBoard(board)).toBe(1);
  });
});

