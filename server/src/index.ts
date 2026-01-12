import path from "node:path";
import fs from "node:fs";
import express from "express";
import dotenv from "dotenv";
import { createHealthRouter } from "./routes/health";
import { createMoveRouter } from "./routes/move";
import { difficultyConfigForClient, loadDifficultyConfig } from "./ai/difficulty";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "20kb" }));

  const difficultyConfig = loadDifficultyConfig();

  app.get("/api/config", (_req, res) => {
    res.json(difficultyConfigForClient(difficultyConfig));
  });

  app.use("/api", createHealthRouter());
  app.use("/api", createMoveRouter(difficultyConfig));

  const clientDist = path.join(process.cwd(), "..", "client", "dist");
  const indexHtml = path.join(clientDist, "index.html");
  if (fs.existsSync(indexHtml)) {
    app.use(express.static(clientDist));
    app.get("*", (_req, res) => {
      res.sendFile(indexHtml);
    });
  }

  return app;
}

export function startServer() {
  const port = Number(process.env.PORT ?? "4444");
  const app = createApp();
  app.listen(port, () => {
    // Intentionally minimal: do not log env vars or secrets.
    console.log(`Server listening on http://localhost:${port}`);
  });
}

if (require.main === module) startServer();
