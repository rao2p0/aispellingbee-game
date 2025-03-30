import { puzzles, type Puzzle } from "@shared/schema";
import path from "path";
import fs from "fs";

// Word validation constants
const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 9;  // Updated to match requirements
const VALID_WORD_PATTERN = /^[a-z]+$/;

// Load words from files
const SEVEN_LETTER_WORDS = new Set(
  fs.readFileSync('filtered_7_words.txt', 'utf8')
    .split('\n')
    .filter(word => word.trim().length > 0)
    .map(word => word.toLowerCase())
);

const VALID_WORDS = new Set(
  fs.readFileSync('filtered_456789_words.txt', 'utf8')
    .split('\n')
    .filter(word => word.trim().length > 0)
    .map(word => word.toLowerCase())
);



// Using direct path operations


class GameDictionary {
  private isValidWordPattern(word: string): boolean {
    return VALID_WORD_PATTERN.test(word);
  }

  // We are no longer enforcing unique letters in words
  // private hasNoRepeatedLetters(word: string): boolean {
  //   return new Set(word).size === word.length;
  // }

  private containsOnlyAvailableLetters(word: string, availableLetters: string): boolean {
    const letterSet = new Set(availableLetters.toLowerCase());
    return word.split('').every(char => letterSet.has(char));
  }

  private isValidLength(word: string): boolean {
    return word.length >= MIN_WORD_LENGTH && word.length <= MAX_WORD_LENGTH;
  }

  validateWord(word: string, letters: string, centerLetter: string): boolean {
    const normalizedWord = word.toLowerCase();
    const normalizedCenter = centerLetter.toLowerCase();
    const allLetters = (letters + centerLetter).toLowerCase();

    return (
      normalizedWord.length >= MIN_WORD_LENGTH &&
      normalizedWord.length <= MAX_WORD_LENGTH &&
      normalizedWord.includes(normalizedCenter) &&
      normalizedWord.split('').every(char => allLetters.includes(char)) &&
      VALID_WORDS.has(normalizedWord)
    );
  }

  filterValidWords(letters: string, centerLetter: string, isEasyMode: boolean = false): string[] {
    const allLetters = letters + centerLetter;
    const centerLetterLower = centerLetter.toLowerCase();

    return Array.from(VALID_WORDS).filter(word => {
      // Apply core validation rules
      if (!this.validateWord(word, letters, centerLetter)) {
        return false;
      }

      if (isEasyMode) {
        // Additional easy mode restrictions
        const isComplex = 
          /[bcdfghjklmnpqrstvwxyz]{4,}/i.test(word) || // No long consonant chains
          /[aeiou]{3,}/i.test(word); // No long vowel chains
        return !isComplex;
      }

      return true;
    });
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
    // Generate puzzle with mode setting
    const puzzleMode = isEasyMode ? 'easy' : 'challenge';

    this.puzzles.clear();

    const result = await this.generateLetterSet(isEasyMode);
    const { letters, centerLetter, validWords } = result;

    const points = validWords.reduce((total, word) => {
      const basePoints = word.length === 4 ? 1 : word.length;
      const uniqueLetters = new Set(word.split('')).size;
      const bonusPoints = uniqueLetters === 7 ? 7 : 0;
      return total + basePoints + bonusPoints;
    }, 0);

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
    const generateAndCheck = async (): Promise<{ letters: string; centerLetter: string; validWords: string[] } | null> => {
      // Get a random word from filtered 7-letter words
      const sevenLetterWords = Array.from(SEVEN_LETTER_WORDS)
        .filter(word => {
          if (isEasyMode && /[jqxz]/i.test(word)) return false;
          const uniqueLetters = new Set(word.toUpperCase().split(''));
          return uniqueLetters.size === 7;
        });

      if (sevenLetterWords.length === 0) return null;

      // Pick a random word
      const baseWord = sevenLetterWords[Math.floor(Math.random() * sevenLetterWords.length)].toUpperCase();

      // Identify vowels and consonants
      const letters = baseWord.split('');
      const vowels = letters.filter(l => 'AEIOU'.includes(l));
      const consonants = letters.filter(l => !'AEIOU'.includes(l));

      // Pick center letter based on mode
      let centerLetter;
      let outerLetters;
      if (isEasyMode) {
        // In easy mode, ensure we have at least one vowel for the center
        if (vowels.length === 0) return null;
        centerLetter = vowels[Math.floor(Math.random() * vowels.length)];
      } else {
        centerLetter = consonants[Math.floor(Math.random() * consonants.length)];
      }

      // Remove center letter and ensure exactly 6 outer letters remain
      outerLetters = Array.from(new Set(letters.filter(l => l !== centerLetter)));
      if (outerLetters.length !== 6) return null;

      // Generate valid words using the base word (combining outer letters with center)
      const outerLettersStr = outerLetters.join("");
      const validWords = await DICTIONARY.filterValidWords(outerLettersStr, centerLetter, isEasyMode);

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
        return { letters: letters.join(''), centerLetter, validWords: filteredWords };
      }

      const minWords = isEasyMode ? 15 : 5;
      if (validWords.length < minWords) {
        return null;
      }

      // Ensure we have exactly 7 unique letters (6 outer + 1 center)
      const uniqueLetters = Array.from(new Set(letters));
      if (uniqueLetters.length !== 7) {
        return null;
      }

      const finalOuterLetters = letters.filter(l => l !== centerLetter);
      if (finalOuterLetters.length !== 6) {
        return null;
      }

      return { letters: finalOuterLetters.join(''), centerLetter, validWords };
    };

    let bestResult: { letters: string; centerLetter: string; validWords: string[] } | null = null;
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
    // This ensures we never have a game with zero possible words
    console.log("Using fallback puzzle");
    return { 
      letters: "AEIOUS", 
      centerLetter: "T", 
      validWords: [
        "test", "seat", "east", "ease", "tea", "ate", "eat", "sat", "sea", "set", 
        "site", "suit", "suite", "statue", "status", "state", "taste", "tease",
        "toast", "toasties", "toasts"
      ] 
    };
  }
}

export const storage = new MemStorage();