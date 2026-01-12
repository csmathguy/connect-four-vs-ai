import type { DifficultyConfigResponse } from "../lib/types";

export function Controls({
  difficultyConfig,
  difficulty,
  onDifficultyChange,
  onReset,
  disabled
}: {
  difficultyConfig: DifficultyConfigResponse | null;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  onReset: () => void;
  disabled: boolean;
}) {
  const presets = difficultyConfig?.presets ?? [
    { key: "easy", label: "Easy" },
    { key: "medium", label: "Medium" },
    { key: "hard", label: "Hard" }
  ];

  return (
    <div className="controls">
      <label>
        Difficulty{" "}
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          disabled={disabled}
        >
          {presets.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={onReset} disabled={disabled}>
        Reset
      </button>
    </div>
  );
}

