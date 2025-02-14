import { Progress } from "@/components/ui/progress";

interface ScoreDisplayProps {
  score: number;
  totalPossible: number;
}

export default function ScoreDisplay({ score, totalPossible }: ScoreDisplayProps) {
  const percentage = (score / totalPossible) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-secondary">
        <span>Score: {score}</span>
        <span>Total Possible: {totalPossible}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
