import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircleIcon } from "lucide-react";

interface HowToPlayDialogProps {
  trigger?: React.ReactNode;
}

export default function HowToPlayDialog({ trigger }: HowToPlayDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <HelpCircleIcon className="h-5 w-5" />
            <span className="sr-only">How to play</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play Word Search</DialogTitle>
          <DialogDescription>
            Find all the hidden words in the grid!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium mb-2">Rules:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Find words by selecting letters in sequence - horizontally, 
                vertically, or diagonally.
              </li>
              <li>
                Words can be spelled forwards or backwards.
              </li>
              <li>
                Click (or touch) and drag to select letters in a straight line.
              </li>
              <li>
                When you find a word, it will be highlighted and marked off
                in the word list.
              </li>
              <li>
                Find all words to complete the puzzle!
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Difficulty Levels:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Easy:</strong> Fewer words to find
              </li>
              <li>
                <strong>Normal:</strong> Standard word search challenge
              </li>
              <li>
                <strong>Hard:</strong> More words to find
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}