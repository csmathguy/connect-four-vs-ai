import fs from "node:fs";
import path from "node:path";
import { difficultyFileSchema } from "./schemas";

export type DifficultyConfig = ReturnType<typeof loadDifficultyConfig>;
export type DifficultyPreset = DifficultyConfig["presets"][string];

export function loadDifficultyConfig() {
  const difficultyPath = path.join(process.cwd(), "ai_difficulty.json");
  const raw = fs.readFileSync(difficultyPath, "utf-8");
  const parsed = difficultyFileSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid ai_difficulty.json:\n${message}`);
  }
  const config = parsed.data;
  if (!config.presets[config.defaultDifficulty]) {
    throw new Error(`Invalid ai_difficulty.json: defaultDifficulty '${config.defaultDifficulty}' not found in presets`);
  }
  return config;
}

export function difficultyConfigForClient(config: ReturnType<typeof loadDifficultyConfig>) {
  return {
    defaultDifficulty: config.defaultDifficulty,
    presets: Object.entries(config.presets).map(([key, preset]) => ({
      key,
      label: preset.label
    }))
  };
}

