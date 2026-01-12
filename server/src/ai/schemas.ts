import { z } from "zod";

export const cellSchema = z.union([z.literal(0), z.literal(1), z.literal(2)]);

export const boardSchema = z
  .array(z.array(cellSchema))
  .length(6)
  .refine((rows) => rows.every((r) => r.length === 7), { message: "Board must be 6x7" });

export const moveRequestSchema = z.object({
  board: boardSchema,
  currentPlayer: z.literal(2),
  difficulty: z.string().min(1)
});

export const difficultyPresetSchema = z.object({
  label: z.string().min(1),
  provider: z.union([z.literal("local"), z.literal("openai")]),
  strategy: z.union([z.literal("random"), z.literal("minimax")]),
  searchDepth: z.number().int().min(0).max(10)
});

export const difficultyFileSchema = z.object({
  defaultDifficulty: z.string().min(1),
  presets: z.record(difficultyPresetSchema)
});

