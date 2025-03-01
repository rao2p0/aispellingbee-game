import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import HexGrid from "@/components/game/hex-grid";
import WordInput from "@/components/game/word-input";
import ScoreDisplay from "@/components/game/score-display";
import RankDisplay from "@/components/game/rank-display";
import CelebrationPopup from "@/components/game/celebration-popup";
import WordListDialog from "@/components/game/word-list-dialog";
import FoundWordsDisplay from "@/components/game/found-words-display";
import { saveGameStats, getTodayGameStats, resetTodayGameStats } from "@/lib/statistics";
import type { Puzzle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import HowToPlayDialog from "@/components/game/how-to-play-dialog"; // Import the new component


export default function Game() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [celebration, setCelebration] = useState<{ word: string; points: number; } | null>(null);
  const [isError, setIsError] = useState(false);
  const [alreadyFound, setAlreadyFound] = useState(false);
  const [isEasyMode, setIsEasyMode] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false); // Add state for HowToPlayDialog

  const { data: puzzle, isLoading: isPuzzleLoading } = useQuery<Puzzle>({
    queryKey: ["/api/puzzle"],
    staleTime: 0,
    gcTime: 0,
  });

  const newGameMutation = useMutation({
    mutationFn: async (isEasyMode: boolean) => {
      const res = await apiRequest("POST", "/api/puzzle/new", { isEasyMode });
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
        const basePoints = word.length === 4 ? 1 : word.length;
        const uniqueLetters = new Set(word.split('')).size;
        const bonusPoints = uniqueLetters === 7 ? 7 : 0;
        const totalPoints = basePoints + bonusPoints;
        setScore(prev => prev + totalPoints);
        setFoundWords(prev => [...prev, word]);
        setCelebration({ word, points: totalPoints, hasBonus: uniqueLetters === 7 });
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
    // Show How to Play dialog for new users
    const hasSeenInstructions = localStorage.getItem('hasSeenInstructions');
    if (!hasSeenInstructions) {
      // Delay showing the dialog slightly to ensure the game has loaded
      const timer = setTimeout(() => {
        setShowHowToPlay(true);
        localStorage.setItem('hasSeenInstructions', 'true');
      }, 1000);
      return () => clearTimeout(timer);
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
    await newGameMutation.mutateAsync(isEasyMode);
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

    try {
      const gameBoard = document.querySelector('.game-board') as HTMLElement;
      if (!gameBoard) return;

      const canvas = await html2canvas(gameBoard);
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );

      const filesArray = [
        new File([blob], 'spellbee-score.png', { type: 'image/png' })
      ];

      if (navigator.share && navigator.canShare({ files: filesArray })) {
        await navigator.share({
          title: 'Spell Bee Score',
          text: shareText,
          files: filesArray
        });
        toast({
          title: "Shared successfully!",
          description: "Your score and screenshot have been shared.",
        });
      } else {
        copyToClipboard(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Image sharing not supported on your device.",
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        copyToClipboard(shareText);
      }
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
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6 pt-[calc(4rem+env(safe-area-inset-top))] pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-white shadow-lg game-board">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-between gap-4">
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isEasyMode 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {isEasyMode ? '🌟 Easy Mode' : '💪 Challenge Mode'}
              </div>
              <button
                onClick={() => {
                  if (!currentWord.length) {
                    const newMode = !isEasyMode;
                    setIsEasyMode(newMode);
                    newGameMutation.mutate(newMode);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentWord.length ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  !isEasyMode 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                }`}
                disabled={currentWord.length > 0}
              >
                Switch to {isEasyMode ? 'Challenge Mode' : 'Easy Mode'}
              </button>
              <HowToPlayDialog open={showHowToPlay} onOpenChange={setShowHowToPlay} /> {/* Add HowToPlayDialog button */}
            </div>
            <div className="space-y-6">
              <RankDisplay 
                score={score}
                maxScore={puzzle.points}
              />
              <FoundWordsDisplay words={foundWords} />
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
              <div className="space-y-4">
                <ScoreDisplay 
                  score={score} 
                  totalPossible={puzzle.points}
                  foundWords={foundWords.length}
                  totalWords={puzzle.validWords.length}
                />
              </div>
              <div className="space-y-4">
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
                <WordListDialog 
                  foundWords={foundWords}
                  allWords={puzzle.validWords}
                  totalPoints={puzzle.points}
                  userPoints={score}
                />
                <button
                  onClick={handleNewGame}
                  disabled={newGameMutation.isPending}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
              </div>
            </div>
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