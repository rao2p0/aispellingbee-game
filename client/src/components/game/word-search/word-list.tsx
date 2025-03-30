import { useEffect, useState } from "react";
import type { WordPosition } from "@/pages/word-search";

interface WordListProps {
  wordPositions: WordPosition[];
  foundWords: string[];
}

export default function WordList({ wordPositions, foundWords }: WordListProps) {
  // Get sorted list of words
  const words = wordPositions.map(wp => wp.word);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Words to Find</h2>
      <div className="grid grid-cols-2 gap-2">
        {words.map((word) => {
          const found = foundWords.includes(word);
          return (
            <div
              key={word}
              className={`px-3 py-2 rounded-md text-center font-medium transition-colors ${
                found
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 line-through"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              {word}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {foundWords.length}/{words.length} words found
      </div>
    </div>
  );
}