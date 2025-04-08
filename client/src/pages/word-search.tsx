import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GameLayout from "@/components/global/game-layout";

// Import directly using relative paths to avoid import errors
import WordSearchGrid from "../components/game/word-search/grid";
import WordList from "../components/game/word-search/word-list";
import WordSearchTimer from "../components/game/word-search/timer";
import WordSearchControls from "../components/game/word-search/controls";
import { generateWordSearchPuzzle, type Orientation } from "../lib/wordSearch";

export type WordPosition = {
  word: string;
  startRow: number;
  startCol: number;
  orientation: Orientation;
  found: boolean;
};

export type Coordinate = {
  row: number;
  col: number;
};

export type Selection = {
  start: Coordinate | null;
  end: Coordinate | null;
  cells: Coordinate[];
};

const GRID_SIZE = 10;
const DIFFICULTY_LEVELS = ["Easy", "Normal", "Hard"] as const;
type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

export default function WordSearch() {
  const { toast } = useToast();
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<Selection>({ start: null, end: null, cells: [] });
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Normal");
  
  // Timer ref for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new game
  const startNewGame = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Determine number of words based on difficulty
    let numWords = 8; // Default for Normal
    if (difficulty === "Easy") {
      numWords = 6;
    } else if (difficulty === "Hard") {
      numWords = 10;
    }
    
    // Generate new puzzle
    const { grid, wordPositions } = generateWordSearchPuzzle(GRID_SIZE, numWords);
    
    setGrid(grid);
    setWordPositions(wordPositions.map((wp: WordPosition) => ({ ...wp, found: false })));
    setFoundWords([]);
    setSelection({ start: null, end: null, cells: [] });
    setGameComplete(false);
    setTimeElapsed(0);
    
    // Start timer
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    // Log the hidden words for development
    console.log("Hidden words:", wordPositions.map((wp: WordPosition) => wp.word));
  }, [difficulty]);

  // Initialize game on mount and when difficulty changes
  useEffect(() => {
    startNewGame();
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startNewGame]);

  // Check if game is complete
  useEffect(() => {
    if (wordPositions.length > 0 && foundWords.length === wordPositions.length) {
      setGameComplete(true);
      setIsTimerRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Show completion toast
      toast({
        title: "Puzzle Complete!",
        description: `You found all ${wordPositions.length} words in ${formatTime(timeElapsed)}!`,
        variant: "default",
      });
    }
  }, [foundWords, wordPositions, timeElapsed, toast]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update selection when dragging
  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    const newStart = { row, col };
    setSelection({
      start: newStart,
      end: newStart, // Initially, end is the same as start
      cells: [newStart],
    });
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selection.start) return;
    
    // Only allow selections in straight lines (horizontal, vertical, diagonal)
    const { row: startRow, col: startCol } = selection.start;
    
    let newCells: Coordinate[] = [];
    const end = { row, col };
    
    // Calculate cells in between start and end point
    // Horizontal
    if (row === startRow) {
      const minCol = Math.min(startCol, col);
      const maxCol = Math.max(startCol, col);
      for (let c = minCol; c <= maxCol; c++) {
        newCells.push({ row, col: c });
      }
    }
    // Vertical
    else if (col === startCol) {
      const minRow = Math.min(startRow, row);
      const maxRow = Math.max(startRow, row);
      for (let r = minRow; r <= maxRow; r++) {
        newCells.push({ row: r, col });
      }
    }
    // Diagonal
    else if (Math.abs(row - startRow) === Math.abs(col - startCol)) {
      const rowStep = row > startRow ? 1 : -1;
      const colStep = col > startCol ? 1 : -1;
      const steps = Math.abs(row - startRow);
      
      for (let i = 0; i <= steps; i++) {
        newCells.push({ 
          row: startRow + i * rowStep, 
          col: startCol + i * colStep 
        });
      }
    }
    // Not a valid selection direction
    else {
      return;
    }
    
    setSelection({
      start: selection.start,
      end,
      cells: newCells,
    });
  };

  const handleCellMouseUp = () => {
    setIsSelecting(false);
    
    // Check if the selection matches any of the hidden words
    if (selection.cells.length > 1) {
      checkSelection();
    }
  };

  // Check if the current selection matches any word
  const checkSelection = () => {
    if (!selection.cells.length) return;
    
    // Get the word formed by the selection
    let selectedWord = '';
    for (const { row, col } of selection.cells) {
      selectedWord += grid[row][col];
    }
    
    // Check if it matches any of the word positions (forward or backward)
    for (let i = 0; i < wordPositions.length; i++) {
      const wordPosition = wordPositions[i];
      
      // Skip already found words
      if (wordPosition.found) continue;
      
      const { word, startRow, startCol, orientation } = wordPosition;
      
      // Generate the expected coordinates for this word
      const expectedCoords: Coordinate[] = [];
      
      let rowStep = 0;
      let colStep = 0;
      
      switch (orientation) {
        case 'horizontal':
          colStep = 1;
          break;
        case 'vertical':
          rowStep = 1;
          break;
        case 'diagonal-down':
          rowStep = 1;
          colStep = 1;
          break;
        case 'diagonal-up':
          rowStep = -1;
          colStep = 1;
          break;
      }
      
      for (let j = 0; j < word.length; j++) {
        expectedCoords.push({
          row: startRow + j * rowStep,
          col: startCol + j * colStep
        });
      }
      
      // Check if selection matches expected coordinates (in either direction)
      const forwardMatch = arraysEqual(selection.cells, expectedCoords);
      const backwardMatch = arraysEqual(selection.cells, [...expectedCoords].reverse());
      
      if (forwardMatch || backwardMatch) {
        // Found a match!
        const newWordPositions = [...wordPositions];
        newWordPositions[i] = { ...newWordPositions[i], found: true };
        setWordPositions(newWordPositions);
        setFoundWords([...foundWords, word]);
        
        // Show success toast
        toast({
          title: "Word Found!",
          description: `You found "${word}"`,
          variant: "default",
        });
        
        // Clear selection after a short delay to show the highlight
        setTimeout(() => {
          setSelection({ start: null, end: null, cells: [] });
        }, 500);
        
        return;
      }
    }
    
    // If we get here, no match was found
    // Show error toast for long enough selections
    if (selection.cells.length >= 3) {
      toast({
        title: "Not a hidden word",
        description: "Try again!",
        variant: "destructive",
      });
    }
    
    // Clear selection
    setSelection({ start: null, end: null, cells: [] });
  };

  // Helper to compare arrays of coordinates
  const arraysEqual = (a: Coordinate[], b: Coordinate[]) => {
    if (a.length !== b.length) return false;
    
    for (let i = 0; i < a.length; i++) {
      if (a[i].row !== b[i].row || a[i].col !== b[i].col) {
        return false;
      }
    }
    
    return true;
  };

  const changeDifficulty = (newDifficulty: DifficultyLevel) => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty);
      // The game will restart due to the useEffect dependency on difficulty
    }
  };

  return (
    <GameLayout>
      <div className="container max-w-4xl mx-auto px-4 pb-8">
        <div className="flex justify-between items-center mb-4 mt-6">
          <Button 
            onClick={startNewGame}
            variant="default"
            className="bg-primary hover:bg-primary/90"
          >
            New game
          </Button>
          
          <h1 className="text-3xl font-bold text-center">Word Search</h1>
          
          <div className="flex items-center gap-2">
            <WordSearchTimer time={formatTime(timeElapsed)} />
            {/* Help button removed - now available in the header */}
          </div>
        </div>
        
        <WordSearchControls 
          difficulty={difficulty}
          difficultyOptions={DIFFICULTY_LEVELS}
          onChangeDifficulty={changeDifficulty}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="col-span-1 md:col-span-2">
            {grid.length > 0 && (
              <WordSearchGrid 
                grid={grid}
                onWordFound={(word: string, coordinates: Coordinate[]) => {
                  // Check if word is in the word positions
                  const wordPosition = wordPositions.find((wp: WordPosition) => wp.word === word && !wp.found);
                  if (wordPosition) {
                    // Mark word as found
                    const newWordPositions = [...wordPositions];
                    const index = newWordPositions.findIndex((wp: WordPosition) => wp.word === word);
                    newWordPositions[index] = { ...newWordPositions[index], found: true };
                    setWordPositions(newWordPositions);
                    setFoundWords([...foundWords, word]);
                    
                    // Show success toast
                    toast({
                      title: "Word Found!",
                      description: `You found "${word}"`,
                      variant: "default",
                    });
                  }
                }}
              />
            )}
          </div>
          
          <div className="col-span-1">
            {wordPositions.length > 0 && (
              <WordList 
                wordPositions={wordPositions}
                foundWords={foundWords}
              />
            )}
          </div>
        </div>
        
        {gameComplete && (
          <div className="mt-6 text-center p-4 bg-green-100 dark:bg-green-900 rounded-md">
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Congratulations!</h2>
            <p className="mt-2">
              You found all {wordPositions.length} words in {formatTime(timeElapsed)}!
            </p>
            <Button
              onClick={startNewGame}
              variant="default"
              className="mt-4 bg-primary hover:bg-primary/90"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}