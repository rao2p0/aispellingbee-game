import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wordSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/puzzle", async (_req, res) => {
    const puzzle = await storage.getDailyPuzzle();
    res.json(puzzle);
  });

  app.post("/api/puzzle/new", async (_req, res) => {
    const puzzle = await storage.generateNewPuzzle();
    res.json(puzzle);
  });

  app.post("/api/validate", async (req, res) => {
    const result = wordSubmissionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid word" });
    }

    const isValid = await storage.validateWord(result.data.word, result.data.puzzleId);
    res.json({ valid: isValid });
  });

  const httpServer = createServer(app);
  return httpServer;
}