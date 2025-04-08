
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, ArrowRight } from "lucide-react";
import { HowToPlayDialogProps } from "./how-to-play-types";

export default function HowToPlayDialog({ trigger, open, onOpenChange, gamePath = "game" }: HowToPlayDialogProps) {
  // Helper function to get the appropriate title based on the current game
  const getGameTitle = (): string => {
    switch(gamePath) {
      case "game": return "Spell Bee";
      case "wordle": return "Wordle";
      case "word-search": return "Word Search";
      case "connections": return "Connections";
      case "hangman": return "Hangman";
      case "word-ladder": return "Word Ladder";
      case "statistics": return "Game Statistics";
      default: return "Word Games";
    }
  };

  // Helper function to get the appropriate description based on the current game
  const getGameDescription = (): string => {
    switch(gamePath) {
      case "game": return "Create words using the letters provided";
      case "wordle": return "Guess the 5-letter word in 6 tries";
      case "word-search": return "Find all hidden words in the grid";
      case "connections": return "Group words by their common connections";
      case "hangman": return "Guess the word letter by letter";
      case "word-ladder": return "Transform words one letter at a time";
      case "statistics": return "Track your game progress and achievements";
      default: return "Challenge yourself with various word games";
    }
  };

  // Render the content for the Spell Bee game
  const renderSpellBeeContent = () => (
    <>
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
    </>
  );

  // Render the content for the Wordle game
  const renderWordleContent = () => (
    <>
      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Rules:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li>Guess the 5-letter word in 6 tries</li>
          <li>Each guess must be a valid 5-letter word</li>
          <li>After each guess, the color of the tiles will change to show how close your guess was</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Color Guide:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li><span className="bg-green-500 text-white px-2 py-0.5 rounded">Green</span> - Letter is in the correct spot</li>
          <li><span className="bg-yellow-500 text-white px-2 py-0.5 rounded">Yellow</span> - Letter is in the word but in the wrong spot</li>
          <li><span className="bg-gray-500 text-white px-2 py-0.5 rounded">Gray</span> - Letter is not in the word</li>
        </ul>
      </div>

      <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p>A new word is available each day. Come back daily for a new challenge!</p>
      </div>
    </>
  );

  // Render the content for the Word Search game
  const renderWordSearchContent = () => (
    <>
      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Rules:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li>Find all hidden words in the grid</li>
          <li>Words can be placed horizontally, vertically, or diagonally</li>
          <li>Words can be spelled forward or backward</li>
          <li>Select a word by clicking and dragging from the first letter to the last</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Difficulty Levels:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li><strong>Easy:</strong> 8×8 grid with 6 words</li>
          <li><strong>Medium:</strong> 12×12 grid with 12 words</li>
          <li><strong>Hard:</strong> 15×15 grid with 18 words</li>
        </ul>
      </div>

      <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p>Try to find all words as quickly as possible. The timer is running!</p>
      </div>
    </>
  );

  // Render the content for the Connections game
  const renderConnectionsContent = () => (
    <>
      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Rules:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li>Find groups of four words that share a common theme</li>
          <li>Select four words and submit your guess</li>
          <li>There are four groups total to find</li>
          <li>You have a maximum of 4 incorrect attempts</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Difficulty Levels:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li><span className="bg-yellow-300 text-black px-2 py-0.5 rounded">Yellow</span> - Easiest connections</li>
          <li><span className="bg-green-400 text-black px-2 py-0.5 rounded">Green</span> - Easy connections</li>
          <li><span className="bg-blue-400 text-white px-2 py-0.5 rounded">Blue</span> - Medium connections</li>
          <li><span className="bg-purple-500 text-white px-2 py-0.5 rounded">Purple</span> - Hardest connections</li>
        </ul>
      </div>

      <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p>Think creatively about what might connect different words. Categories can include anything from "Types of Trees" to "Words Ending in -ING".</p>
      </div>
    </>
  );

  // Render the content for the Hangman game
  const renderHangmanContent = () => (
    <>
      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Rules:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li>Guess the hidden word one letter at a time</li>
          <li>Each incorrect guess adds a part to the hangman drawing</li>
          <li>You lose if the hangman drawing is completed (after 6 incorrect guesses)</li>
          <li>You win if you correctly guess the word before the drawing is complete</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Difficulty Levels:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li><strong>Easy:</strong> Common, shorter words</li>
          <li><strong>Medium:</strong> Moderately difficult words</li>
          <li><strong>Hard:</strong> Longer, less common words</li>
        </ul>
      </div>

      <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p>Start with common letters like E, A, R, I, O, T to increase your chances of success!</p>
      </div>
    </>
  );

  // Render the content for the Word Ladder game
  const renderWordLadderContent = () => (
    <>
      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Rules:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li>Transform the start word into the target word one step at a time</li>
          <li>Each step must be a valid English word</li>
          <li>You can only change one letter at each step</li>
          <li>The word length must remain the same throughout</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Example:</h3>
        <div className="flex flex-col items-center text-sm space-y-1">
          <div className="font-bold">CAT</div>
          <ArrowRight className="h-3 w-3" />
          <div>COT</div>
          <ArrowRight className="h-3 w-3" />
          <div>DOT</div>
          <ArrowRight className="h-3 w-3" />
          <div className="font-bold">DOG</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Scoring:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li>Start with 100 points</li>
          <li>Lose 5 points for each extra step beyond the minimum</li>
          <li>Lose 2 points for each hint used</li>
        </ul>
      </div>

      <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p>Try to solve the puzzle in as few steps as possible. Use hints if you get stuck!</p>
      </div>
    </>
  );

  // Render the content for the Statistics page
  const renderStatisticsContent = () => (
    <>
      <div className="space-y-2">
        <h3 className="font-medium text-primary dark:text-primary">Statistics Features:</h3>
        <ul className="space-y-2 pl-6 list-disc text-sm">
          <li>View overall performance across all games</li>
          <li>See your high scores and average scores</li>
          <li>Track the total number of words found</li>
          <li>Analyze your word length distribution</li>
          <li>Monitor your daily progress and streaks</li>
        </ul>
      </div>

      <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p>Your statistics are saved locally in your browser. Play daily to improve your scores and streaks!</p>
      </div>
    </>
  );

  // Helper function to render the appropriate content based on the current game
  const renderGameContent = () => {
    switch(gamePath) {
      case "game": return renderSpellBeeContent();
      case "wordle": return renderWordleContent();
      case "word-search": return renderWordSearchContent();
      case "connections": return renderConnectionsContent();
      case "hangman": return renderHangmanContent();
      case "word-ladder": return renderWordLadderContent();
      case "statistics": return renderStatisticsContent();
      default: return renderSpellBeeContent();
    }
  };

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
          <DialogTitle className="text-center text-xl">How to Play {getGameTitle()}</DialogTitle>
          <DialogDescription className="text-center">
            {getGameDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          {renderGameContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
