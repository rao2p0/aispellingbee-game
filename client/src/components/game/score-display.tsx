import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
  totalPossible: number;
  foundWords: number;
  totalWords: number;
}

export default function ScoreDisplay({ score, totalPossible, foundWords, totalWords }: ScoreDisplayProps) {
  const scorePercentage = (score / totalPossible) * 100;
  const wordsPercentage = (foundWords / totalWords) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-secondary">
          <span>Score: {score}</span>
          <span>Total Possible: {totalPossible}</span>
        </div>
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Progress value={scorePercentage} className="h-2" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-secondary">
          <span>Words Found: {foundWords}</span>
          <span>Total Words: {totalWords}</span>
        </div>
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Progress 
            value={wordsPercentage} 
            className="h-2 bg-secondary/20"
          />
        </motion.div>
      </div>
    </div>
  );
}