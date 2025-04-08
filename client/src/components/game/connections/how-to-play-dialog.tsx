import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function HowToPlayDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="How to play">
          <InfoIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to Play Connections</DialogTitle>
          <DialogDescription>
            Group similar words to solve the puzzle.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <h3 className="font-semibold mb-2">Rules:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Find groups of four related words.</li>
              <li>Select four words and tap "Submit" to check if they form a valid connection.</li>
              <li>Find all four groups to win the game.</li>
              <li>You have 4 mistakes allowed before game over.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Examples of Categories:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="bg-yellow-200 text-yellow-900 px-1 rounded">🟨 APPLE, ORANGE, GRAPE, BANANA</span> - Fruits</li>
              <li><span className="bg-green-200 text-green-900 px-1 rounded">🟩 DOG, CAT, RABBIT, HAMSTER</span> - Pets</li>
              <li><span className="bg-blue-200 text-blue-900 px-1 rounded">🟦 RED, BLUE, GREEN, YELLOW</span> - Colors</li>
              <li><span className="bg-purple-200 text-purple-900 px-1 rounded">🟪 PIANO, GUITAR, DRUMS, VIOLIN</span> - Musical Instruments</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Difficulty Levels:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="text-green-600 font-medium">Easy</span>: Obvious connections</li>
              <li><span className="text-yellow-600 font-medium">Medium</span>: Standard difficulty</li>
              <li><span className="text-red-600 font-medium">Hard</span>: Challenging connections</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}