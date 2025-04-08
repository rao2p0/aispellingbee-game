import fs from 'fs';
import path from 'path';

// Define the types
export interface WordGroup {
  words: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameData {
  groups: WordGroup[];
  difficulty: 'easy' | 'medium' | 'hard';
}

class ConnectionsService {
  private wordGroups: {
    easy: WordGroup[];
    medium: WordGroup[];
    hard: WordGroup[];
  };

  constructor() {
    this.wordGroups = {
      easy: [
        {
          words: ['CORDUROY', 'DENIM', 'TWEED', 'LINEN'],
          category: 'Fabrics',
          difficulty: 'easy'
        },
        {
          words: ['GHOST', 'PHANTOM', 'SPECTER', 'SPIRIT'],
          category: 'Supernatural beings',
          difficulty: 'easy'
        },
        {
          words: ['CAT', 'DOG', 'HAMSTER', 'GOLDFISH'],
          category: 'Pets',
          difficulty: 'easy'
        },
        {
          words: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
          category: 'Primary and secondary colors',
          difficulty: 'easy'
        },
        {
          words: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'],
          category: 'Fruits',
          difficulty: 'easy'
        },
        {
          words: ['PENCIL', 'PEN', 'MARKER', 'CRAYON'],
          category: 'Writing tools',
          difficulty: 'easy'
        }
      ],
      medium: [
        {
          words: ['SCAR', 'STITCH', 'BRUISE', 'FRACTURE'],
          category: 'Injuries',
          difficulty: 'medium'
        },
        {
          words: ['GENIE', 'UNICORN', 'DRAGON', 'PHOENIX'],
          category: 'Mythical creatures',
          difficulty: 'medium'
        },
        {
          words: ['JAZZ', 'BLUES', 'ROCK', 'CLASSICAL'],
          category: 'Music genres',
          difficulty: 'medium'
        },
        {
          words: ['MARS', 'VENUS', 'JUPITER', 'SATURN'],
          category: 'Planets in our solar system',
          difficulty: 'medium'
        },
        {
          words: ['QUEEN', 'KNIGHT', 'BISHOP', 'ROOK'],
          category: 'Chess pieces',
          difficulty: 'medium'
        }
      ],
      hard: [
        {
          words: ['BEAST', 'POKE', 'GOAD', 'TEASE'],
          category: 'Ways to provoke',
          difficulty: 'hard'
        },
        {
          words: ['LIMBO', 'TWIST', 'HUSTLE', 'TANGO'],
          category: 'Dance styles',
          difficulty: 'hard'
        },
        {
          words: ['SCOOP', 'BREAK', 'LEAD', 'EXCLUSIVE'],
          category: 'News terms',
          difficulty: 'hard'
        },
        {
          words: ['TICK', 'DASH', 'DOT', 'HYPHEN'],
          category: 'Punctuation marks',
          difficulty: 'hard'
        },
        {
          words: ['SPRING', 'FALL', 'BOW', 'JAM'],
          category: 'Words with multiple meanings',
          difficulty: 'hard'
        }
      ]
    };
  }

  // Gets a random set of 4 word groups for a new game
  getNewGame(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): GameData {
    const selectedGroups: WordGroup[] = [];
    const available = [...this.wordGroups[difficulty]];

    // Randomly select 4 groups
    for (let i = 0; i < 4 && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selectedGroups.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    return {
      groups: selectedGroups,
      difficulty
    };
  }

  // Validate if a selected set of words forms a valid group
  validateSelection(words: string[], gameData: GameData): { valid: boolean; category?: string; groupIndex?: number } {
    if (words.length !== 4) {
      return { valid: false };
    }

    // Sort words to make comparison easier
    const sortedWords = [...words].sort();

    for (let i = 0; i < gameData.groups.length; i++) {
      const group = gameData.groups[i];
      const groupWords = [...group.words].sort();

      // Check if the sorted words match exactly
      if (JSON.stringify(sortedWords) === JSON.stringify(groupWords)) {
        return { 
          valid: true, 
          category: group.category,
          groupIndex: i
        };
      }
    }

    return { valid: false };
  }
}

export const connectionsService = new ConnectionsService();