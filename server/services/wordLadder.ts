import fs from 'fs';

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

interface WordLadderPuzzle {
  id: number;
  startWord: string;
  targetWord: string;
  difficulty: Difficulty;
  minSteps?: number; // Minimum possible steps to solve
  hint?: string; // Optional hint for very difficult puzzles
}

// Predefined puzzles for each difficulty level
const PREDEFINED_PUZZLES: WordLadderPuzzle[] = [
  // Easy puzzles - typically 3-4 letter words with obvious paths
  {
    id: 1,
    startWord: 'cat',
    targetWord: 'dog',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Try changing one letter at a time. CAT → COT → DOT → DOG is one possible path.'
  },
  {
    id: 2,
    startWord: 'cold',
    targetWord: 'warm',
    difficulty: Difficulty.EASY,
    minSteps: 4,
    hint: 'Try COLD → CORD → CARD → WARD → WARM'
  },
  {
    id: 3,
    startWord: 'fly',
    targetWord: 'ant',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Consider FLY → FAY → FAT → ANT'
  },
  {
    id: 4,
    startWord: 'four',
    targetWord: 'five',
    difficulty: Difficulty.EASY,
    minSteps: 4,
    hint: 'Try FOUR → FOUL → FOIL → FAIL → FIVE'
  },
  {
    id: 5,
    startWord: 'sick',
    targetWord: 'well',
    difficulty: Difficulty.EASY,
    minSteps: 4,
    hint: 'Consider SICK → SILK → SILL → SELL → WELL'
  },
  
  // Medium puzzles - 4-5 letter words with less obvious paths
  {
    id: 6,
    startWord: 'hide',
    targetWord: 'seek',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Try words like SIDE, SITE, SITS, SETS'
  },
  {
    id: 7,
    startWord: 'white',
    targetWord: 'black',
    difficulty: Difficulty.MEDIUM,
    minSteps: 6,
    hint: 'Think of changing one letter at a time - possibly through WHILE, WHALE, SHALE, SHAKE, SLACK'
  },
  {
    id: 8,
    startWord: 'happy',
    targetWord: 'angry',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Consider paths through words like HARPY, HARDY'
  },
  {
    id: 9,
    startWord: 'bread',
    targetWord: 'toast',
    difficulty: Difficulty.MEDIUM,
    minSteps: 7,
    hint: 'One possible path involves TREAD, TREAT'
  },
  {
    id: 10,
    startWord: 'money',
    targetWord: 'coins',
    difficulty: Difficulty.MEDIUM,
    minSteps: 6
  },
  
  // Hard puzzles - 5-6 letter words with complex paths
  {
    id: 11,
    startWord: 'listen',
    targetWord: 'sounds',
    difficulty: Difficulty.HARD,
    minSteps: 9
  },
  {
    id: 12,
    startWord: 'friend',
    targetWord: 'enemy',
    difficulty: Difficulty.HARD,
    minSteps: 8
  },
  {
    id: 13,
    startWord: 'flower',
    targetWord: 'garden',
    difficulty: Difficulty.HARD,
    minSteps: 10
  },
  {
    id: 14,
    startWord: 'planet',
    targetWord: 'galaxy',
    difficulty: Difficulty.HARD,
    minSteps: 9
  },
  {
    id: 15,
    startWord: 'dream',
    targetWord: 'sleep',
    difficulty: Difficulty.HARD,
    minSteps: 7
  }
];

class WordLadderService {
  private words: Set<string> = new Set();
  private wordsByLength: Map<number, string[]> = new Map();
  private puzzles: WordLadderPuzzle[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initializeWords();
    this.initializePuzzles();
  }

  private initializeWords() {
    try {
      // Read words from the filtered words file
      const wordContent = fs.readFileSync('filtered_456789_words.txt', 'utf8');
      const allWords = wordContent.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
      
      this.words = new Set(allWords);
      
      // Organize words by length for faster lookup
      allWords.forEach(word => {
        const length = word.length;
        if (!this.wordsByLength.has(length)) {
          this.wordsByLength.set(length, []);
        }
        this.wordsByLength.get(length)!.push(word);
      });
      
      console.log(`Word Ladder Service: Loaded ${this.words.size} words`);
      console.log(`Word lengths: ${Array.from(this.wordsByLength.keys()).sort().join(', ')}`);
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing word ladder dictionary:', error);
      // Initialize with a minimal set if loading fails
      this.words = new Set(['cat', 'bat', 'hat', 'mat', 'rat', 'dog', 'log', 'fog', 'bog', 'cog']);
      this.wordsByLength.set(3, Array.from(this.words));
    }
  }

