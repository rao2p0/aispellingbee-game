import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import HexGrid from "@/components/game/hex-grid";
import WordInput from "@/components/game/word-input";
import ScoreDisplay from "@/components/game/score-display";
import CelebrationPopup from "@/components/game/celebration-popup";
import { saveGameStats } from "@/lib/statistics";
import type { Puzzle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

//This function needs to be implemented or imported from another module
function getTodayGameStats(): { score: number; wordsFound: string[] } | null {
  const savedStats = localStorage.getItem('todayGameStats');
  if(savedStats){
    return JSON.parse(savedStats);
  }
  return null;
}


export default function Game() {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [celebration, setCelebration] = useState<{ word: string; points: number; } | null>(null);
  const [isError, setIsError] = useState(false);
  const [alreadyFound, setAlreadyFound] = useState(false);

  // Get puzzle data
  const { data: puzzle, isLoading } = useQuery<Puzzle>({
    queryKey: ["/api/puzzle"],
  });

  // Restore game state from localStorage when component mounts
  useEffect(() => {
    const todayStats = getTodayGameStats();
    if (todayStats) {
      setScore(todayStats.score);
      setFoundWords(todayStats.wordsFound);
    }
  }, []);

  // Clear celebration after 2 seconds
  useEffect(() => {
    if (celebration) {
      const timer = setTimeout(() => {
        setCelebration(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [celebration]);

  // Clear error state and word after showing error animation
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
        setCurrentWord("");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  // Clear already found message and word
  useEffect(() => {
    if (alreadyFound) {
      const timer = setTimeout(() => {
        setAlreadyFound(false);
        setCurrentWord("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alreadyFound]);

  // Save stats whenever score or foundWords changes
  useEffect(() => {
    if (puzzle && foundWords.length > 0) {
      saveGameStats({
        date: new Date().toISOString(),
        score,
        wordsFound: foundWords,
        totalPossibleWords: puzzle.validWords.length,
        totalPossiblePoints: puzzle.points,
      });
    }
  }, [foundWords, score, puzzle]);

  const validateMutation = useMutation({
    mutationFn: async (word: string) => {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      return res.json();
    },
    onSuccess: (data, word) => {
      if (foundWords.includes(word)) {
        setAlreadyFound(true);
      } else if (data.valid) {
        const points = Math.max(1, word.length - 3);
        setScore(prev => prev + points);
        setFoundWords(prev => [...prev, word]);
        setCelebration({ word, points });
        setCurrentWord("");
      } else {
        setIsError(true);
      }
    },
  });

  const handleLetterClick = (letter: string) => {
    if (!isError && !alreadyFound) {
      setCurrentWord((prev) => prev + letter.toLowerCase());
    }
  };

  if (isLoading || !puzzle) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6 space-y-6">
            <HexGrid
              letters={puzzle.letters}
              centerLetter={puzzle.centerLetter}
              onLetterClick={handleLetterClick}
            />
            <WordInput
              value={currentWord}
              onChange={setCurrentWord}
              onSubmit={(word) => validateMutation.mutate(word)}
              isSubmitting={validateMutation.isPending}
              isError={isError}
              alreadyFound={alreadyFound}
            />
            <ScoreDisplay 
              score={score} 
              totalPossible={puzzle.points}
              foundWords={foundWords.length}
              totalWords={puzzle.validWords.length}
            />
          </CardContent>
        </Card>
      </motion.div>

      <CelebrationPopup
        word={celebration?.word ?? ""}
        points={celebration?.points ?? 0}
        isVisible={celebration !== null}
        onAnimationComplete={() => setCelebration(null)}
      />
    </div>
  );
}