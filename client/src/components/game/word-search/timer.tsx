import { ClockIcon } from "lucide-react";

interface WordSearchTimerProps {
  time: string;
}

export default function WordSearchTimer({ time }: WordSearchTimerProps) {
  return (
    <div className="flex items-center rounded-md bg-primary/10 px-3 py-1.5 text-primary font-medium">
      <ClockIcon className="w-4 h-4 mr-2" />
      <span>{time}</span>
    </div>
  );
}