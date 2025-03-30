import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface HowToPlayDialogProps {
  trigger?: React.ReactNode;
}

export default function HowToPlayDialog({ trigger }: HowToPlayDialogProps) {
  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <HelpCircle className="h-5 w-5" />
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">How to Play Wordle</DialogTitle>
          <DialogDescription className="text-center">
            Guess the word in 6 tries
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <p className="mb-2">Each guess must be a valid 5-letter word.</p>
            <p className="mb-2">After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Examples</h3>
            
            <div className="mb-4">
              <div className="flex mb-2">
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-green-500 text-white mr-1">W</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">E</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">A</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">R</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700">Y</div>
              </div>
              <p><span className="font-bold">W</span> is in the word and in the correct spot.</p>
            </div>
            
            <div className="mb-4">
              <div className="flex mb-2">
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">P</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-yellow-500 text-white mr-1">I</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">L</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">L</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700">S</div>
              </div>
              <p><span className="font-bold">I</span> is in the word but in the wrong spot.</p>
            </div>
            
            <div className="mb-4">
              <div className="flex mb-2">
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">V</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">A</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700 mr-1">G</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-500 text-white mr-1">U</div>
                <div className="flex items-center justify-center h-10 w-10 text-lg font-bold border-2 bg-gray-300 dark:bg-gray-700">E</div>
              </div>
              <p><span className="font-bold">U</span> is not in the word in any spot.</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium">A new Wordle will be available each day!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}