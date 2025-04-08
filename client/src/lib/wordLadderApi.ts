import { apiRequest } from './queryClient';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WordLadderPuzzle {
  id: number;
  startWord: string;
  targetWord: string;
  difficulty: Difficulty;
  minSteps?: number;
  hint?: string;
}

export interface ValidationResponse {
  valid: boolean;
  reason?: string;
}

export interface HintResponse {
  possibleNextWords: string[];
}

export const wordLadderApi = {
  // Get a random puzzle based on difficulty
  getRandomPuzzle: async (difficulty: Difficulty = 'medium'): Promise<WordLadderPuzzle> => {
    const response = await fetch(`/api/word-ladder/puzzle?difficulty=${difficulty}`);
    return response.json();
  },

  // Get a specific puzzle by ID
  getPuzzleById: async (id: number): Promise<WordLadderPuzzle> => {
    const response = await fetch(`/api/word-ladder/puzzle/${id}`);
    return response.json();
  },

  // Validate if a word is valid in the ladder (dictionary word + only one letter different)
  validateWord: async (currentWord: string, nextWord: string): Promise<ValidationResponse> => {
    const response = await fetch(`/api/word-ladder/validate-step`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentWord, nextWord }),
    });
    return response.json();
  },

  // Validate if a complete solution path is valid
  validateSolution: async (startWord: string, targetWord: string, solution: string[]): Promise<ValidationResponse> => {
    const response = await fetch(`/api/word-ladder/validate-solution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startWord, targetWord, solution }),
    });
    return response.json();
  },

  // Get possible next words (for hints)
  getHints: async (currentWord: string): Promise<HintResponse> => {
    const response = await fetch(`/api/word-ladder/hints?word=${encodeURIComponent(currentWord)}`);
    return response.json();
  },
};