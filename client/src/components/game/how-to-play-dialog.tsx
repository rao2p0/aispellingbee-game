
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle } from "lucide-react";

interface HowToPlayDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function HowToPlayDialog({ trigger, open, onOpenChange }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="flex gap-2 items-center">
            <HelpCircle className="w-4 h-4" /> How to Play
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">How to Play</DialogTitle>
          <DialogDescription className="text-center">
            Create words using the letters provided
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <h3 className="font-medium text-primary dark:text-primary">Rules:</h3>
            <ul className="space-y-2 pl-6 list-disc text-sm">
              <li>Words must be at least 4 letters long</li>
              <li>Words <strong>must</strong> contain the center letter (highlighted in yellow)</li>
              <li>Letters can be used multiple times</li>
              <li>Find as many words as possible!</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-primary dark:text-primary">Scoring:</h3>
            <ul className="space-y-2 pl-6 list-disc text-sm">
              <li>4-letter words = 1 point</li>
              <li>Longer words = 1 point per letter</li>
              <li>Words using all 7 letters = bonus points!</li>
            </ul>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p>Keep finding words to increase your rank! Try to reach the highest rank: Genius!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
