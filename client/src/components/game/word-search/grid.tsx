import { useEffect, useState } from "react";
import type { Coordinate, Selection } from "@/pages/word-search";
import { cn } from "@/lib/utils";

interface WordSearchGridProps {
  grid: string[][];
  onWordFound: (word: string, coordinates: Coordinate[]) => void;
}

export default function WordSearchGrid({ grid, onWordFound }: WordSearchGridProps) {
  const [selection, setSelection] = useState<Selection>({
    start: null,
    end: null,
    cells: [],
  });
  const [isSelecting, setIsSelecting] = useState(false);

  // Get the cell coordinates in a straight line between two points
  const getCellsInLine = (start: Coordinate, end: Coordinate): Coordinate[] => {
    // Handle single cell selection
    if (start.row === end.row && start.col === end.col) {
      return [{ row: start.row, col: start.col }];
    }

    const cells: Coordinate[] = [];
    
    // Determine if selection is horizontal, vertical, or diagonal
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    // If not in a straight line, return empty array
    const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff);
    const isHorizontal = rowDiff === 0;
    const isVertical = colDiff === 0;
    
    if (!isDiagonal && !isHorizontal && !isVertical) {
      return [];
    }
    
    // Calculate step directions
    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;
    
    // Calculate number of steps
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    // Get all cells in the line
    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: start.row + i * rowStep,
        col: start.col + i * colStep,
      });
    }
    
    return cells;
  };
  
  // Get the word from a selection of cells
  const getWordFromSelection = (cells: Coordinate[]): string => {
    return cells.map(cell => grid[cell.row][cell.col]).join("");
  };
  
  // Handle touch/mouse events
  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    const start = { row, col };
    setSelection({
      start,
      end: start,
      cells: [start],
    });
  };
  
  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selection.start) return;
    
    const end = { row, col };
    const cells = getCellsInLine(selection.start, end);
    
    setSelection({
      ...selection,
      end,
      cells,
    });
  };
  
  const handleCellMouseUp = () => {
    if (!isSelecting) return;
    
    setIsSelecting(false);
    
    if (selection.cells.length > 1) {
      const word = getWordFromSelection(selection.cells);
      onWordFound(word, selection.cells);
    }
    
    // Reset selection after processing
    setSelection({
      start: null,
      end: null,
      cells: [],
    });
  };
  
  // Set up global mouse up handler (in case user moves cursor outside grid)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleCellMouseUp();
      }
    };
    
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isSelecting, selection]);
  
  // Determine if a cell is part of the current selection
  const isCellSelected = (row: number, col: number) => {
    return selection.cells.some(cell => cell.row === row && cell.col === col);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 overflow-auto mx-auto my-4">
      <div 
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          touchAction: "none", // Prevent scrolling on touch
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-md font-bold text-lg cursor-pointer select-none transition-colors",
                isCellSelected(rowIndex, colIndex)
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
              onTouchStart={() => handleCellMouseDown(rowIndex, colIndex)}
              onTouchMove={(e) => {
                // Convert touch to grid coordinates
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element) {
                  const cellId = element.getAttribute("data-cell-id");
                  if (cellId) {
                    const [row, col] = cellId.split("-").map(Number);
                    handleCellMouseEnter(row, col);
                  }
                }
              }}
              data-cell-id={`${rowIndex}-${colIndex}`}
            >
              {letter}
            </div>
          ))
        )}
      </div>
    </div>
  );
}