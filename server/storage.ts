import { puzzles, type Puzzle } from "@shared/schema";
import words from 'an-array-of-english-words/index.json' assert { type: 'json' };
import { fileURLToPath } from 'url';
import path from "path";
// Constants for word validation
const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 15;

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

// Load words from dictionary
const WORDS = new Set(
  words.filter(word => 
    word.length >= MIN_WORD_LENGTH && 
    word.length <= MAX_WORD_LENGTH && 
    /^[a-z]+$/.test(word)
  )
);



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class GameDictionary {
  filterValidWords(letters: string, centerLetter: string, isEasyMode: boolean = false): string[] {
    const allLetters = (letters + centerLetter).toLowerCase();
    const centerLetterLower = centerLetter.toLowerCase();

    return Array.from(WORDS).filter(word => {
      const basicValid = word.length >= MIN_WORD_LENGTH &&
        word.includes(centerLetterLower) &&
        this.canMakeWord(word, allLetters);

      if (!basicValid) return false;

      if (isEasyMode) {
        // In easy mode, exclude words with complex patterns
        const isComplex = word.length > 8 || // Cap word length
          /[bcdfghjklmnpqrstvwxyz]{4,}/i.test(word) || // Fewer consecutive consonants
          /[aeiou]{3,}/i.test(word); // Fewer consecutive vowels
        return !isComplex;
      }

      return true;
    });
  }

  private canMakeWord(word: string, letters: string): boolean {
    const availableLetters = new Set(letters.toLowerCase());
    return word.split('').every(char => availableLetters.has(char));
  }

  validateWord(word: string, letters: string, centerLetter: string): boolean {
    return this.filterValidWords(letters, centerLetter).includes(word.toLowerCase());
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

  async validateWord(word: string, puzzleId: number): Promise<boolean> {
    const puzzle = this.puzzles.get(puzzleId);
    if (!puzzle) return false;

    const normalizedWord = word.toLowerCase();

    // First check if the word is in our pre-computed valid words list
    const isValid = puzzle.validWords.includes(normalizedWord);

    // For debugging purposes, log rejected words
    if (!isValid) {
      console.log(`Word ${normalizedWord} was rejected. Valid words:`, puzzle.validWords);
    }

    return isValid;
  }

  async getDailyPuzzle(): Promise<Puzzle> {
    const puzzle = this.puzzles.get(this.currentPuzzleId - 1);
    if (!puzzle) {
      return this.generateNewPuzzle();
    }
    return puzzle;
  }

  async generateNewPuzzle(isEasyMode: boolean = false): Promise<Puzzle> {
    console.log("Generating new puzzle...");
    this.puzzles.clear();

    const result = await this.generateLetterSet(isEasyMode);
    const { letters, centerLetter, validWords } = result;
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

  private async generateLetterSet(isEasyMode: boolean = false): Promise<{ letters: string; centerLetter: string; validWords: string[] }> {
    console.log(`Generating new ${isEasyMode ? 'easy' : 'challenge'} letter set...`);

    const generateAndCheck = async () => {
      // Find a 7-letter word with unique letters
      const sevenLetterWords = Array.from(WORDS).filter(word => {
        if (word.length !== 7) return false;
        const uniqueLetters = new Set(word.toUpperCase());
        if (uniqueLetters.size !== 7) return false;
        
        if (isEasyMode) {
          // Reject words with difficult letters in easy mode
          if (/[JQXZ]/.test(word.toUpperCase())) return false;
        }
        return true;
      });

      if (sevenLetterWords.length === 0) return null;
      
      // Pick a random word
      const baseWord = sevenLetterWords[Math.floor(Math.random() * sevenLetterWords.length)].toUpperCase();
      console.log('Selected base word:', baseWord);

      // Identify vowels and consonants
      const letters = baseWord.split('');
      const vowels = letters.filter(l => 'AEIOU'.includes(l));
      const consonants = letters.filter(l => !'AEIOU'.includes(l));

      // Pick center letter based on mode
      let centerLetter;
      if (isEasyMode) {
        centerLetter = vowels[Math.floor(Math.random() * vowels.length)];
      } else {
        centerLetter = consonants[Math.floor(Math.random() * consonants.length)];
      }

      // Generate valid words using the base word
      const validWords = await DICTIONARY.filterValidWords(letters, centerLetter, isEasyMode);

      if (isEasyMode) {
        // Filter out complex words
        const filteredWords = validWords.filter(word => 
          word.length <= 8 && // Not too long
          !/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(word) && // No long consonant chains
          !/[aeiou]{3,}/i.test(word) // No long vowel chains
        );

        // Ensure we have enough simple words
        if (filteredWords.length < validWords.length * 0.75) {
          return null;
        }

        // Return with filtered words
        return { letters, centerLetter, validWords: filteredWords };
      }

      const minWords = isEasyMode ? 15 : 5;
      if (validWords.length < minWords) {
        return null;
      }

      return { letters, centerLetter, validWords };
    };

    let bestResult = null;
    let maxWordCount = 0;

    // Try up to 15 times to generate a valid set
    for (let attempt = 0; attempt < 15; attempt++) {
      const result = await generateAndCheck();
      if (result && result.validWords.length > maxWordCount) {
        maxWordCount = result.validWords.length;
        bestResult = result;
        
        // If we found a good puzzle, we can stop early
        if (maxWordCount >= 20) {
          break;
        }
      }
      console.log(`Attempt ${attempt + 1}: found ${result?.validWords.length || 0} words`);
    }

    if (bestResult && bestResult.validWords.length >= (isEasyMode ? 15 : 5)) {
      return bestResult;
    }

    // If we still don't have a valid puzzle, use a known good fallback
    console.log("Using fallback puzzle");
    return { letters: "AEIOUS", centerLetter: "T", validWords: ["test", "seat", "east", "ease", "tea", "ate", "eat", "sat", "sea", "set", "site", "suit", "suite"] };
  }
}

export const storage = new MemStorage();