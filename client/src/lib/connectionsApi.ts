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
    // Since we don't have a real API endpoint yet, we'll generate mock data for development
    // In a real implementation, this would call the server
    
    // Sample words for the connections game (4 groups of 4 related words)
    const mockGroups: WordGroup[] = [
      {
        words: ['APPLE', 'ORANGE', 'BANANA', 'GRAPE'],
        category: "Fruits",
        difficulty: difficulty
      },
      {
        words: ['DOG', 'CAT', 'RABBIT', 'HAMSTER'],
        category: "Pets", 
        difficulty: difficulty
      },
      {
        words: ['RED', 'BLUE', 'GREEN', 'YELLOW'],
        category: "Colors",
        difficulty: difficulty
      },
      {
        words: ['PIANO', 'GUITAR', 'DRUMS', 'VIOLIN'],
        category: "Musical Instruments",
        difficulty: difficulty
      }
    ];
    
    // Flatten all words and shuffle them
    const allWords = mockGroups.flatMap(group => group.words);
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }
    
    return {
      words: allWords,
      gameData: {
        groups: mockGroups,
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