# Project-local Codex CLI home

This repo includes a project-local Codex home folder at `.codex/`.

## Run Codex CLI using this project home

In PowerShell:

```powershell
$env:CODEX_HOME = "$pwd\\.codex"
codex
```

## Prompts

- Bootstrap prompt: `.codex/prompts/bootstrap.md`
- Dev run prompt: `.codex/prompts/run_dev.md`

Open a prompt file and paste it into Codex when you want a guided workflow.

