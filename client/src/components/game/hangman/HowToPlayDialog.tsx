import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';

interface HowToPlayDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function HowToPlayDialog({ 
  trigger, 
  open, 
  onOpenChange 
}: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <InfoIcon className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play Hangman</DialogTitle>
          <DialogDescription>
            Test your word knowledge with this classic word-guessing game.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-sm">Objective</h3>
            <p className="text-sm text-muted-foreground">
              Guess the hidden word by suggesting letters before you run out of attempts.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm">Rules</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-1">
              <li>Each game starts with a randomly selected hidden word.</li>
              <li>Guess one letter at a time using the on-screen keyboard or your physical keyboard.</li>
              <li>If the letter is in the word, it will be revealed in all correct positions.</li>
              <li>If the letter is not in the word, part of the hangman will be drawn.</li>
              <li>After 6 incorrect guesses, the hangman is complete and the game is over.</li>
              <li>You win by revealing all the letters in the word before the hangman is complete.</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm">Difficulty Levels</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-1">
              <li><strong>Easy:</strong> Short words (3-5 letters)</li>
              <li><strong>Medium:</strong> Medium-length words (6-8 letters)</li>
              <li><strong>Hard:</strong> Long words (9+ letters)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}