import type { DifficultyPreset } from "./difficulty";
import { getValidMoves } from "../lib/connect4";
import type { BoardState } from "../lib/types";

type OpenAIResponse = {
  choices?: Array<{
    message?: { content?: string | null };
  }>;
  error?: { message?: string };
};

export async function pickMoveOpenAI(board: BoardState, preset: DifficultyPreset): Promise<number> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const validMoves = getValidMoves(board);
  if (validMoves.length === 0) throw new Error("No valid moves");

  const system = [
    "You are a Connect4 move generator.",
    "Return ONLY strict JSON with shape: {\"column\": <int>}.",
    "column must be an integer between 0 and 6 inclusive.",
    "Never include any other keys or text."
  ].join("\n");

  const user = JSON.stringify({
    board,
    player: 2,
    difficulty: preset.label,
    validMoves
  });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    })
  });

  const json = (await response.json()) as OpenAIResponse;
  if (!response.ok) {
    throw new Error(json.error?.message ?? `OpenAI request failed: ${response.status}`);
  }

  const content = json.choices?.[0]?.message?.content ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("OpenAI response was not valid JSON");
  }
  const column = (parsed as { column?: unknown }).column;
  if (!Number.isInteger(column)) throw new Error("OpenAI response missing integer column");

  const col = Number(column);
  if (!validMoves.includes(col)) throw new Error("OpenAI returned an illegal column");
  return col;
}

