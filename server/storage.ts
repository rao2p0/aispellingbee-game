import { puzzles, type Puzzle } from "@shared/schema";

const DICTIONARY = new Set([
  "hold", "word", "lord", "world", "whole", "droll", 
  "howl", "door", "rode", "roll", "doll", "wore"
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
      points: Array.from(DICTIONARY).reduce((total, word) => total + Math.max(1, word.length - 3), 0),
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

    // Check if word is at least 4 letters long
    if (normalizedWord.length < 4) {
      return false;
    }

    // Check if the word contains the center letter
    if (!normalizedWord.includes(puzzle.centerLetter.toLowerCase())) {
      return false;
    }

    // Create a map of available letters and their counts from the puzzle
    const letterCounts = new Map<string, number>();
    (puzzle.letters + puzzle.centerLetter).toLowerCase().split('').forEach(letter => {
      letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
    });

    // Check if each letter in the word can be formed from available letters
    for (const letter of normalizedWord) {
      const availableCount = letterCounts.get(letter) || 0;
      if (availableCount === 0) {
        return false;
      }
      letterCounts.set(letter, availableCount - 1);
    }

    // Check if the word exists in the valid words list
    return puzzle.validWords.includes(normalizedWord);
  }
}

export const storage = new MemStorage();