import { apiRequest } from './queryClient';

export interface WordGroup {
  words: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameData {
  groups: WordGroup[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface NewGameResponse {
  words: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  gameId: number;
}

export interface ValidationResponse {
  valid: boolean;
  category?: string;
  groupIndex?: number;
}

export const connectionsApi = {
  // Get a new game with 16 shuffled words
  getNewGame: async (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<{
    words: string[];
    gameData: GameData;  // We'll need to store this client-side for validation
  }> => {
    // Since we don't have a real API endpoint yet, we'll generate different sets of word groups
    // Database of word groups by difficulty
    const wordGroupsDatabase = {
      easy: [
        {
          words: ['APPLE', 'ORANGE', 'BANANA', 'GRAPE'],
          category: "Fruits"
        },
        {
          words: ['DOG', 'CAT', 'RABBIT', 'HAMSTER'],
          category: "Pets"
        },
        {
          words: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
          category: "Colors"
        },
        {
          words: ['PIANO', 'GUITAR', 'DRUMS', 'VIOLIN'],
          category: "Musical Instruments"
        },
        {
          words: ['SHIRT', 'PANTS', 'JACKET', 'SOCKS'],
          category: "Clothing Items"
        },
        {
          words: ['SOCCER', 'BASEBALL', 'BASKETBALL', 'FOOTBALL'],
          category: "Sports"
        }
      ],
      medium: [
        {
          words: ['EARTH', 'MARS', 'VENUS', 'JUPITER'],
          category: "Planets"
        },
        {
          words: ['GOLD', 'SILVER', 'BRONZE', 'COPPER'],
          category: "Metals"
        },
        {
          words: ['WINTER', 'SUMMER', 'SPRING', 'FALL'],
          category: "Seasons"
        },
        {
          words: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
          category: "Directions"
        },
        {
          words: ['NOVEL', 'POEM', 'ESSAY', 'BIOGRAPHY'],
          category: "Types of Writing"
        },
        {
          words: ['ELEPHANT', 'GIRAFFE', 'LION', 'ZEBRA'],
          category: "African Animals"
        }
      ],
      hard: [
        {
          words: ['MERCURY', 'VENUS', 'EARTH', 'MARS'],
          category: "Inner Planets"
        },
        {
          words: ['JAZZ', 'BLUES', 'ROCK', 'SOUL'],
          category: "Music Genres"
        },
        {
          words: ['PICASSO', 'DALI', 'MONET', 'WARHOL'],
          category: "Famous Painters"
        },
        {
          words: ['EAGLE', 'HAWK', 'FALCON', 'OWL'],
          category: "Birds of Prey"
        },
        {
          words: ['SHAKESPEARE', 'HEMINGWAY', 'TOLSTOY', 'AUSTEN'],
          category: "Famous Authors"
        },
        {
          words: ['OXYGEN', 'HYDROGEN', 'CARBON', 'NITROGEN'],
          category: "Chemical Elements"
        }
      ]
    };
    
    // Select 4 random groups from the database for the requested difficulty
    const availableGroups = wordGroupsDatabase[difficulty];
    const selectedGroups: WordGroup[] = [];
    
    // Create a copy of indices that we can remove from as we select groups
    const availableIndices = Array.from({length: availableGroups.length}, (_, i) => i);
    
    // Select 4 random groups without replacement
    for (let i = 0; i < 4; i++) {
      if (availableIndices.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const groupIndex = availableIndices[randomIndex];
      
      // Remove the selected index
      availableIndices.splice(randomIndex, 1);
      
      // Add the selected group to our game
      selectedGroups.push({
        ...availableGroups[groupIndex],
        difficulty
      });
    }
    
    // Flatten all words and shuffle them
    const allWords = selectedGroups.flatMap(group => group.words);
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    
    return {
      words: allWords,
      gameData: {
        groups: selectedGroups,
        difficulty
      }
    };
  },

  // Validate a selection of 4 words
  validateSelection: async (words: string[], gameData: GameData): Promise<ValidationResponse> => {
    try {
      // Since we don't have a server endpoint yet, we'll use the client-side validation
      return connectionsApi.validateSelectionClientSide(words, gameData);
    } catch (error) {
      console.error('Error validating selection:', error);
      return { valid: false };
    }
  },

  // Client-side validation to reduce server calls
  // In a production app, this would be supplemented with server validation
  validateSelectionClientSide: (words: string[], gameData: GameData): ValidationResponse => {
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
};