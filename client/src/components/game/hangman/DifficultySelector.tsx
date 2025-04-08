import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Difficulty } from '@/lib/hangmanApi';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  selectedDifficulty: Difficulty;
  disabled?: boolean;
  className?: string;
}

export default function DifficultySelector({
  onSelect,
  selectedDifficulty,
  disabled = false,
  className
}: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  
  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <div className="text-sm font-medium">Difficulty</div>
      <div className="flex space-x-2">
        {difficulties.map((difficulty) => (
          <Button
            key={difficulty}
            onClick={() => onSelect(difficulty)}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            className="capitalize"
          >
            {difficulty}
          </Button>
        ))}
      </div>
    </div>
  );
}