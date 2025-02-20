
import { Progress } from "@/components/ui/progress";
import { getCurrentRank, getNextRank, RANKS } from "@/lib/ranks";
import { motion } from "framer-motion";

interface RankDisplayProps {
  score: number;
  maxScore: number;
}

export default function RankDisplay({ score, maxScore }: RankDisplayProps) {
  const currentRank = getCurrentRank(score, maxScore);
  const nextRank = getNextRank(score, maxScore);
  const percentage = (score / maxScore) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-foreground">Current Rank: {currentRank.title}</span>
        {nextRank && (
          <span className="text-muted-foreground">
            Next: {nextRank.title} ({nextRank.threshold}%)
          </span>
        )}
      </div>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Progress value={percentage} className="h-2 bg-muted dark:bg-muted/20" />
      </motion.div>
    </div>
  );
}
