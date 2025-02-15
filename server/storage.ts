import { puzzles, type Puzzle } from "@shared/schema";
import wordList from "word-list";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional validation rules
const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 15;
const VOWEL_PATTERN = /[aeiou]/i;

// Load the word list once at startup
const WORDS = new Set(
  fs.readFileSync(path.resolve(__dirname, wordList), 'utf8')
    .split('\n')
    .map(word => word.toLowerCase())
    .filter(word => {
      // Filter out words that don't meet our criteria
      return word.length >= MIN_WORD_LENGTH && 
             word.length <= MAX_WORD_LENGTH &&
             VOWEL_PATTERN.test(word) &&
             /^[a-z]+$/.test(word);
    })
);

class GameDictionary {
  constructor() {
    console.log(`Dictionary initialized with ${WORDS.size} filtered words`);
  }

  isValidWord(word: string): boolean {
    const normalizedWord = word.toLowerCase();
    // Must be at least 4 letters and exist in our filtered word list
    return normalizedWord.length >= MIN_WORD_LENGTH && WORDS.has(normalizedWord);
  }

  filterValidWords(letters: string, centerLetter: string): string[] {
    console.log(`Filtering valid words for letters: ${letters}, center: ${centerLetter}`);
    const possibleWords = this.generatePossibleWords(letters, centerLetter);
    console.log(`Found ${possibleWords.length} possible words before filtering`);
    const validWords = possibleWords.filter(word => this.isValidWord(word));
    console.log(`Found ${validWords.length} valid words after filtering`);
    return validWords;
  }

  private generatePossibleWords(letters: string, centerLetter: string): string[] {
    const allLetters = (letters + centerLetter).toLowerCase();
    const words: string[] = [];

    // Filter words from our dictionary that could be made with these letters
    for (const word of WORDS) {
      if (this.isWordPossible(word, letters, centerLetter)) {
        words.push(word);
      }
    }

    return words;
  }

  private isWordPossible(word: string, letters: string, centerLetter: string): boolean {
    const normalizedWord = word.toLowerCase();
    const normalizedCenter = centerLetter.toLowerCase();
    const normalizedLetters = letters.toLowerCase();

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
      if (needed > available || !availableLetters.has(char)) {
        isValid = false;
      }
    });

    return isValid;
  }
}

// Initialize dictionary with word list
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

    // Retry if we don't have enough valid words
    if (validWords.length < 5) {
      console.log(`Not enough valid words (${validWords.length}), retrying...`);
      return this.generateLetterSet();
    }

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