import React from 'react';
import { cn } from '@/lib/utils';

interface WordDisplayProps {
  word: string;
  guessedLetters: string[];
  gameOver?: boolean;
  className?: string;
}

export default function WordDisplay({
  word,
  guessedLetters,
  gameOver = false,
  className
}: WordDisplayProps) {
  return (
    <div className={cn("flex justify-center space-x-2", className)}>
      {word.split('').map((letter, index) => {
        const isGuessed = guessedLetters.includes(letter.toUpperCase());
        const show = isGuessed || gameOver;
        
        return (
          <div 
            key={`${letter}-${index}`}
            className="flex flex-col items-center justify-end w-8 h-12"
          >
            <span className={cn(
              "text-2xl font-bold mb-1",
              { "text-gray-400": !show && gameOver },
              { "invisible": !show }
            )}>
              {letter.toUpperCase()}
            </span>
            <div className="w-8 h-0.5 bg-primary"></div>
          </div>
        );
      })}
    </div>
  );
}