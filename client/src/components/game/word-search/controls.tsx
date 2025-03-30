import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WordSearchControlsProps {
  difficulty: string;
  difficultyOptions: readonly string[];
  onChangeDifficulty: (difficulty: any) => void;
}

export default function WordSearchControls({
  difficulty,
  difficultyOptions,
  onChangeDifficulty
}: WordSearchControlsProps) {
  return (
    <div className="flex justify-center items-center my-4">
      <div className="inline-flex rounded-md shadow-sm">
        {difficultyOptions.map((option) => (
          <Button
            key={option}
            onClick={() => onChangeDifficulty(option)}
            variant="outline"
            size="sm"
            className={cn(
              "px-3 py-1 first:rounded-l-md first:border-r-0 last:rounded-r-md last:border-l-0 middle:rounded-none middle:border-x-0",
              difficulty === option
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "bg-background hover:bg-accent"
            )}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}