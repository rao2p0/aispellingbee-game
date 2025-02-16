import { puzzles, type Puzzle } from "@shared/schema";
import words from 'an-array-of-english-words/index.json' assert { type: 'json' };
import { fileURLToPath } from 'url';
import path from "path";

// Common English consonants and vowels, weighted by frequency
const CONSONANTS = 'TNRSHDLCMFPGBVKWXQJZ';
const VOWELS = 'EAIOU';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional validation rules
const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 15;
const VOWEL_PATTERN = /[aeiou]/i;

// Patterns that suggest non-English or uncommon words
const INVALID_PATTERNS = [
  /[aeiou]{4,}/i,  // Too many consecutive vowels
  /[bcdfghjklmnpqrstvwxyz]{6,}/i,  // Too many consecutive consonants (increased to 6)
  /^x[aeiou]/i,  // Words starting with 'x' followed by vowel are often Greek
  /^pf/i,  // Words starting with 'pf' are often German
  /^ts/i,  // Words starting with 'ts' are often foreign
  /q[^u]/i,  // 'q' not followed by 'u' (except 'q' at end)
  /sch|tsch/i,  // German patterns
  /[éèêëāăąēěėęīįİıōőœųūůűźżžāăąčćđēěėęģġħīįķļłńņňōőœŕřśşšţťųūůűźżž]/i // Diacritics
];

// Load and filter the word list once at startup
const WORDS = new Set(
  words.filter(word => {
    // Basic length and character validation
    if (word.length < MIN_WORD_LENGTH || 
        word.length > MAX_WORD_LENGTH || 
        !/^[a-z]+$/.test(word)) {
      return false;
    }

    // Must contain at least one vowel
    if (!VOWEL_PATTERN.test(word)) {
      return false;
    }

    // Check for invalid patterns
    for (const pattern of INVALID_PATTERNS) {
      if (pattern.test(word)) {
        return false;
      }
    }

    // Check vowel-consonant ratio (English words typically don't have too many consonants in a row)
    const vowelCount = (word.match(/[aeiou]/gi) || []).length;
    const consonantCount = word.length - vowelCount;
    if (consonantCount > vowelCount * 3.5) { // Allow more consonants for valid English words to vowels
      return false;
    }

    return true;
  })
);

class GameDictionary {
  filterValidWords(letters: string, centerLetter: string, isEasyMode: boolean = false): string[] {
    const allLetters = (letters + centerLetter).toLowerCase();
    const centerLetterLower = centerLetter.toLowerCase();
    
    return Array.from(WORDS).filter(word => {
      // Basic validation
      const meetsLengthRequirement = word.length >= MIN_WORD_LENGTH;
      const containsCenterLetter = word.includes(centerLetterLower);
      const canBeMade = this.canMakeWord(word, allLetters);
      
      // In easy mode, we only include simpler words
      if (isEasyMode) {
        const isSimpleWord = !INVALID_PATTERNS.some(pattern => pattern.test(word));
        const isReasonableLength = word.length <= 8; // Cap word length in easy mode
        return meetsLengthRequirement && containsCenterLetter && canBeMade && isSimpleWord && isReasonableLength;
      }
      
      return meetsLengthRequirement && containsCenterLetter && canBeMade;
    });
  }

  private canMakeWord(word: string, letters: string): boolean {
    const letterFreq = new Map<string, number>();
    for (const letter of letters) {
      letterFreq.set(letter, (letterFreq.get(letter) || 0) + 1);
    }

    for (const char of word) {
      const available = letterFreq.get(char) || 0;
      if (available === 0) return false;
      letterFreq.set(char, available - 1);
    }
    
    return true;
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
}

export const storage = new MemStorage();