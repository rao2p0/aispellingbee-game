
import { Progress } from "@/components/ui/progress";
import { getCurrentRank, getNextRank, RANKS } from "@/lib/ranks";
import { motion } from "framer-motion";
import RanksInfoDialog from "./ranks-info-dialog";

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
      <RanksInfoDialog>
        <div className="cursor-pointer relative">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Progress value={percentage} className="h-2 bg-muted dark:bg-muted/20" />
          </motion.div>
          <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none">
            {RANKS.map((rank, i) => (
              <div
                key={i}
                className="absolute h-3 w-0.5 bg-foreground/30 -top-0.5"
                style={{ left: `${rank.threshold}%` }}
                title={`${rank.title} (${rank.threshold}%)`}
              />
            ))}
          </div>
        </div>
      </RanksInfoDialog>
    </div>
  );
}
