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
    startWord: 'root',
    targetWord: 'boot',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 2,
    startWord: 'mint',
    targetWord: 'pint',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 3,
    startWord: 'wine',
    targetWord: 'fine',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 4,
    startWord: 'find',
    targetWord: 'mind',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 5,
    startWord: 'pool',
    targetWord: 'pole',
    difficulty: Difficulty.EASY,
    minSteps: 2,
    hint: 'Try changing just one letter at a time.'
  },
  {
    id: 6,
    startWord: 'fool',
    targetWord: 'boot',
    difficulty: Difficulty.EASY,
    minSteps: 2,
    hint: 'Think about changing the first letter, then the last.'
  },
  {
    id: 7,
    startWord: 'bend',
    targetWord: 'tent',
    difficulty: Difficulty.EASY,
    minSteps: 2,
    hint: 'Try changing the first letter, then the third.'
  },
  {
    id: 8,
    startWord: 'land',
    targetWord: 'sank',
    difficulty: Difficulty.EASY,
    minSteps: 2,
    hint: 'Change the first letter, then the last.'
  },
  {
    id: 9,
    startWord: 'roll',
    targetWord: 'cool',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Try going through POLL and POOL.'
  },
  {
    id: 10,
    startWord: 'moan',
    targetWord: 'soot',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Try going through MOON and SOON.'
  },
  {
    id: 11,
    startWord: 'tent',
    targetWord: 'bond',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Try TENT → BENT → BEND → BOND'
  },
  {
    id: 12,
    startWord: 'boat',
    targetWord: 'soon',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Consider the path BOAT → BOOT → SOOT → SOON'
  },
  {
    id: 13,
    startWord: 'bald',
    targetWord: 'boat',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Try BALD → BOLD → BOLT → BOAT'
  },
  {
    id: 14,
    startWord: 'sand',
    targetWord: 'pine',
    difficulty: Difficulty.EASY,
    minSteps: 4,
    hint: 'Consider SAND → LAND → LANE → LINE → PINE'
  },
  {
    id: 15,
    startWord: 'roll',
    targetWord: 'pale',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Try ROLL → POLL → POLE → PALE'
  },
  {
    id: 16,
    startWord: 'pine',
    targetWord: 'land',
    difficulty: Difficulty.EASY,
    minSteps: 3,
    hint: 'Try PINE → LINE → LANE → LAND'
  },
  {
    id: 17,
    startWord: 'pool',
    targetWord: 'pump',
    difficulty: Difficulty.EASY,
    minSteps: 4,
    hint: 'Consider POOL → POLL → PULL → PULP → PUMP'
  },
  {
    id: 18,
    startWord: 'love',
    targetWord: 'pull',
    difficulty: Difficulty.EASY,
    minSteps: 5,
    hint: 'Try LOVE → MOVE → MOLE → POLE → POLL → PULL'
  },
  {
    id: 19,
    startWord: 'pale',
    targetWord: 'male',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 20,
    startWord: 'bent',
    targetWord: 'bend',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the last letter.'
  },
  {
    id: 21,
    startWord: 'damp',
    targetWord: 'camp',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 22,
    startWord: 'pink',
    targetWord: 'sink',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 23,
    startWord: 'cool',
    targetWord: 'fool',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 24,
    startWord: 'foot',
    targetWord: 'soot',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  {
    id: 25,
    startWord: 'bold',
    targetWord: 'cold',
    difficulty: Difficulty.EASY,
    minSteps: 1,
    hint: 'Change just the first letter.'
  },
  
  // Medium puzzles - 4-5 letter words with less obvious paths
  {
    id: 26,
    startWord: 'line',
    targetWord: 'fond',
    difficulty: Difficulty.MEDIUM,
    minSteps: 3,
    hint: 'Try thinking about: LINE → FINE → FIND → FOND'
  },
  {
    id: 27,
    startWord: 'bold',
    targetWord: 'bent',
    difficulty: Difficulty.MEDIUM,
    minSteps: 3,
    hint: 'Consider the path through BOND and BEND.'
  },
  {
    id: 28,
    startWord: 'wine',
    targetWord: 'rant',
    difficulty: Difficulty.MEDIUM,
    minSteps: 4,
    hint: 'Try going through PINE, PINT, and PANT.'
  },
  {
    id: 29,
    startWord: 'sink',
    targetWord: 'rant',
    difficulty: Difficulty.MEDIUM,
    minSteps: 3,
    hint: 'Consider the path SINK → SANK → RANK → RANT'
  },
  {
    id: 30,
    startWord: 'live',
    targetWord: 'sank',
    difficulty: Difficulty.MEDIUM,
    minSteps: 4,
    hint: 'Try going through LINE, LANE, and SANE.'
  },
  {
    id: 31,
    startWord: 'pink',
    targetWord: 'cake',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Consider the path through SINK, SANK, SANE, and CANE.'
  },
  {
    id: 32,
    startWord: 'sane',
    targetWord: 'fond',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Try going through LANE, LINE, FINE, and FIND.'
  },
  {
    id: 33,
    startWord: 'pale',
    targetWord: 'mole',
    difficulty: Difficulty.MEDIUM,
    minSteps: 2,
    hint: 'Try going through MALE.'
  },
  {
    id: 34,
    startWord: 'cool',
    targetWord: 'soot',
    difficulty: Difficulty.MEDIUM,
    minSteps: 3,
    hint: 'Consider the path COOL → FOOL → FOOT → SOOT'
  },
  {
    id: 35,
    startWord: 'bond',
    targetWord: 'line',
    difficulty: Difficulty.MEDIUM,
    minSteps: 4,
    hint: 'Try going through FOND, FIND, and FINE.'
  },
  {
    id: 36,
    startWord: 'tent',
    targetWord: 'fond',
    difficulty: Difficulty.MEDIUM,
    minSteps: 6,
    hint: 'Try TENT → BENT → BEND → BOND → FOND'
  },
  {
    id: 37,
    startWord: 'bold',
    targetWord: 'line',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Consider BOLD → BOND → FOND → FIND → FINE → LINE'
  },
  {
    id: 38,
    startWord: 'sank',
    targetWord: 'find',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Try SANK → SINK → PINK → PINE → FINE → FIND'
  },
  {
    id: 39,
    startWord: 'nest',
    targetWord: 'bond',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Consider NEST → TEST → TENT → BENT → BEND → BOND'
  },
  {
    id: 40,
    startWord: 'pole',
    targetWord: 'bond',
    difficulty: Difficulty.MEDIUM,
    minSteps: 8,
    hint: 'Try POLE → POLL → POOL → FOOL → FOOT → BOOT → BOLT → BOLD → BOND'
  },
  {
    id: 41,
    startWord: 'boat',
    targetWord: 'mint',
    difficulty: Difficulty.MEDIUM,
    minSteps: 7,
    hint: 'Consider BOAT → BOLT → BOLD → BOND → FOND → FIND → MIND → MINT'
  },
  {
    id: 42,
    startWord: 'bent',
    targetWord: 'live',
    difficulty: Difficulty.MEDIUM,
    minSteps: 7,
    hint: 'Try BENT → BEND → BOND → FOND → FIND → FINE → LINE → LIVE'
  },
  {
    id: 43,
    startWord: 'fine',
    targetWord: 'bent',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Consider FINE → FIND → FOND → BOND → BEND → BENT'
  },
  {
    id: 44,
    startWord: 'nest',
    targetWord: 'fond',
    difficulty: Difficulty.MEDIUM,
    minSteps: 6,
    hint: 'Try NEST → TEST → TENT → BENT → BEND → BOND → FOND'
  },
  {
    id: 45,
    startWord: 'cake',
    targetWord: 'pant',
    difficulty: Difficulty.MEDIUM,
    minSteps: 6,
    hint: 'Consider CAKE → CANE → LANE → LINE → PINE → PINT → PANT'
  },
  {
    id: 46,
    startWord: 'male',
    targetWord: 'fine',
    difficulty: Difficulty.MEDIUM,
    minSteps: 6,
    hint: 'Try MALE → MOLE → MOVE → LOVE → LIVE → LINE → FINE'
  },
  {
    id: 47,
    startWord: 'wind',
    targetWord: 'boat',
    difficulty: Difficulty.MEDIUM,
    minSteps: 6,
    hint: 'Consider WIND → FIND → FOND → BOND → BOLD → BOLT → BOAT'
  },
  {
    id: 48,
    startWord: 'damp',
    targetWord: 'cool',
    difficulty: Difficulty.MEDIUM,
    minSteps: 7,
    hint: 'Try DAMP → DUMP → PUMP → PULP → PULL → POLL → POOL → COOL'
  },
  {
    id: 49,
    startWord: 'pulp',
    targetWord: 'bold',
    difficulty: Difficulty.MEDIUM,
    minSteps: 8,
    hint: 'Consider PULP → PULL → POLL → POOL → FOOL → FOOT → BOOT → BOLT → BOLD'
  },
  {
    id: 50,
    startWord: 'dump',
    targetWord: 'lion',
    difficulty: Difficulty.MEDIUM,
    minSteps: 5,
    hint: 'Try DUMP → DAMP → LAMP → LIMP → LIMN → LION'
  },
  
  // Hard puzzles - 5-6 letter words with complex paths
  {
    id: 51,
    startWord: 'roll',
    targetWord: 'cord',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Try a path through POLL, POOL, FOOL, FOOT, BOOT, BOLT, BOLD, COLD'
  },
  {
    id: 52,
    startWord: 'soon',
    targetWord: 'mint',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Consider a path with: SOOT, BOOT, BOLT, BOLD, BOND, FOND, FIND, MIND'
  },
  {
    id: 53,
    startWord: 'live',
    targetWord: 'boat',
    difficulty: Difficulty.HARD,
    minSteps: 8,
    hint: 'Try LINE, FINE, FIND, FOND, BOND, BOLD, BOLT'
  },
  {
    id: 54,
    startWord: 'foot',
    targetWord: 'warm',
    difficulty: Difficulty.HARD,
    minSteps: 8,
    hint: 'Consider BOOT, BOLT, BOLD, COLD, CORD, CARD, WARD'
  },
  {
    id: 55,
    startWord: 'soot',
    targetWord: 'damp',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Try FOOT, FOOL, POOL, POLL, PULL, PULP, PUMP, DUMP'
  },
  {
    id: 56,
    startWord: 'rank',
    targetWord: 'male',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Try a path through SANK, SANE, LANE, LINE, LIVE, LOVE, MOVE, MOLE'
  },
  {
    id: 57,
    startWord: 'male',
    targetWord: 'sand',
    difficulty: Difficulty.HARD,
    minSteps: 8,
    hint: 'Consider MOLE, MOVE, LOVE, LIVE, LINE, LANE, SANE'
  },
  {
    id: 58,
    startWord: 'pint',
    targetWord: 'pale',
    difficulty: Difficulty.HARD,
    minSteps: 8,
    hint: 'Try PINE, LINE, LIVE, LOVE, MOVE, MOLE, POLE'
  },
  {
    id: 59,
    startWord: 'lion',
    targetWord: 'pump',
    difficulty: Difficulty.HARD,
    minSteps: 6,
    hint: 'Consider LIMN, LIMP, LAMP, DAMP, DUMP'
  },
  {
    id: 60,
    startWord: 'fine',
    targetWord: 'warm',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Try a path including FIND, FOND, BOND, BOLD, COLD, CORD, CARD, WARD'
  },
  {
    id: 61,
    startWord: 'pole',
    targetWord: 'wind',
    difficulty: Difficulty.HARD,
    minSteps: 7,
    hint: 'Consider POLE → MOLE → MOVE → LOVE → LIVE → LINE → WINE → WIND'
  },
  {
    id: 62,
    startWord: 'pole',
    targetWord: 'camp',
    difficulty: Difficulty.HARD,
    minSteps: 7,
    hint: 'Try POLE → POLL → PULL → PULP → PUMP → DUMP → DAMP → CAMP'
  },
  {
    id: 63,
    startWord: 'mean',
    targetWord: 'bald',
    difficulty: Difficulty.HARD,
    minSteps: 8,
    hint: 'Consider MEAN → MOAN → MOON → SOON → SOOT → BOOT → BOLT → BOLD → BALD'
  },
  {
    id: 64,
    startWord: 'move',
    targetWord: 'moon',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Try MOVE → MOLE → POLE → POLL → POOL → FOOL → FOOT → SOOT → SOON → MOON'
  },
  {
    id: 65,
    startWord: 'soot',
    targetWord: 'lane',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Consider SOOT → BOOT → BOLT → BOLD → BOND → FOND → FIND → FINE → LINE → LANE'
  },
  {
    id: 66,
    startWord: 'pool',
    targetWord: 'cord',
    difficulty: Difficulty.HARD,
    minSteps: 7,
    hint: 'Try POOL → FOOL → FOOT → BOOT → BOLT → BOLD → COLD → CORD'
  },
  {
    id: 67,
    startWord: 'foot',
    targetWord: 'pint',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Consider FOOT → BOOT → BOLT → BOLD → BOND → FOND → FIND → MIND → MINT → PINT'
  },
  {
    id: 68,
    startWord: 'sink',
    targetWord: 'boot',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Try SINK → PINK → PINE → FINE → FIND → FOND → BOND → BOLD → BOLT → BOOT'
  },
  {
    id: 69,
    startWord: 'pink',
    targetWord: 'pool',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Consider PINK → PINE → LINE → LIVE → LOVE → MOVE → MOLE → POLE → POLL → POOL'
  },
  {
    id: 70,
    startWord: 'wind',
    targetWord: 'mole',
    difficulty: Difficulty.HARD,
    minSteps: 6,
    hint: 'Try WIND → WINE → LINE → LIVE → LOVE → MOVE → MOLE'
  },
  {
    id: 71,
    startWord: 'love',
    targetWord: 'soot',
    difficulty: Difficulty.HARD,
    minSteps: 8,
    hint: 'Consider LOVE → MOVE → MOLE → POLE → POLL → POOL → FOOL → FOOT → SOOT'
  },
  {
    id: 72,
    startWord: 'camp',
    targetWord: 'pale',
    difficulty: Difficulty.HARD,
    minSteps: 8,
    hint: 'Try CAMP → DAMP → DUMP → PUMP → PULP → PULL → POLL → POLE → PALE'
  },
  {
    id: 73,
    startWord: 'rant',
    targetWord: 'pole',
    difficulty: Difficulty.HARD,
    minSteps: 9,
    hint: 'Consider RANT → PANT → PINT → PINE → LINE → LIVE → LOVE → MOVE → MOLE → POLE'
  },
  {
    id: 74,
    startWord: 'meat',
    targetWord: 'root',
    difficulty: Difficulty.HARD,
    minSteps: 6,
    hint: 'Try MEAT → MEAN → MOAN → MOON → SOON → SOOT → ROOT'
  },
  {
    id: 75,
    startWord: 'next',
    targetWord: 'soon',
    difficulty: Difficulty.HARD,
    minSteps: 6,
    hint: 'Consider NEXT → NEAT → MEAT → MEAN → MOAN → MOON → SOON'
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