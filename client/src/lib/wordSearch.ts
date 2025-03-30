import type { WordPosition } from "@/pages/word-search";

// List of words to choose from (common English words)
const WORDS = [
  "APPLE", "BANANA", "ORANGE", "GRAPE", "LEMON", "PEACH", "CHERRY", "PLUM",
  "MELON", "KIWI", "PEAR", "BERRY", "MANGO", "LIME", "COCONUT", "FIG",
  "DATE", "AVOCADO", "PAPAYA", "GUAVA", "APRICOT", "STAR", "PLANET", "MOON",
  "SUN", "EARTH", "MARS", "VENUS", "JUPITER", "SATURN", "COMET", "GALAXY",
  "DOG", "CAT", "BIRD", "FISH", "HORSE", "COW", "SHEEP", "GOAT", "CHICKEN",
  "DUCK", "PIG", "RABBIT", "MOUSE", "SNAKE", "TIGER", "LION", "BEAR", "WOLF",
  "BOOK", "PAGE", "WORD", "LETTER", "STORY", "NOVEL", "POEM", "AUTHOR",
  "RED", "BLUE", "GREEN", "YELLOW", "BLACK", "WHITE", "ORANGE", "PURPLE",
  "HOUSE", "ROOM", "DOOR", "WINDOW", "WALL", "FLOOR", "ROOF", "KITCHEN",
  "WATER", "FIRE", "EARTH", "AIR", "METAL", "WOOD", "STONE", "GLASS", "SAND",
  "SCHOOL", "TEACHER", "STUDENT", "CLASS", "DESK", "CHAIR", "PENCIL", "PEN",
  "HAPPY", "SAD", "ANGRY", "SCARED", "TIRED", "EXCITED", "CALM", "PROUD",
  "RIVER", "LAKE", "OCEAN", "MOUNTAIN", "VALLEY", "FOREST", "DESERT", "ISLAND",
  "ALWAYS", "NEVER", "OFTEN", "RARELY", "MAYBE", "PERHAPS", "SURELY", "POSSIBLY",
  "SUMMER", "WINTER", "SPRING", "AUTUMN", "SEASON", "MONTH", "WEEK", "DAY",
  "MUSIC", "SONG", "DANCE", "SING", "PLAY", "INSTRUMENT", "BAND", "CONCERT",
  "BREAD", "BUTTER", "CHEESE", "MILK", "EGGS", "SUGAR", "SALT", "PEPPER",
  "SMALL", "LARGE", "TINY", "HUGE", "SHORT", "TALL", "THIN", "THICK",
  "TREE", "BRANCH", "LEAF", "ROOT", "FLOWER", "GRASS", "BUSH", "PLANT",
  "FRIEND", "FAMILY", "PARENT", "CHILD", "SISTER", "BROTHER", "AUNT", "UNCLE"
];

export type Orientation = 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';

// Get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Get random words from the word list
const getRandomWords = (count: number): string[] => {
  const words: string[] = [];
  const wordsCopy = [...WORDS];
  
  // Shuffle array
  for (let i = wordsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordsCopy[i], wordsCopy[j]] = [wordsCopy[j], wordsCopy[i]];
  }
  
  // Get first n words
  return wordsCopy.slice(0, count);
};

// Check if word can be placed at a position with given orientation
const canPlaceWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  orientation: Orientation
): boolean => {
  const size = grid.length;
  let r = row;
  let c = col;
  
  for (let i = 0; i < word.length; i++) {
    // Check if out of bounds
    if (r < 0 || r >= size || c < 0 || c >= size) {
      return false;
    }
    
    // Check if cell is already filled with a different letter
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
      return false;
    }
    
    // Move to next position based on orientation
    switch (orientation) {
      case 'horizontal':
        c++;
        break;
      case 'vertical':
        r++;
        break;
      case 'diagonal-down':
        r++;
        c++;
        break;
      case 'diagonal-up':
        r--;
        c++;
        break;
    }
  }
  
  return true;
};

// Place word in grid at given position and orientation
const placeWord = (
  grid: string[][],
  word: string,
  row: number,
  col: number,
  orientation: Orientation
): void => {
  let r = row;
  let c = col;
  
  for (let i = 0; i < word.length; i++) {
    grid[r][c] = word[i];
    
    // Move to next position based on orientation
    switch (orientation) {
      case 'horizontal':
        c++;
        break;
      case 'vertical':
        r++;
        break;
      case 'diagonal-down':
        r++;
        c++;
        break;
      case 'diagonal-up':
        r--;
        c++;
        break;
    }
  }
};

// Generate a word search puzzle
export const generateWordSearchPuzzle = (size: number, numWords: number) => {
  // Create empty grid
  const grid: string[][] = Array(size)
    .fill([])
    .map(() => Array(size).fill(''));
  
  // Get random words
  const words = getRandomWords(numWords);
  
  // Track word positions
  const wordPositions: WordPosition[] = [];
  
  // Attempt to place each word
  for (const word of words) {
    // If word is too long for the grid, skip it
    if (word.length > size) {
      continue;
    }
    
    let placed = false;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!placed && attempts < maxAttempts) {
      // Get random position and orientation
      const orientations: Orientation[] = [
        'horizontal', 'vertical', 'diagonal-down', 'diagonal-up'
      ];
      const orientation = getRandomItem(orientations);
      
      // Calculate valid starting positions based on orientation
      let row, col;
      switch (orientation) {
        case 'horizontal':
          row = Math.floor(Math.random() * size);
          col = Math.floor(Math.random() * (size - word.length + 1));
          break;
        case 'vertical':
          row = Math.floor(Math.random() * (size - word.length + 1));
          col = Math.floor(Math.random() * size);
          break;
        case 'diagonal-down':
          row = Math.floor(Math.random() * (size - word.length + 1));
          col = Math.floor(Math.random() * (size - word.length + 1));
          break;
        case 'diagonal-up':
          row = Math.floor(Math.random() * size - 1) + word.length;
          if (row >= size) row = size - 1;
          col = Math.floor(Math.random() * (size - word.length + 1));
          break;
      }
      
      // Check if word can be placed
      if (canPlaceWord(grid, word, row, col, orientation)) {
        placeWord(grid, word, row, col, orientation);
        wordPositions.push({
          word,
          startRow: row,
          startCol: col,
          orientation,
          found: false
        });
        placed = true;
      }
      
      attempts++;
    }
  }
  
  // Fill in empty cells with random letters
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        grid[row][col] = randomLetter;
      }
    }
  }
  
  return { grid, wordPositions };
};