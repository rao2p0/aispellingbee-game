import React from 'react';
import { cn } from '@/lib/utils';

interface HangmanFigureProps {
  incorrectGuesses: number;
  maxIncorrectGuesses?: number;
  className?: string;
}

export default function HangmanFigure({ 
  incorrectGuesses, 
  maxIncorrectGuesses = 6,
  className
}: HangmanFigureProps) {
  // Calculate the progress percentage
  const progress = Math.min(incorrectGuesses / maxIncorrectGuesses, 1);
  
  // Determine which parts of the hangman to show based on incorrect guesses
  const showHead = incorrectGuesses >= 1;
  const showBody = incorrectGuesses >= 2;
  const showLeftArm = incorrectGuesses >= 3;
  const showRightArm = incorrectGuesses >= 4;
  const showLeftLeg = incorrectGuesses >= 5;
  const showRightLeg = incorrectGuesses >= 6;
  
  return (
    <div className={cn("relative w-64 h-72", className)}>
      {/* Scaffold (always shown) */}
      <div className="absolute bottom-0 left-0 w-48 h-2 bg-primary"></div>
      <div className="absolute bottom-0 left-8 w-2 h-64 bg-primary"></div>
      <div className="absolute top-0 left-8 w-32 h-2 bg-primary"></div>
      <div className="absolute top-0 right-24 w-2 h-12 bg-primary"></div>
      
      {/* Head */}
      {showHead && (
        <div className="absolute top-12 right-[86px] w-12 h-12 rounded-full border-4 border-primary"></div>
      )}
      
      {/* Body */}
      {showBody && (
        <div className="absolute top-24 right-[91px] w-2 h-20 bg-primary"></div>
      )}
      
      {/* Left arm */}
      {showLeftArm && (
        <div className="absolute top-28 right-[93px] w-16 h-2 bg-primary rotate-[135deg]"></div>
      )}
      
      {/* Right arm */}
      {showRightArm && (
        <div className="absolute top-28 right-[75px] w-16 h-2 bg-primary rotate-45"></div>
      )}
      
      {/* Left leg */}
      {showLeftLeg && (
        <div className="absolute top-[170px] right-[93px] w-16 h-2 bg-primary rotate-[225deg]"></div>
      )}
      
      {/* Right leg */}
      {showRightLeg && (
        <div className="absolute top-[170px] right-[75px] w-16 h-2 bg-primary rotate-[135deg]"></div>
      )}
      
      {/* Game over indicator */}
      {incorrectGuesses >= maxIncorrectGuesses && (
        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 text-red-500 font-bold text-xl">
          Game Over
        </div>
      )}
    </div>
  );
}