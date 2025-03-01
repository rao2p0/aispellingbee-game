
import { Progress } from "@/components/ui/progress";
import { getCurrentRank, getNextRank, RANKS } from "@/lib/ranks";
import { motion } from "framer-motion";
import RanksInfoDialog from "./ranks-info-dialog";

interface RankDisplayProps {
  score: number;
  maxScore: number;
}

export default function RankDisplay({ score, maxScore }: RankDisplayProps) {
  console.log('RankDisplay props:', { score, maxScore });
  const currentRank = getCurrentRank(score, maxScore);
  const nextRank = getNextRank(score, maxScore);
  const percentage = (score / maxScore) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-foreground font-semibold dark:text-white">Current Rank: {currentRank.title}</span>
        {nextRank && (
          <span className="text-muted-foreground dark:text-gray-300">
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
                className="absolute h-2 w-2 rounded-full bg-foreground/30"
                style={{ 
                  left: `${(i / (RANKS.length - 1)) * 100}%`, 
                  transform: 'translateX(-50%) translateY(0)' 
                }}
                title={`${rank.title} (${rank.threshold}%)`}
              />
            ))}
          </div>
        </div>
      </RanksInfoDialog>
    </div>
  );
}
