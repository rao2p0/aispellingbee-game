import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import WordGrid from "@/components/game/connections/word-grid";
import GameControls from "@/components/game/connections/game-controls";
import Timer from "@/components/game/connections/timer";
import DifficultySelector from "@/components/game/connections/difficulty-selector";
import HowToPlayDialog from "@/components/game/connections/how-to-play-dialog";
import { connectionsApi, type GameData } from "@/lib/connectionsApi";

export default function Connections() {
  // Game state
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<{ words: string[], groupIndex: number }[]>([]);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [mistakesRemaining, setMistakesRemaining] = useState(4);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const { toast } = useToast();

  // Initialize a new game
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    try {
      const { words: newWords, gameData: newGameData } = await connectionsApi.getNewGame(difficulty);
      setWords(newWords);
      setGameData(newGameData);
      setSolvedGroups([]);
      setSelectedWords([]);
      setMistakesRemaining(4);
      setIsGameOver(false);
      setIsTimerRunning(true);
      setTimeElapsed(0);
    } catch (error) {
      console.error("Failed to initialize game:", error);
      toast({
        title: "Error",
        description: "Failed to load game data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, toast]);

  // Load a new game on initial render and when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Update solved groups and check for game completion
  useEffect(() => {
    if (solvedGroups.length === 4 && gameData) {
      setIsGameOver(true);
      setIsTimerRunning(false);
      toast({
        title: "Congratulations!",
        description: `You found all connections in ${formatTime(timeElapsed)}!`,
        variant: "default",
      });
    }
  }, [solvedGroups, gameData, timeElapsed, toast]);

  // Check for game over due to mistakes
  useEffect(() => {
    if (mistakesRemaining <= 0) {
      setIsGameOver(true);
      setIsTimerRunning(false);
      toast({
        title: "Game Over",
        description: "You've used all your attempts. Try again!",
        variant: "destructive",
      });
    }
  }, [mistakesRemaining, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle word selection
  const handleSelectWord = (word: string) => {
    if (selectedWords.includes(word)) {
      // Deselect if already selected
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 4) {
      // Select if less than 4 words are selected
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Handle submission of a group
  const handleSubmit = async () => {
    if (selectedWords.length !== 4 || !gameData) return;
    
    setIsSubmitting(true);
    
    try {
      // For this implementation, we'll use client-side validation to avoid server calls
      const result = connectionsApi.validateSelectionClientSide(selectedWords, gameData);
      
      if (result.valid && result.groupIndex !== undefined) {
        // Valid group found
        setSolvedGroups([...solvedGroups, { 
          words: [...selectedWords], 
          groupIndex: result.groupIndex 
        }]);
        
        toast({
          title: "Correct!",
          description: `You found the "${result.category}" group.`,
          variant: "default",
        });
      } else {
        // Invalid group
        setMistakesRemaining(prev => prev - 1);
        
        toast({
          title: "Incorrect",
          description: "Those words don't form a connection. Try again!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating selection:", error);
      toast({
        title: "Error",
        description: "Failed to validate your selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelectedWords([]);
      setIsSubmitting(false);
    }
  };

  // Handle difficulty change
  const handleChangeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty);
      // Game will be reinitialized through useEffect dependency on difficulty
    }
  };

  return (
    <div className="container max-w-xl mx-auto px-4 pt-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Connections</h1>
        <div className="flex items-center gap-2">
          <Timer 
            isRunning={isTimerRunning} 
            onTimeUpdate={setTimeElapsed}
          />
          <HowToPlayDialog />
        </div>
      </div>

      <DifficultySelector 
        difficulty={difficulty}
        onChangeDifficulty={handleChangeDifficulty}
        disabled={isLoading || (!isGameOver && solvedGroups.length > 0)}
      />

      {isLoading ? (
        <div className="py-12 text-center">Loading game data...</div>
      ) : (
        <>
          <GameControls
            onSubmit={handleSubmit}
            onDeselect={() => setSelectedWords([])}
            onNewGame={initializeGame}
            selectedWords={selectedWords}
            mistakesRemaining={mistakesRemaining}
            isGameOver={isGameOver}
            isSubmitting={isSubmitting}
          />
          
          <WordGrid
            words={words}
            selectedWords={selectedWords}
            solvedGroups={solvedGroups}
            onSelectWord={handleSelectWord}
            disabled={isGameOver || isSubmitting}
          />
        </>
      )}
      
      {isGameOver && (
        <div className="mt-6 text-center p-4 bg-primary/10 rounded-md">
          <h2 className="text-xl font-bold">
            {solvedGroups.length === 4 ? "Congratulations!" : "Game Over"}
          </h2>
          <p className="mt-2">
            {solvedGroups.length === 4 
              ? `You found all connections in ${formatTime(timeElapsed)}!` 
              : `You found ${solvedGroups.length} out of 4 groups.`}
          </p>
        </div>
      )}
    </div>
  );
}