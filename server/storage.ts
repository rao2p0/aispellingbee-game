import { puzzles, type Puzzle } from "@shared/schema";
import { dictionaryService } from "./services/dictionary";

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

// Dictionary class to handle word management
class GameDictionary {
  constructor() {
    console.log('Dictionary initialized with API validation');
  }

  async isValidWord(word: string): Promise<boolean> {
    const normalizedWord = word.toLowerCase();
    const isValid = await dictionaryService.isValidWord(normalizedWord);
    console.log(`Dictionary API check for "${word}": ${isValid}`);
    return isValid;
  }

  async filterValidWords(letters: string, centerLetter: string): Promise<string[]> {
    console.log(`Filtering valid words for letters: ${letters}, center: ${centerLetter}`);

    // Generate possible words from letters (basic validation)
    const possibleWords = this.generatePossibleWords(letters, centerLetter);

    // Validate each word with the dictionary API
    const validWords = await Promise.all(
      possibleWords.map(async (word) => {
        const isValid = await this.isValidWord(word);
        return isValid ? word : null;
      })
    );

    return validWords.filter((word): word is string => word !== null);
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

    return [...new Set(words)]; // Remove duplicates
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
    availableLetters.set(normalizedCenter, 999);

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

// Initialize dictionary with API validation
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

  private async generateLetterSet(): Promise<{ letters: string; centerLetter: string; validWords: string[] }> {
    console.log("Generating new letter set...");
    // Try only 10 attempts max to avoid too many API calls
    const attempts = 10;
    let bestAttempt: { letters: string; centerLetter: string; validWords: string[]; count: number } | null = null;

    for (let i = 0; i < attempts; i++) {
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

      // Try both vowels and consonants as center letters
      for (const isVowel of [true, false]) {
        const letterPool = isVowel ? VOWELS : CONSONANTS;
        const centerLetter = letterPool[Math.floor(Math.random() * letterPool.length)];

        if (!letters.includes(centerLetter)) {
          const validWords = await DICTIONARY.filterValidWords(letters, centerLetter);
          console.log(`Attempt ${i + 1}: Letters=${letters}, Center=${centerLetter}, Valid words=${validWords.length}`);

          if (!bestAttempt || validWords.length > bestAttempt.count) {
            bestAttempt = { letters, centerLetter, validWords, count: validWords.length };
            // Accept any puzzle with at least 5 valid words
            if (validWords.length >= 5) {
              console.log(`Found good puzzle with ${validWords.length} words`);
              return bestAttempt;
            }
          }
        }
      }
    }

    // Use the best attempt we found, or fall back to a default set
    if (bestAttempt && bestAttempt.count > 0) {
      console.log(`Using best attempt found with ${bestAttempt.count} words`);
      return bestAttempt;
    }

    // Fallback to a guaranteed valid set
    console.log('Using fallback puzzle set');
    const validWords = await DICTIONARY.filterValidWords("AEILNS", "T");
    return {
      letters: "AEILNS",
      centerLetter: "T",
      validWords
    };
  }

  async generateNewPuzzle(): Promise<Puzzle> {
    console.log("Generating new puzzle...");
    this.puzzles.clear();

    const { letters, centerLetter, validWords } = await this.generateLetterSet();
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

    // First check if the word follows game rules
    const isValid = new GameDictionary().isWordPossible(
      normalizedWord,
      puzzle.letters,
      puzzle.centerLetter
    );

    if (!isValid) {
      return false;
    }

    // Then check if it's a valid English word
    return await DICTIONARY.isValidWord(normalizedWord);
  }
}

export const storage = new MemStorage();