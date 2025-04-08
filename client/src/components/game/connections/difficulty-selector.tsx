import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DifficultySelectorProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onChangeDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  disabled?: boolean;
}

export default function DifficultySelector({
  difficulty,
  onChangeDifficulty,
  disabled
}: DifficultySelectorProps) {
  const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  };

  const difficultyColors = {
    easy: 'text-green-600',
    medium: 'text-yellow-600',
    hard: 'text-red-600'
  };

  return (
    <div className="mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            disabled={disabled}
          >
            <span>
              Difficulty: 
              <span className={`ml-2 font-bold ${difficultyColors[difficulty]}`}>
                {difficultyLabels[difficulty]}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[200px]">
          <DropdownMenuItem 
            className={`${difficulty === 'easy' ? 'bg-primary/10' : ''}`}
            onClick={() => onChangeDifficulty('easy')}
          >
            <span className="text-green-600 font-medium">Easy</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`${difficulty === 'medium' ? 'bg-primary/10' : ''}`}
            onClick={() => onChangeDifficulty('medium')}
          >
            <span className="text-yellow-600 font-medium">Medium</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`${difficulty === 'hard' ? 'bg-primary/10' : ''}`}
            onClick={() => onChangeDifficulty('hard')}
          >
            <span className="text-red-600 font-medium">Hard</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}