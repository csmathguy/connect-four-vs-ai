import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../index";

describe("POST /api/move", () => {
  it("rejects invalid board shape", async () => {
    const app = createApp();
    const res = await request(app).post("/api/move").send({
      board: [[0, 0, 0]],
      currentPlayer: 2,
      difficulty: "easy"
    });
    expect(res.status).toBe(400);
  });
});

