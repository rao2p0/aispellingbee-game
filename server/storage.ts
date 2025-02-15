import { puzzles, type Puzzle } from "@shared/schema";

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';
const VOWELS = 'AEIOU';

// A small subset of common English words for testing
// In production, this should be replaced with a comprehensive dictionary
const DICTIONARY = new Set([
  "able", "about", "above", "across", "actor", "after", "again", "agree", "allow", "alone",
  "among", "angle", "angry", "animal", "answer", "apple", "argue", "arise", "army", "around",
  "bread", "break", "bring", "brown", "build", "burst", "busy", "butter", "button", "world",
  "claim", "class", "clean", "clear", "clock", "close", "cloud", "coast", "count", "cover",
  "dream", "dress", "drink", "drive", "eager", "early", "earth", "eight", "empty", "enter",
  "field", "fight", "final", "first", "floor", "focus", "force", "frame", "fresh", "front",
  "globe", "glory", "grace", "grade", "grain", "grant", "grass", "great", "green", "group"
]);

export interface IStorage {
  getDailyPuzzle(): Promise<Puzzle>;
  validateWord(word: string, puzzleId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private puzzles: Map<number, Puzzle>;
  private currentPuzzleId: number;

  constructor() {
    this.puzzles = new Map();
    this.currentPuzzleId = 1;
    this.generateNewPuzzle();
  }

  private generateNewPuzzle(): Puzzle {
    // Generate 6 random letters plus 1 center letter
    const letters = this.generateLetterSet();
    const centerLetter = letters[Math.floor(Math.random() * letters.length)];

    // Find all valid words that can be made from these letters
    const validWords = Array.from(DICTIONARY).filter(word => 
      this.isWordPossible(word, letters, centerLetter)
    );

    // Calculate total possible points
    const points = validWords.reduce(
      (total, word) => total + Math.max(1, word.length - 3),
      0
    );

    const puzzle: Puzzle = {
      id: this.currentPuzzleId++,
      letters,
      centerLetter,
      validWords,
      points,
    };

    this.puzzles.set(puzzle.id, puzzle);
    return puzzle;
  }

  private generateLetterSet(): string {
    const letters: string[] = [];

    // Add 2-3 vowels
    const numVowels = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < numVowels; i++) {
      letters.push(VOWELS[Math.floor(Math.random() * VOWELS.length)]);
    }

    // Fill the rest with consonants
    while (letters.length < 7) {
      const consonant = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
      if (!letters.includes(consonant)) {
        letters.push(consonant);
      }
    }

    // Shuffle the array
    return letters.sort(() => Math.random() - 0.5).join('');
  }

  private isWordPossible(word: string, letters: string, centerLetter: string): boolean {
    const normalizedWord = word.toLowerCase();

    // Word must be in dictionary
    if (!DICTIONARY.has(normalizedWord)) return false;

    // Word must be at least 4 letters long
    if (normalizedWord.length < 4) return false;

    // Word must contain the center letter
    if (!normalizedWord.includes(centerLetter.toLowerCase())) return false;

    // Count available letters
    const letterCounts = new Map<string, number>();
    (letters + centerLetter).toLowerCase().split('').forEach(letter => {
      letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
    });

    // Check if word can be formed from available letters
    const wordLetters = normalizedWord.split('');
    for (const letter of wordLetters) {
      const count = letterCounts.get(letter) || 0;
      if (count === 0) return false;
      letterCounts.set(letter, count - 1);
    }

    return true;
  }

  async getDailyPuzzle(): Promise<Puzzle> {
    // Always generate a new puzzle when requested
    return this.generateNewPuzzle();
  }

  async validateWord(word: string, puzzleId: number): Promise<boolean> {
    const puzzle = this.puzzles.get(puzzleId);
    if (!puzzle) return false;

    const normalizedWord = word.toLowerCase();
    return puzzle.validWords.includes(normalizedWord);
  }
}

export const storage = new MemStorage();