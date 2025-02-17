import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HexGridProps {
  letters: string[];
  centerLetter: string;
  onLetterClick: (letter: string) => void;
}

export default function HexGrid({ letters, centerLetter, onLetterClick }: HexGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderHexCell = (letter: string, index: number, isCenter: boolean = false) => (
    <button
      key={`${letter}-${index}`}
      onClick={() => onLetterClick(letter)}
      className={cn(
        "hex-cell",
        "w-12 h-12 md:w-16 md:h-16",
        "flex items-center justify-center",
        "text-lg md:text-2xl font-bold",
        "rounded-full transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        isCenter ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80",
        !mounted && "opacity-0",
        mounted && "opacity-100 transform scale-100"
      )}
    >
      {letter.toUpperCase()}
    </button>
  );

  const outerLetters = letters.filter(l => l !== centerLetter);

  return (
    <div className="relative w-full max-w-[300px] md:max-w-[400px] mx-auto aspect-square">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 place-items-center">
        {renderHexCell(outerLetters[0], 0)}
        {renderHexCell(outerLetters[1], 1)}
        {renderHexCell(outerLetters[2], 2)}
        {renderHexCell(outerLetters[3], 3)}
        {renderHexCell(centerLetter, 4, true)}
        {renderHexCell(outerLetters[4], 5)}
        {renderHexCell(outerLetters[5], 6)}
      </div>
    </div>
  );
}