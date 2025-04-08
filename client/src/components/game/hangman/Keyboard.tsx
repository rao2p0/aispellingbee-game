import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface KeyboardProps {
  onLetterClick: (letter: string) => void;
  guessedLetters: string[];
  disabled?: boolean;
  className?: string;
}

export default function Keyboard({
  onLetterClick,
  guessedLetters,
  disabled = false,
  className
}: KeyboardProps) {
  // Create keyboard layout
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyClick = (letter: string) => {
    if (!disabled && !guessedLetters.includes(letter)) {
      onLetterClick(letter);
    }
  };

  // Handle physical keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (!disabled && /^[A-Z]$/.test(key) && !guessedLetters.includes(key)) {
        onLetterClick(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, guessedLetters, onLetterClick]);

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-1">
          {row.map((letter) => {
            const isGuessed = guessedLetters.includes(letter);
            return (
              <Button
                key={letter}
                onClick={() => handleKeyClick(letter)}
                disabled={isGuessed || disabled}
                variant={isGuessed ? "secondary" : "default"}
                className="w-8 h-10 p-0 text-lg font-semibold"
              >
                {letter}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}