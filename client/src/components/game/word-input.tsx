import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (word: string) => void;
  isSubmitting: boolean;
  isError?: boolean;
  alreadyFound?: boolean;
}

export default function WordInput({ 
  value, 
  onChange, 
  onSubmit, 
  isSubmitting, 
  isError,
  alreadyFound 
}: WordInputProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      if (e.key === "Enter" && value.length >= 4) {
        e.preventDefault(); // Prevent the event from bubbling up
        onSubmit(value);
      } else if (e.key === "Backspace") {
        e.preventDefault(); // Prevent the event from bubbling up
        onChange(value.slice(0, -1));
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault(); // Prevent the event from bubbling up
        onChange(value + e.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [value, onSubmit, onChange, isSubmitting]);

  return (
    <div className="flex justify-center items-center h-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={`word-${value}-${isError}-${alreadyFound}`}
          animate={isError ? {
            x: [-10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
          } : alreadyFound ? {
            scale: [1, 1.1, 1],
            transition: { duration: 0.4 }
          } : undefined}
          className={`text-2xl font-medium tracking-wider ${
            isError ? "text-destructive" : 
            alreadyFound ? "text-muted-foreground" : 
            "text-foreground"
          }`}
        >
          {value}
          {!value && (
            <span className="inline-block w-[2px] h-6 bg-foreground animate-pulse" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}