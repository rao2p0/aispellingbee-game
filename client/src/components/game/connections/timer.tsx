import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
}

export default function Timer({ isRunning, onTimeUpdate }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newTime = prev + 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate]);

  // Reset timer when game state changes
  useEffect(() => {
    if (!isRunning) {
      // Don't reset the timer when it's paused
      return;
    }
    
    // Reset when game starts
    setSeconds(0);
    // Using setTimeout to avoid the setState-during-render warning
    setTimeout(() => {
      if (onTimeUpdate) onTimeUpdate(0);
    }, 0);
  }, [isRunning, onTimeUpdate]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center px-2 py-1 rounded-md bg-primary/10 text-sm font-medium">
      <Clock className="w-4 h-4 mr-1 text-primary" />
      <span>{formatTime()}</span>
    </div>
  );
}