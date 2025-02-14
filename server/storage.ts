import { puzzles, type Puzzle } from "@shared/schema";

const DICTIONARY = new Set([
  "hello", "held", "hole", "hold", "wild", "whole", "world",
  "where", "wheel", "wooed", "dowel", "lower", "were", "wore"
]);

export interface IStorage {
  getDailyPuzzle(): Promise<Puzzle>;
  validateWord(word: string, puzzleId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private puzzles: Map<number, Puzzle>;

  constructor() {
    this.puzzles = new Map();
    // Initialize with a sample puzzle
    const samplePuzzle: Puzzle = {
      id: 1,
      letters: "HLOWRDE",
      centerLetter: "L",
      validWords: Array.from(DICTIONARY),
      points: 100,
    };
    this.puzzles.set(1, samplePuzzle);
  }

  async getDailyPuzzle(): Promise<Puzzle> {
    return this.puzzles.get(1)!;
  }

  async validateWord(word: string, puzzleId: number): Promise<boolean> {
    const puzzle = this.puzzles.get(puzzleId);
    if (!puzzle) return false;

    const normalizedWord = word.toLowerCase();
    // Check if the word exists in the valid words list
    if (!puzzle.validWords.includes(normalizedWord)) {
      return false;
    }

    // Ensure the word uses valid letters from the puzzle
    const puzzleLetters = new Set([...puzzle.letters.toLowerCase(), puzzle.centerLetter.toLowerCase()]);
    const wordLetters = new Set(normalizedWord);

    // Check if all letters in the word are available in the puzzle
    for (const letter of wordLetters) {
      if (!puzzleLetters.has(letter)) {
        return false;
      }
    }

    // Check if the word contains the center letter
    if (!normalizedWord.includes(puzzle.centerLetter.toLowerCase())) {
      return false;
    }

    return true;
  }
}

export const storage = new MemStorage();