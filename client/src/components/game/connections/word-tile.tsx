import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WordTileProps {
  word: string;
  selected: boolean;
  solved: boolean;
  groupIndex?: number;
  onSelect: (word: string) => void;
  disabled?: boolean;
}

// Color schemes for each group
const GROUP_COLORS = [
  "bg-yellow-300 text-yellow-950", // Yellow for group 0
  "bg-green-400 text-green-950",   // Green for group 1
  "bg-blue-400 text-blue-950",     // Blue for group 2
  "bg-purple-400 text-purple-950"  // Purple for group 3
];

export default function WordTile({ 
  word, 
  selected, 
  solved, 
  groupIndex, 
  onSelect, 
  disabled = false 
}: WordTileProps) {
  const [animate, setAnimate] = useState(false);
  
  // Animation effect when a word is selected or deselected
  useEffect(() => {
    if (selected) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 150);
      return () => clearTimeout(timer);
    }
  }, [selected]);
  
  return (
    <button
      className={cn(
        "w-full h-14 rounded-md font-bold text-sm transition-all duration-150 border-2 flex items-center justify-center",
        // Base styles based on state
        {
          "border-primary/60 bg-white dark:bg-gray-800": !selected && !solved,
          "border-primary bg-primary/10 dark:bg-primary/30 scale-95": selected && !solved,
          "cursor-not-allowed opacity-50": disabled && !solved,
          "scale-105": animate,
        },
        // Group color when solved
        solved && groupIndex !== undefined && GROUP_COLORS[groupIndex]
      )}
      onClick={() => !disabled && !solved && onSelect(word)}
      disabled={disabled || solved}
    >
      {word}
    </button>
  );
}