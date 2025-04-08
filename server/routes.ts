import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wordSubmissionSchema } from "@shared/schema";
import { wordleService } from "./services/wordle";
import { connectionsService } from "./services/connections";

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

  // Wordle API endpoints
  app.get("/api/wordle", (_req, res) => {
    // Only return the word ID to prevent cheating
    const dailyWord = wordleService.getDailyWord();
    res.json({ 
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      wordLength: dailyWord.length
    });
  });

  app.post("/api/wordle/validate", (req, res) => {
    const { word } = req.body;
    
    if (!word || typeof word !== 'string' || word.length !== 5) {
      return res.status(400).json({ error: "Invalid word format" });
    }
    
    const isValid = wordleService.isValidWord(word);
    res.json({ valid: isValid });
  });
  
  // For development purposes only - would be removed in production
  app.get("/api/wordle/daily-word-dev", (req, res) => {
    const dailyWord = wordleService.getDailyWord();
    res.json({ word: dailyWord });
  });
  
  // Connections game endpoints
  app.get("/api/connections/new", (req, res) => {
    const difficulty = req.query.difficulty as 'easy' | 'medium' | 'hard' || 'medium';
    const gameData = connectionsService.getNewGame(difficulty);
    
    // Flatten and shuffle the words for the frontend
    const allWords = gameData.groups.flatMap(group => group.words);
    const shuffledWords = shuffleArray([...allWords]);
    
    res.json({
      words: shuffledWords,
      difficulty: gameData.difficulty,
      // Don't send the categories to prevent cheating
      gameId: Date.now() // Simple identifier for the current game
    });
  });
  
  app.post("/api/connections/validate", (req, res) => {
    const { words, gameData } = req.body;
    
    if (!words || !Array.isArray(words) || words.length !== 4 || !gameData) {
      return res.status(400).json({ error: "Invalid request format" });
    }
    
    const result = connectionsService.validateSelection(words, gameData);
    res.json(result);
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}