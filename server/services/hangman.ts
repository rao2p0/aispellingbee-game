import fs from 'fs';
import path from 'path';

// Define difficulty levels for words
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Word length ranges for each difficulty
const DIFFICULTY_RANGES = {
  [Difficulty.EASY]: { min: 3, max: 5 },
  [Difficulty.MEDIUM]: { min: 6, max: 8 },
  [Difficulty.HARD]: { min: 9, max: 100 }
};

class HangmanService {
  private words: string[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initializeWords();
  }

  private async initializeWords() {
    try {
      // Load words from the existing words file used for other games
      // We can use the an-array-of-english-words package or a file we have already
      // For now, let's try to use the existing filtered words files first
      let wordList: string[] = [];
      
      try {
        const filePath = path.join(process.cwd(), 'filtered_456789_words.txt');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        wordList = fileContent.split('\n').filter(word => word.trim().length > 0);
      } catch (err) {
        // If the file doesn't exist, use a more standard dictionary approach
        const { default: englishWords } = await import('an-array-of-english-words');
        wordList = englishWords;
      }
      
      // Only include words with letters A-Z (no special characters)
      this.words = wordList
        .filter(word => /^[a-zA-Z]+$/.test(word))
        .map(word => word.toUpperCase());
      
      this.initialized = true;
      console.log(`Hangman service initialized with ${this.words.length} words`);
    } catch (error) {
      console.error('Error initializing Hangman service:', error);
    }
  }

  /**
   * Get a random word based on difficulty
   */
  public getRandomWord(difficulty: Difficulty = Difficulty.MEDIUM): string {
    if (!this.initialized || this.words.length === 0) {
      // Fallback words if the dictionary hasn't loaded
      const fallbackWords = {
        [Difficulty.EASY]: ['CAT', 'DOG', 'RUN', 'JUMP', 'PLAY'],
        [Difficulty.MEDIUM]: ['KEYBOARD', 'COMPUTER', 'MONITOR', 'PRINTER'],
        [Difficulty.HARD]: ['EXTRAORDINARY', 'REVOLUTIONARY', 'SOPHISTICATED']
      };
      
      const difficultyWords = fallbackWords[difficulty];
      const randomIndex = Math.floor(Math.random() * difficultyWords.length);
      return difficultyWords[randomIndex];
    }

    // Filter words by difficulty (word length)
    const range = DIFFICULTY_RANGES[difficulty];
    const filteredWords = this.words.filter(
      word => word.length >= range.min && word.length <= range.max
    );
    
    if (filteredWords.length === 0) {
      return this.getRandomWord(); // Fallback to any difficulty if no words match
    }
    
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex];
  }
}

export const hangmanService = new HangmanService();