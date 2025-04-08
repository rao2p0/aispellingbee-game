import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/game/LoadingSpinner';
import HangmanFigure from '@/components/game/hangman/HangmanFigure';
import WordDisplay from '@/components/game/hangman/WordDisplay';
import Keyboard from '@/components/game/hangman/Keyboard';
import GameStatus from '@/components/game/hangman/GameStatus';
import DifficultySelector from '@/components/game/hangman/DifficultySelector';
import GameLayout from '@/components/global/game-layout';
import { hangmanApi, Difficulty, HangmanWord } from '@/lib/hangmanApi';

export default function Hangman() {
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [word, setWord] = useState<string>('');
  const [wordId, setWordId] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  
  // Constants
  const MAX_INCORRECT_GUESSES = 6;
  
  // Fetch a new word
  const { data: wordData, isLoading, refetch } = useQuery({
    queryKey: ['hangman', 'word', difficulty],
    queryFn: () => hangmanApi.getRandomWord(difficulty),
    enabled: false, // Don't fetch automatically, we'll trigger manually
  });
  
  // Start a new game
  const startNewGame = async () => {
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameStatus('playing');
    
    // Fetch a new word
    const result = await refetch();
    if (result.data) {
      setWord(result.data.word);
      setWordId(result.data.wordId);
    }
  };
  
  // Initialize the game on mount
  useEffect(() => {
    startNewGame();
  }, [difficulty]);
  
  // Handle letter guess
  const handleLetterGuess = async (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) {
      return;
    }
    
    // Add to guessed letters
    setGuessedLetters((prev) => [...prev, letter]);
    
    // Check if letter is in the word
    const upperCaseWord = word.toUpperCase();
    if (!upperCaseWord.includes(letter)) {
      // Incorrect guess
      const newIncorrectGuesses = incorrectGuesses + 1;
      setIncorrectGuesses(newIncorrectGuesses);
      
      // Check if game is over
      if (newIncorrectGuesses >= MAX_INCORRECT_GUESSES) {
        setGameStatus('lost');
      }
    } else {
      // Check if all letters have been guessed
      const uniqueLettersInWord = Array.from(new Set(upperCaseWord.split('')));
      const correctGuesses = guessedLetters.filter(letter => 
        upperCaseWord.includes(letter)
      );
      
      // Add this new correct guess
      correctGuesses.push(letter);
      
      // If all unique letters are guessed, the player wins
      if (uniqueLettersInWord.every(letter => correctGuesses.includes(letter))) {
        setGameStatus('won');
      }
    }
  };
  
  // Game is over (won or lost)
  const isGameOver = gameStatus === 'won' || gameStatus === 'lost';
  
  return (
    <GameLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Hangman</h1>
          <div className="flex space-x-2">
            {/* Help button removed - now available in the header */}
            <Button onClick={startNewGame}>
              New Game
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column - Hangman figure */}
              <div className="flex justify-center">
                {isLoading ? (
                  <LoadingSpinner size="lg" />
                ) : (
                  <HangmanFigure 
                    incorrectGuesses={incorrectGuesses}
                    maxIncorrectGuesses={MAX_INCORRECT_GUESSES}
                  />
                )}
              </div>
              
              {/* Right column - Game info */}
              <div className="flex flex-col space-y-6 items-center">
                {/* Difficulty selector */}
                <DifficultySelector 
                  onSelect={setDifficulty}
                  selectedDifficulty={difficulty}
                  disabled={isLoading || gameStatus === 'playing'}
                />
                
                {/* Game status */}
                <GameStatus 
                  incorrectGuesses={incorrectGuesses}
                  maxIncorrectGuesses={MAX_INCORRECT_GUESSES}
                  guessedLetters={guessedLetters}
                  gameWon={gameStatus === 'won'}
                  gameLost={gameStatus === 'lost'}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Word display */}
        <Card className="mb-6">
          <CardContent className="p-6 flex justify-center">
            {isLoading ? (
              <LoadingSpinner size="md" />
            ) : word ? (
              <WordDisplay 
                word={word}
                guessedLetters={guessedLetters}
                gameOver={isGameOver}
              />
            ) : (
              <div className="text-gray-400">Loading word...</div>
            )}
          </CardContent>
        </Card>
        
        {/* Keyboard */}
        <Card>
          <CardContent className="p-6 flex justify-center">
            <Keyboard 
              onLetterClick={handleLetterGuess}
              guessedLetters={guessedLetters}
              disabled={isLoading || isGameOver}
            />
          </CardContent>
        </Card>
      </div>
    </GameLayout>
  );
}