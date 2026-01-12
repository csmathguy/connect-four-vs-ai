import { useEffect, useMemo, useState } from "react";
import { Board } from "./components/board";
import { Controls } from "./components/controls";
import { createEmptyBoard, dropPiece, isDraw, winnerForBoard } from "./lib/connect4";
import type { BoardState, DifficultyConfigResponse, Player, Provider } from "./lib/types";

async function fetchDifficultyConfig(): Promise<DifficultyConfigResponse> {
  const response = await fetch("/api/config");
  if (!response.ok) throw new Error(`Config request failed: ${response.status}`);
  return (await response.json()) as DifficultyConfigResponse;
}

type MoveResponse = { column: number; provider: Provider; notes: string };

async function fetchAiMove(board: BoardState, difficulty: string): Promise<MoveResponse> {
  const response = await fetch("/api/move", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ board, currentPlayer: 2, difficulty })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Move request failed: ${response.status} ${text}`);
  }
  return (await response.json()) as MoveResponse;
}

export function App() {
  const [board, setBoard] = useState<BoardState>(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 0>(0);
  const [draw, setDraw] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [lastProvider, setLastProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [difficultyConfig, setDifficultyConfig] = useState<DifficultyConfigResponse | null>(null);
  const [difficulty, setDifficulty] = useState<string>("easy");

  useEffect(() => {
    fetchDifficultyConfig()
      .then((cfg) => {
        setDifficultyConfig(cfg);
        setDifficulty(cfg.defaultDifficulty);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  const status = useMemo(() => {
    if (winner) return `Winner: Player ${winner}`;
    if (draw) return "Draw";
    if (isAiThinking) return "AI is thinking...";
    return currentPlayer === 1 ? "Your turn" : "AI turn";
  }, [currentPlayer, draw, isAiThinking, winner]);

  function reset() {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setWinner(0);
    setDraw(false);
    setIsAiThinking(false);
    setLastProvider(null);
    setError(null);
  }

  async function onColumnClick(column: number) {
    setError(null);
    if (winner || draw || isAiThinking) return;
    if (currentPlayer !== 1) return;

    let nextBoard: BoardState;
    try {
      nextBoard = dropPiece(board, column, 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return;
    }

    const humanWinner = winnerForBoard(nextBoard);
    if (humanWinner) {
      setBoard(nextBoard);
      setWinner(humanWinner);
      return;
    }
    if (isDraw(nextBoard)) {
      setBoard(nextBoard);
      setDraw(true);
      return;
    }

    setBoard(nextBoard);
    setCurrentPlayer(2);
    setIsAiThinking(true);

    try {
      const aiMove = await fetchAiMove(nextBoard, difficulty);
      setLastProvider(aiMove.provider);
      const afterAiBoard = dropPiece(nextBoard, aiMove.column, 2);
      const aiWinner = winnerForBoard(afterAiBoard);
      setBoard(afterAiBoard);
      if (aiWinner) {
        setWinner(aiWinner);
        return;
      }
      if (isDraw(afterAiBoard)) {
        setDraw(true);
        return;
      }
      setCurrentPlayer(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setCurrentPlayer(1);
    } finally {
      setIsAiThinking(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Connect4 Human vs AI</h1>
        <p>Click a column to drop a piece. You are Player 1. The AI is Player 2.</p>
      </header>

      <Controls
        difficultyConfig={difficultyConfig}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onReset={reset}
        disabled={isAiThinking}
      />

      <Board board={board} onColumnClick={onColumnClick} disabled={winner !== 0 || draw || isAiThinking} />

      <div className="status">
        <div>{status}</div>
        <div className="meta">
          <span>Last AI provider: {lastProvider ?? "—"}</span>
        </div>
        {error ? <div className="error">{error}</div> : null}
      </div>
    </div>
  );
}

