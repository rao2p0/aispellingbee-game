import React from 'react';
import { cn } from "@/lib/utils";

interface WordGridProps {
  words: string[];
  selectedWords: string[];
  solvedGroups: { words: string[], groupIndex: number }[];
  onSelectWord: (word: string) => void;
  disabled?: boolean;
}

// Color scheme for the solved groups
const groupColors = [
  "bg-yellow-200 text-yellow-900 border-yellow-400 hover:bg-yellow-300",
  "bg-green-200 text-green-900 border-green-400 hover:bg-green-300",
  "bg-blue-200 text-blue-900 border-blue-400 hover:bg-blue-300",
  "bg-purple-200 text-purple-900 border-purple-400 hover:bg-purple-300",
];

export default function WordGrid({ 
  words, 
  selectedWords, 
  solvedGroups, 
  onSelectWord,
  disabled = false 
}: WordGridProps) {
  // Check if a word is part of a solved group
  const getWordStatus = (word: string) => {
    for (let i = 0; i < solvedGroups.length; i++) {
      if (solvedGroups[i].words.includes(word)) {
        return { solved: true, groupIndex: solvedGroups[i].groupIndex };
      }
    }
    return { solved: false, groupIndex: -1 };
  };

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {words.map((word, index) => {
        const { solved, groupIndex } = getWordStatus(word);
        const isSelected = selectedWords.includes(word);
        
        let buttonClass = cn(
          "w-full h-14 rounded-md border-2 font-medium transition-all duration-200",
          "flex items-center justify-center",
          {
            // If the word is part of a solved group, apply the corresponding color
            [groupColors[groupIndex]]: solved,
            
            // If selected but not solved, apply a selected style
            "bg-primary/20 border-primary text-foreground hover:bg-primary/30": isSelected && !solved,
            
            // Default unselected state
            "bg-card border-input text-foreground hover:bg-accent hover:text-accent-foreground": !isSelected && !solved,
            
            // Disabled style
            "opacity-50 cursor-not-allowed": disabled && !solved
          }
        );
        
        return (
          <button
            key={index}
            className={buttonClass}
            onClick={() => !disabled && !solved && onSelectWord(word)}
            disabled={disabled || solved}
          >
            {word}
          </button>
        );
      })}
    </div>
  );
}