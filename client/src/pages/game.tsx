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
import { Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

export default function Game() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [celebration, setCelebration] = useState<{ word: string; points: number; } | null>(null);
  const [isError, setIsError] = useState(false);
  const [alreadyFound, setAlreadyFound] = useState(false);

  const { data: puzzle, isLoading: isPuzzleLoading } = useQuery<Puzzle>({
    queryKey: ["/api/puzzle"],
    staleTime: 0,
    gcTime: 0,
  });

  const newGameMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/puzzle/new");
      const data = await res.json();
      return data as Puzzle;
    },
    onMutate: () => {
      toast({
        title: "Generating New Puzzle",
        description: "Please wait while we create a new game...",
      });
    },
    onSuccess: () => {
      resetTodayGameStats();
      setScore(0);
      setFoundWords([]);
      setCurrentWord("");
      queryClient.resetQueries({ queryKey: ["/api/puzzle"] });

      toast({
        title: "New Game Started",
        description: "Good luck with the new puzzle!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate new puzzle. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateMutation = useMutation({
    mutationFn: async (word: string) => {
      if (!puzzle) throw new Error("No puzzle loaded");
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, puzzleId: puzzle.id }),
      });
      return res.json() as Promise<{ valid: boolean }>;
    },
    onSuccess: (data, word) => {
      if (foundWords.includes(word)) {
        setAlreadyFound(true);
        setTimeout(() => {
          setAlreadyFound(false);
          setCurrentWord("");
        }, 1500);
      } else if (data.valid) {
        const points = Math.max(1, word.length - 3);
        setScore(prev => prev + points);
        setFoundWords(prev => [...prev, word]);
        setCelebration({ word, points });
        setCurrentWord("");
        setTimeout(() => setCelebration(null), 2000);
      } else {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
          setCurrentWord("");
        }, 800);
      }
    },
  });

  useEffect(() => {
    const savedStats = getTodayGameStats();
    if (savedStats) {
      setScore(savedStats.score);
      setFoundWords(savedStats.wordsFound);
    }
  }, []);

  useEffect(() => {
    if (puzzle && score > 0) {
      saveGameStats({
        date: new Date().toISOString(),
        score,
        wordsFound: foundWords,
        totalPossibleWords: puzzle.validWords.length,
        totalPossiblePoints: puzzle.points,
      });
    }
  }, [score, foundWords, puzzle]);

  const handleNewGame = async () => {
    if (newGameMutation.isPending) return;
    await newGameMutation.mutateAsync();
  };

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

  const handleLetterClick = (letter: string) => {
    if (!isError && !alreadyFound) {
      setCurrentWord(prev => prev + letter.toLowerCase());
    }
  };

  const handleShare = async () => {
    const scorePercentage = Math.round((score / puzzle.points) * 100);
    const wordsPercentage = Math.round((foundWords.length / puzzle.validWords.length) * 100);
    const today = new Date().toLocaleDateString();

    const shareText = `🐝 Spell Bee ${today}\n\n` +
      `Score: ${score}/${puzzle.points} (${scorePercentage}%)\n` +
      `Words: ${foundWords.length}/${puzzle.validWords.length} (${wordsPercentage}%)\n\n` +
      `Play at: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Spell Bee Score',
          text: shareText,
        });
        toast({
          title: "Shared successfully!",
          description: "Your score has been shared.",
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "Share your score with friends.",
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    });
  };


  if (isPuzzleLoading || !puzzle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg">Loading puzzle...</p>
        </div>
      </div>
    );
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
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Reset Progress
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Score
              </button>
            </div>
            <button
              onClick={handleNewGame}
              disabled={newGameMutation.isPending}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {newGameMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </div>
              ) : (
                "New Game"
              )}
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