  private initializePuzzles() {
    // Use the predefined puzzles
    this.puzzles = PREDEFINED_PUZZLES;
    
    // Validate the puzzles against our dictionary
    this.puzzles = this.puzzles.filter(puzzle => {
      const { startWord, targetWord } = puzzle;
      const isStartValid = this.isValidWord(startWord);
      const isTargetValid = this.isValidWord(targetWord);
      
      if (!isStartValid || !isTargetValid) {
        console.warn(`Invalid puzzle words: ${startWord} (${isStartValid}) -> ${targetWord} (${isTargetValid})`);
        return false;
      }
      
      if (startWord.length !== targetWord.length) {
        console.warn(`Mismatched word lengths: ${startWord} (${startWord.length}) -> ${targetWord} (${targetWord.length})`);
        return false;
      }
      
      return true;
    });
    
    console.log(`Word Ladder Service: Loaded ${this.puzzles.length} valid puzzles`);
  }

  /**
   * Get a random puzzle based on difficulty
   */
  public getRandomPuzzle(difficulty: Difficulty = Difficulty.MEDIUM): WordLadderPuzzle {
    const filteredPuzzles = this.puzzles.filter(p => p.difficulty === difficulty);
    
    if (filteredPuzzles.length === 0) {
      // Fallback to any puzzle if no puzzles match the requested difficulty
      console.warn(`No puzzles found for difficulty ${difficulty}, using random puzzle`);
      return this.puzzles[Math.floor(Math.random() * this.puzzles.length)];
    }
    
    return filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];
  }

  /**
   * Get a specific puzzle by ID
   */
  public getPuzzleById(id: number): WordLadderPuzzle | undefined {
    return this.puzzles.find(p => p.id === id);
  }

  /**
   * Validate if a word is in our dictionary
   */
  public isValidWord(word: string): boolean {
    if (!word) return false;
    return this.words.has(word.toLowerCase());
  }

  /**
   * Validate if a word is a valid next step from the previous word
   * (exactly one letter different)
   */
  public isValidStep(currentWord: string, nextWord: string): boolean {
    if (!currentWord || !nextWord) return false;
    
    // Words must be the same length
    if (currentWord.length !== nextWord.length) return false;
    
    const word1 = currentWord.toLowerCase();
    const word2 = nextWord.toLowerCase();
    
    // Count differences
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        differences++;
      }
      
      // Early exit if more than one difference
      if (differences > 1) return false;
    }
    
    // Valid if exactly one letter is different
    return differences === 1;
  }

  /**
   * Find all possible valid next words from a given word
   * (used for hints or validation)
   */
  public findPossibleNextWords(word: string): string[] {
    const normalized = word.toLowerCase();
    
    if (!this.isValidWord(normalized)) {
      return [];
    }
    
    // Get all words of the same length
    const sameLength = this.wordsByLength.get(normalized.length) || [];
    
    // Filter for words that differ by exactly one letter
    return sameLength.filter(candidate => 
      candidate !== normalized && this.isValidStep(normalized, candidate)
    );
  }

  /**
   * Validate an entire solution path
   */
  public validateSolution(
    startWord: string,
    targetWord: string,
    wordPath: string[]
  ): { valid: boolean; reason?: string } {
    // Path must include start and target words
    const fullPath = [startWord.toLowerCase(), ...wordPath.map(w => w.toLowerCase())];
    
    // Check if the target word is the last in the path
    if (fullPath[fullPath.length - 1] !== targetWord.toLowerCase()) {
      return { valid: false, reason: "Path doesn't end with the target word" };
    }
    
    // Validate each step in the path
    for (let i = 0; i < fullPath.length - 1; i++) {
      const current = fullPath[i];
      const next = fullPath[i + 1];
      
      // Validate that both words exist
      if (!this.isValidWord(current)) {
        return { valid: false, reason: `"${current}" is not a valid word` };
      }
      
      if (!this.isValidWord(next)) {
        return { valid: false, reason: `"${next}" is not a valid word` };
      }
      
      // Validate step is valid (one letter change)
      if (!this.isValidStep(current, next)) {
        return { 
          valid: false, 
          reason: `Invalid step from "${current}" to "${next}" - must change exactly one letter` 
        };
      }
    }
    
    return { valid: true };
  }
}

export const wordLadderService = new WordLadderService();