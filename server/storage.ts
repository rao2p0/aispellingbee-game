import { puzzles, type Puzzle } from "@shared/schema";
import words from 'an-array-of-english-words/index.json' assert { type: 'json' };
import path from "path";
import { Dictionary } from "./services/dictionary";

// Word validation constants
const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 7;  // Changed from 15 to match requirements
const VALID_WORD_PATTERN = /^[a-z]+$/;

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



// Using direct path operations


class GameDictionary {
  private isValidWordPattern(word: string): boolean {
    return VALID_WORD_PATTERN.test(word);
  }

  private hasNoRepeatedLetters(word: string): boolean {
    return new Set(word).size === word.length;
  }

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

    return (
      this.isValidWordPattern(normalizedWord) &&
      this.isValidLength(normalizedWord) &&
      this.hasNoRepeatedLetters(normalizedWord) &&
      normalizedWord.includes(normalizedCenter) &&
      this.containsOnlyAvailableLetters(normalizedWord, letters + centerLetter) &&
      WORDS.has(normalizedWord)
    );
  }

  async filterValidWords(letters: string, centerLetter: string, isEasyMode: boolean = false): Promise<string[]> {
    const allLetters = letters + centerLetter;
    const centerLetterLower = centerLetter.toLowerCase();
    const dictionary = Dictionary.getInstance();

    const validWords = [];
    for (const word of Array.from(WORDS)) {
      // Apply core validation rules
      if (!this.validateWord(word, letters, centerLetter)) {
        continue;
      }

      if (isEasyMode) {
        // Additional easy mode restrictions
        const isComplex = 
          /[bcdfghjklmnpqrstvwxyz]{4,}/i.test(word) || // No long consonant chains
          /[aeiou]{3,}/i.test(word); // No long vowel chains
        if (isComplex) continue;
      }

      validWords.push(word);
    }

    // Batch validate all words with GPT
    const gptValidWords = await dictionary.validateWordsWithGPT(validWords);
    return gptValidWords;
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

  private async generateLetterSet(isEasyMode: boolean = false): Promise<{ letters: string[]; centerLetter: string; validWords: string[] }> {
    // Generate puzzle with mode setting
    const puzzleMode = isEasyMode ? 'easy' : 'challenge';

    const generateAndCheck = async () => {
      // Find a 7-letter word with unique letters
      const sevenLetterWords = Array.from(WORDS).filter(word => {
        if (word.length !== 7) return false;
        const uniqueLetters = new Set(word.toUpperCase().split(''));
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

      // Identify vowels and consonants
      const letters = baseWord.split('');
      const vowels = letters.filter(l => 'AEIOU'.includes(l));
      const consonants = letters.filter(l => !'AEIOU'.includes(l));

      // Pick center letter based on mode
      let centerLetter;
      let outerLetters;
      if (isEasyMode) {
        // In easy mode, ensure we have at least one vowel for the center
        const puzzleVowels = letters.filter(l => 'AEIOU'.includes(l));
        if (puzzleVowels.length === 0) return null;
        centerLetter = puzzleVowels[Math.floor(Math.random() * puzzleVowels.length)];
      } else {
        centerLetter = consonants[Math.floor(Math.random() * consonants.length)];
      }

      // Remove center letter and ensure exactly 6 outer letters remain
      outerLetters = Array.from(new Set(letters.filter(l => l !== centerLetter)));
      if (outerLetters.length !== 6) return null;

      // Generate valid words using the base word (combining outer letters with center)
      const validWords = await DICTIONARY.filterValidWords([...outerLetters, centerLetter].join(""), centerLetter, isEasyMode);

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
        return { letters: outerLetters, centerLetter, validWords: filteredWords };
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

      return { letters: finalOuterLetters, centerLetter, validWords };
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
    console.log("No puzzle met the minimum word requirements after 15 attempts. Using fallback puzzle.");
    return { letters: ["A", "E", "I", "O", "U", "S"], centerLetter: "T", validWords: ["test", "seat", "east", "ease", "tea", "ate", "eat", "sat", "sea", "set", "site", "suit", "suite"] };
  }
}

export const storage = new MemStorage();