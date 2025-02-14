import { puzzles, type Puzzle } from "@shared/schema";

const DICTIONARY = new Set([
  "hello", "world", "spell", "bee", "sweet", "honey", "hive",
  "buzz", "wing", "nectar", "pollen", "queen", "drone", "swarm"
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
    return puzzle.validWords.includes(word.toLowerCase());
  }
}

export const storage = new MemStorage();
