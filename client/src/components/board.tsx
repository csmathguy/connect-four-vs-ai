import type { BoardState, Cell } from "../lib/types";

function discClass(cell: Cell): string {
  if (cell === 1) return "disc p1";
  if (cell === 2) return "disc p2";
  return "disc";
}

export function Board({
  board,
  onColumnClick,
  disabled
}: {
  board: BoardState;
  onColumnClick: (column: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="boardOverlay">
      <div className="board" aria-label="Connect4 board">
        {board.flatMap((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="cell">
              <div className={discClass(cell)} />
            </div>
          ))
        )}
      </div>
      <div className="clickLayer" aria-hidden="false">
        {Array.from({ length: 7 }, (_, c) => (
          <button
            key={c}
            className="colButton"
            type="button"
            aria-label={`Drop in column ${c + 1}`}
            onClick={() => onColumnClick(c)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

