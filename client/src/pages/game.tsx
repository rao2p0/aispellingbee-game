import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import HexGrid from "@/components/game/hex-grid";
import WordInput from "@/components/game/word-input";
import ScoreDisplay from "@/components/game/score-display";
import CelebrationPopup from "@/components/game/celebration-popup";
import { saveGameStats, getTodayGameStats, resetTodayGameStats } from "@/lib/statistics";
import type { Puzzle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

export default function Game() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);

  const handleRestart = () => {
    resetTodayGameStats();
    setScore(0);
    setFoundWords([]);
    setCurrentWord("");
    toast({
      title: "Game Reset",
      description: "Your progress has been reset. Good luck!",
    });
  };
  const [celebration, setCelebration] = useState<{ word: string; points: number; } | null>(null);
  const [isError, setIsError] = useState(false);
  const [alreadyFound, setAlreadyFound] = useState(false);

  // Get puzzle data
  const { data: puzzle, isLoading } = useQuery<Puzzle>({
    queryKey: ["/api/puzzle"],
  });

  // On component mount, restore today's progress if it exists
  useEffect(() => {
    const savedStats = getTodayGameStats();
    if (savedStats) {
      setScore(savedStats.score);
      setFoundWords(savedStats.wordsFound);
    } else {
      // Reset score and found words if no saved progress for today
      setScore(0);
      setFoundWords([]);
    }
  }, []);

  // Save stats whenever score or foundWords changes
  useEffect(() => {
    if (puzzle && score > 0) {  // Only save if there's a score to save
      saveGameStats({
        date: new Date().toISOString(),
        score,
        wordsFound: foundWords,
        totalPossibleWords: puzzle.validWords.length,
        totalPossiblePoints: puzzle.points,
      });
    }
  }, [score, foundWords, puzzle]);

  // Clear celebration after animation
  useEffect(() => {
    if (celebration) {
      const timer = setTimeout(() => {
        setCelebration(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [celebration]);

  // Clear error state after animation
  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
        setCurrentWord("");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  // Clear already found message
  useEffect(() => {
    if (alreadyFound) {
      const timer = setTimeout(() => {
        setAlreadyFound(false);
        setCurrentWord("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [alreadyFound]);

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

  const newGameMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/puzzle/new");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzle"] });
      handleRestart();
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
            <button
              onClick={handleRestart}
              className="w-full mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              Restart Game
            </button>
            <button
              onClick={() => newGameMutation.mutate()}
              className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              New Game
            </button>
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