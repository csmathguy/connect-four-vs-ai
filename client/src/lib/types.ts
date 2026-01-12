export type Cell = 0 | 1 | 2;
export type Player = 1 | 2;
export type BoardState = Cell[][];

export type Provider = "local" | "openai";

export type DifficultyPreset = {
  key: string;
  label: string;
};

export type DifficultyConfigResponse = {
  defaultDifficulty: string;
  presets: DifficultyPreset[];
};

