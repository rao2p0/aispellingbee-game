// Hangman API client

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface HangmanWord {
  wordId: string;
  word: string; // Only included in development
  length: number;
  difficulty: Difficulty;
}

export interface LetterGuessResult {
  letter: string;
  found: boolean;
  positions: number[];
  wordId: string;
}

export interface WordGuessResult {
  correct: boolean;
  wordId: string;
}

export const hangmanApi = {
  // Get a random word with specified difficulty
  getRandomWord: async (difficulty: Difficulty = 'medium'): Promise<HangmanWord> => {
    try {
      const response = await fetch(`/api/hangman/word?difficulty=${difficulty}`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting random word:', error);
      throw error;
    }
  },

  // Guess a letter
  guessLetter: async (wordId: string, word: string, letter: string): Promise<LetterGuessResult> => {
    try {
      const response = await fetch('/api/hangman/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wordId, word, letter }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error guessing letter:', error);
      throw error;
    }
  },

  // Guess the entire word
  guessWord: async (wordId: string, word: string, guess: string): Promise<WordGuessResult> => {
    try {
      const response = await fetch('/api/hangman/guess-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wordId, word, guess }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error guessing word:', error);
      throw error;
    }
  }
};