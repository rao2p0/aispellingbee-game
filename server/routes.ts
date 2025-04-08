import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { wordSubmissionSchema } from "@shared/schema";
import { wordleService } from "./services/wordle";
import { connectionsService } from "./services/connections";
import { hangmanService, Difficulty } from "./services/hangman";
import { wordLadderService, Difficulty as WordLadderDifficulty } from "./services/wordLadder";

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
  
  // Hangman game endpoints
  app.get("/api/hangman/word", (req, res) => {
    try {
      const difficultyParam = (req.query.difficulty as string) || 'medium';
      
      // Convert string to enum value
      let difficulty;
      switch(difficultyParam) {
        case 'easy':
          difficulty = Difficulty.EASY;
          break;
        case 'hard':
          difficulty = Difficulty.HARD;
          break;
        default:
          difficulty = Difficulty.MEDIUM;
      }
      const word = hangmanService.getRandomWord(difficulty);
      
      // Don't send the actual word to the client to prevent cheating
      // Store the word temporarily in storage (in a production app, we'd use a database)
      const wordId = Date.now().toString();
      
      // In a real app, we'd save this to a database
      // For now, we'll just return the word with the response for simplicity
      // In production, this would only send the wordId and length
      res.json({
        wordId,
        word, // We're including the word for development simplicity
        length: word.length,
        difficulty
      });
    } catch (error) {
      console.error('Error getting random word for Hangman:', error);
      res.status(500).json({ error: "Error getting random word" });
    }
  });
  
  app.post("/api/hangman/guess", (req, res) => {
    try {
      const { wordId, word, letter } = req.body;
      
      if (!word || !letter || letter.length !== 1) {
        return res.status(400).json({ error: "Invalid request format" });
      }
      
      // Check if the letter is in the word (case insensitive)
      const upperCaseWord = word.toUpperCase();
      const upperCaseLetter = letter.toUpperCase();
      const positions = [];
      
      for (let i = 0; i < upperCaseWord.length; i++) {
        if (upperCaseWord[i] === upperCaseLetter) {
          positions.push(i);
        }
      }
      
      res.json({
        letter: upperCaseLetter,
        found: positions.length > 0,
        positions,
        wordId
      });
    } catch (error) {
      console.error('Error checking letter guess for Hangman:', error);
      res.status(500).json({ error: "Error checking letter guess" });
    }
  });
  
  app.post("/api/hangman/guess-word", (req, res) => {
    try {
      const { wordId, word, guess } = req.body;
      
      if (!word || !guess) {
        return res.status(400).json({ error: "Invalid request format" });
      }
      
      // Check if the guess matches the word (case insensitive)
      const upperCaseWord = word.toUpperCase();
      const upperCaseGuess = guess.toUpperCase();
      
      const isCorrect = upperCaseWord === upperCaseGuess;
      
      res.json({
        correct: isCorrect,
        wordId
      });
    } catch (error) {
      console.error('Error checking word guess for Hangman:', error);
      res.status(500).json({ error: "Error checking word guess" });
    }
  });

  // Word Ladder game endpoints
  app.get("/api/word-ladder/puzzle", (req, res) => {
    try {
      const difficultyParam = (req.query.difficulty as string) || 'medium';
      
      // Convert string to enum value
      let difficulty;
      switch(difficultyParam) {
        case 'easy':
          difficulty = WordLadderDifficulty.EASY;
          break;
        case 'hard':
          difficulty = WordLadderDifficulty.HARD;
          break;
        default:
          difficulty = WordLadderDifficulty.MEDIUM;
      }
      
      const puzzle = wordLadderService.getRandomPuzzle(difficulty);
      res.json(puzzle);
    } catch (error) {
      console.error('Error getting Word Ladder puzzle:', error);
      res.status(500).json({ error: "Error getting puzzle" });
    }
  });
  
  app.get("/api/word-ladder/puzzle/:id", (req, res) => {
    try {
      const puzzleId = parseInt(req.params.id);
      if (isNaN(puzzleId)) {
        return res.status(400).json({ error: "Invalid puzzle ID" });
      }
      
      const puzzle = wordLadderService.getPuzzleById(puzzleId);
      if (!puzzle) {
        return res.status(404).json({ error: "Puzzle not found" });
      }
      
      res.json(puzzle);
    } catch (error) {
      console.error('Error getting Word Ladder puzzle by ID:', error);
      res.status(500).json({ error: "Error getting puzzle" });
    }
  });
  
  app.post("/api/word-ladder/validate-word", (req, res) => {
    try {
      const { word } = req.body;
      
      if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: "Invalid word format" });
      }
      
      const isValid = wordLadderService.isValidWord(word);
      res.json({ valid: isValid });
    } catch (error) {
      console.error('Error validating word for Word Ladder:', error);
      res.status(500).json({ error: "Error validating word" });
    }
  });
  
  app.post("/api/word-ladder/validate-step", (req, res) => {
    try {
      const { currentWord, nextWord } = req.body;
      
      if (!currentWord || !nextWord || typeof currentWord !== 'string' || typeof nextWord !== 'string') {
        return res.status(400).json({ error: "Invalid word format" });
      }
      
      const isValidWord = wordLadderService.isValidWord(nextWord);
      if (!isValidWord) {
        return res.json({ 
          valid: false, 
          reason: `'${nextWord}' is not a valid word` 
        });
      }
      
      const isValidStep = wordLadderService.isValidStep(currentWord, nextWord);
      if (!isValidStep) {
        return res.json({
          valid: false,
          reason: `Invalid step from '${currentWord}' to '${nextWord}' (must change exactly one letter)`
        });
      }
      
      res.json({ valid: true });
    } catch (error) {
      console.error('Error validating step for Word Ladder:', error);
      res.status(500).json({ error: "Error validating step" });
    }
  });
  
  app.post("/api/word-ladder/validate-solution", (req, res) => {
    try {
      const { startWord, targetWord, solution } = req.body;
      
      if (!startWord || !targetWord || !solution || !Array.isArray(solution)) {
        return res.status(400).json({ error: "Invalid request format" });
      }
      
      const validationResult = wordLadderService.validateSolution(startWord, targetWord, solution);
      res.json(validationResult);
    } catch (error) {
      console.error('Error validating solution for Word Ladder:', error);
      res.status(500).json({ error: "Error validating solution" });
    }
  });
  
  app.get("/api/word-ladder/hints", (req, res) => {
    try {
      const { word } = req.query;
      
      if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: "Invalid word parameter" });
      }
      
      const possibleWords = wordLadderService.findPossibleNextWords(word);
      // Only send a limited number of hints to prevent giving away the solution too easily
      const limitedHints = possibleWords.slice(0, Math.min(5, possibleWords.length));
      
      res.json({ possibleNextWords: limitedHints });
    } catch (error) {
      console.error('Error getting hints for Word Ladder:', error);
      res.status(500).json({ error: "Error getting hints" });
    }
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