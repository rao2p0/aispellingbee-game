import { Button } from '@/components/ui/button';
import { Difficulty } from '@/lib/wordLadderApi';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export default function DifficultySelector({ 
  difficulty, 
  onChangeDifficulty,
  disabled = false
}: DifficultySelectorProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-sm font-medium">Difficulty:</div>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant={difficulty === 'easy' ? 'default' : 'outline'}
          onClick={() => onChangeDifficulty('easy')}
          disabled={disabled}
          className={difficulty === 'easy' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
        >
          Easy
        </Button>
        <Button
          size="sm"
          variant={difficulty === 'medium' ? 'default' : 'outline'}
          onClick={() => onChangeDifficulty('medium')}
          disabled={disabled}
          className={difficulty === 'medium' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
        >
          Medium
        </Button>
        <Button
          size="sm"
          variant={difficulty === 'hard' ? 'default' : 'outline'}
          onClick={() => onChangeDifficulty('hard')}
          disabled={disabled}
          className={difficulty === 'hard' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
        >
          Hard
        </Button>
      </div>
    </div>
  );
}