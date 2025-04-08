import React from 'react';
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "../../game/LoadingSpinner";

interface GameControlsProps {
  onSubmit: () => void;
  onDeselect: () => void;
  onNewGame: () => void;
  selectedWords: string[];
  mistakesRemaining: number;
  isGameOver: boolean;
  isSubmitting: boolean;
}

export default function GameControls({
  onSubmit,
  onDeselect,
  onNewGame,
  selectedWords,
  mistakesRemaining,
  isGameOver,
  isSubmitting
}: GameControlsProps) {
  const hasSelections = selectedWords.length > 0;
  const hasFourSelected = selectedWords.length === 4;

  return (
    <div className="space-y-4 mt-4">
      {/* Mistakes counter */}
      <div className="flex justify-center items-center gap-1 mb-2">
        {[...Array(mistakesRemaining)].map((_, index) => (
          <div 
            key={index} 
            className="w-3 h-8 bg-primary mx-0.5 rounded-sm"
          />
        ))}
        {[...Array(4 - mistakesRemaining)].map((_, index) => (
          <div 
            key={index} 
            className="w-3 h-8 bg-gray-300 dark:bg-gray-700 mx-0.5 rounded-sm"
          />
        ))}
      </div>

      <div className="flex gap-2">
        {isGameOver ? (
          <Button 
            className="w-full" 
            onClick={onNewGame}
          >
            New Game
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onDeselect}
              disabled={!hasSelections || isSubmitting}
            >
              Deselect All
            </Button>
            
            <Button
              className="flex-1 relative"
              disabled={!hasFourSelected || isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Submit'
              )}
            </Button>
          </>
        )}
      </div>

      {hasSelections && !hasFourSelected && (
        <p className="text-center text-sm text-muted-foreground">
          Select {4 - selectedWords.length} more to submit
        </p>
      )}
    </div>
  );
}