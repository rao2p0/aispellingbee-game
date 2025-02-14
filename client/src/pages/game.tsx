import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import HexGrid from "@/components/game/hex-grid";
import WordInput from "@/components/game/word-input";
import ScoreDisplay from "@/components/game/score-display";
import type { Puzzle } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function Game() {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState("");
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
    onSuccess: (data) => {
      if (data.valid) {
        toast({
          title: "Correct!",
          description: "You found a valid word!",
          variant: "default",
        });
      } else {
        toast({
          title: "Invalid word",
          description: "Try again!",
          variant: "destructive",
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
            <h1 className="text-3xl font-bold text-center text-secondary mb-8">
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
            <ScoreDisplay score={0} totalPossible={puzzle.points} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}