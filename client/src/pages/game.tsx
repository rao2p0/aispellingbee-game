import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import HexGrid from "@/components/game/hex-grid";
import WordInput from "@/components/game/word-input";
import ScoreDisplay from "@/components/game/score-display";
import CelebrationPopup from "@/components/game/celebration-popup";
import type { Puzzle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function Game() {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState(new Set<string>());
  const [celebration, setCelebration] = useState<{ word: string; points: number; } | null>(null);

  // Clear celebration after 2 seconds
  useEffect(() => {
    if (celebration) {
      const timer = setTimeout(() => {
        setCelebration(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [celebration]);

  const { data: puzzle, isLoading } = useQuery<Puzzle>({
    queryKey: ["/api/puzzle"],
  });

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
      if (data.valid && !foundWords.has(word)) {
        const points = Math.max(1, word.length - 3); // Simple scoring rule
        setScore(prev => prev + points);
        setFoundWords(new Set([...foundWords, word]));
        setCelebration({ word, points }); // Trigger celebration
        toast({
          title: "Correct!",
          description: `+${points} points! Keep going!`,
          variant: "default",
        });
      } else if (!data.valid) {
        toast({
          title: "Invalid word",
          description: "Try again!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Already found",
          description: "You've already found this word!",
          variant: "default",
        });
      }
      setCurrentWord("");
    },
  });

  const handleLetterClick = (letter: string) => {
    setCurrentWord((prev) => prev + letter.toLowerCase());
  };

  if (isLoading || !puzzle) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center text-foreground mb-8">
              Spell Bee
            </h1>
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
            />
            <ScoreDisplay 
              score={score} 
              totalPossible={puzzle.points}
              foundWords={foundWords.size}
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