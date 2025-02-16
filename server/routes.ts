import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wordSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/puzzle", async (_req, res) => {
    const puzzle = await storage.getDailyPuzzle();
    res.json(puzzle);
  });

  app.post("/api/puzzle/new", async (req, res) => {
    const isEasyMode = req.body.isEasyMode === true;
    const puzzle = await storage.generateNewPuzzle(isEasyMode);
    res.json(puzzle);
  });

  app.get("/api/puzzle/words", async (_req, res) => {
    const puzzle = await storage.getDailyPuzzle();
    res.json({
      letters: puzzle.letters,
      centerLetter: puzzle.centerLetter,
      validWords: puzzle.validWords.sort(),
      totalWords: puzzle.validWords.length,
      points: puzzle.points
    });
  });

  app.post("/api/validate", async (req, res) => {
    const result = wordSubmissionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid word" });
    }

    try {
      const isValid = await storage.validateWord(result.data.word, result.data.puzzleId);
      res.json({ valid: isValid });
    } catch (error) {
      console.error('Error validating word:', error);
      res.status(500).json({ error: "Error validating word" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}