import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface GameStatusProps {
  incorrectGuesses: number;
  maxIncorrectGuesses: number;
  guessedLetters: string[];
  gameWon: boolean;
  gameLost: boolean;
  className?: string;
}

export default function GameStatus({
  incorrectGuesses,
  maxIncorrectGuesses,
  guessedLetters,
  gameWon,
  gameLost,
  className
}: GameStatusProps) {
  // Calculate remaining guesses
  const remainingGuesses = maxIncorrectGuesses - incorrectGuesses;
  
  return (
    <div className={cn("flex flex-col space-y-3 items-center", className)}>
      {/* Game state messages */}
      {gameWon && (
        <div className="text-xl font-bold text-green-500">
          You Won! 🎉
        </div>
      )}
      
      {gameLost && (
        <div className="text-xl font-bold text-red-500">
          Game Over! 😢
        </div>
      )}
      
      {/* Remaining attempts */}
      <div className="flex items-center">
        <div className="text-sm font-medium mr-2">Remaining attempts:</div>
        <Badge variant={remainingGuesses <= 2 ? "destructive" : "default"}>
          {remainingGuesses}
        </Badge>
      </div>
      
      {/* Guessed letters */}
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium mb-1">Guessed letters:</div>
        <div className="flex flex-wrap justify-center gap-1 max-w-xs">
          {guessedLetters.length === 0 ? (
            <span className="text-gray-400 text-sm">None yet</span>
          ) : (
            guessedLetters.map(letter => (
              <Badge key={letter} variant="outline" className="text-xs">
                {letter}
              </Badge>
            ))
          )}
        </div>
      </div>
    </div>
  );
}