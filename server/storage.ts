import { puzzles, type Puzzle } from "@shared/schema";

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

class GameDictionary {
  constructor() {
    console.log('Dictionary initialized with simple validation');
  }

  isValidWord(word: string): boolean {
    // Basic validation rules:
    // 1. Must be at least 4 letters
    // 2. Must contain only letters
    // 3. Must be a reasonable length (under 15 letters)
    const normalizedWord = word.toLowerCase();
    if (normalizedWord.length < 4 || normalizedWord.length > 15) {
      return false;
    }
    return /^[a-z]+$/.test(normalizedWord);
  }

  filterValidWords(letters: string, centerLetter: string): string[] {
    console.log(`Filtering valid words for letters: ${letters}, center: ${centerLetter}`);
    const possibleWords = this.generatePossibleWords(letters, centerLetter);
    return possibleWords.filter(word => this.isValidWord(word));
  }

  private generatePossibleWords(letters: string, centerLetter: string): string[] {
    const allLetters = (letters + centerLetter).toLowerCase();
    const words: string[] = [];

    // Generate all possible 4-letter combinations
    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < letters.length; j++) {
        for (let k = 0; k < letters.length; k++) {
          const word = centerLetter + letters[i] + letters[j] + letters[k];
          if (this.isWordPossible(word, letters, centerLetter)) {
            words.push(word);
          }
        }
      }
    }

    // Generate 5-letter combinations
    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < letters.length; j++) {
        for (let k = 0; k < letters.length; k++) {
          for (let l = 0; l < letters.length; l++) {
            const word = centerLetter + letters[i] + letters[j] + letters[k] + letters[l];
            if (this.isWordPossible(word, letters, centerLetter)) {
              words.push(word);
            }
          }
        }
      }
    }

    return Array.from(new Set(words)); // Remove duplicates
  }

  private isWordPossible(word: string, letters: string, centerLetter: string): boolean {
    const normalizedWord = word.toLowerCase();
    const normalizedCenter = centerLetter.toLowerCase();
    const normalizedLetters = letters.toLowerCase();

    // Word must be at least 4 letters long
    if (normalizedWord.length < 4) {
      return false;
    }

    // Word must contain the center letter
    if (!normalizedWord.includes(normalizedCenter)) {
      return false;
    }

    // Create letter frequency map for available letters
    const availableLetters = new Map<string, number>();
    normalizedLetters.split('').forEach(letter => {
      availableLetters.set(letter, (availableLetters.get(letter) || 0) + 1);
    });
    availableLetters.set(normalizedCenter, (availableLetters.get(normalizedCenter) || 0) + 1);

    // Count required letters in the word
    const wordFreq = new Map<string, number>();
    for (const char of normalizedWord) {
      wordFreq.set(char, (wordFreq.get(char) || 0) + 1);
    }

    // Check if we have enough of each letter
    let isValid = true;
    wordFreq.forEach((needed, char) => {
      const available = availableLetters.get(char) || 0;
      if (needed > available) {
        isValid = false;
      }
    });

    return isValid;
  }
}

// Initialize dictionary with simple validation
const DICTIONARY = new GameDictionary();

export interface IStorage {
  getDailyPuzzle(): Promise<Puzzle>;
  generateNewPuzzle(): Promise<Puzzle>;
  validateWord(word: string, puzzleId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private puzzles: Map<number, Puzzle>;
  private currentPuzzleId: number;

  constructor() {
    this.puzzles = new Map();
    this.currentPuzzleId = 1;
    this.generateNewPuzzle(); // Initialize with first puzzle
  }

  private generateLetterSet(): { letters: string; centerLetter: string; validWords: string[] } {
    console.log("Generating new letter set...");

    // Add 2-3 vowels
    const letterArray: string[] = [];
    const numVowels = Math.floor(Math.random() * 2) + 2;
    const availableVowels = VOWELS.split('');
    for (let j = 0; j < numVowels; j++) {
      const index = Math.floor(Math.random() * availableVowels.length);
      letterArray.push(availableVowels.splice(index, 1)[0]);
    }

    // Fill rest with consonants
    const availableConsonants = CONSONANTS.split('');
    while (letterArray.length < 6) {
      const index = Math.floor(Math.random() * availableConsonants.length);
      letterArray.push(availableConsonants.splice(index, 1)[0]);
    }

    const letters = letterArray.sort(() => Math.random() - 0.5).join('');

    // Select center letter (randomly choose between vowel and consonant)
    const isVowel = Math.random() < 0.5;
    const letterPool = isVowel ? VOWELS : CONSONANTS;
    const centerLetter = letterPool[Math.floor(Math.random() * letterPool.length)];

    // Generate valid words
    const validWords = DICTIONARY.filterValidWords(letters, centerLetter);

    return { letters, centerLetter, validWords };
  }

  async generateNewPuzzle(): Promise<Puzzle> {
    console.log("Generating new puzzle...");
    this.puzzles.clear();

    const { letters, centerLetter, validWords } = this.generateLetterSet();
    console.log(`Generated puzzle: Letters=${letters}, Center=${centerLetter}, Words=${validWords.length}`);

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

  async getDailyPuzzle(): Promise<Puzzle> {
    const puzzle = this.puzzles.get(this.currentPuzzleId - 1);
    if (!puzzle) {
      return this.generateNewPuzzle();
    }
    return puzzle;
  }

  async validateWord(word: string, puzzleId: number): Promise<boolean> {
    const puzzle = this.puzzles.get(puzzleId);
    if (!puzzle) return false;

    const normalizedWord = word.toLowerCase();
    return puzzle.validWords.includes(normalizedWord);
  }
}

export const storage = new MemStorage();