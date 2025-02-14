import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (word: string) => void;
  isSubmitting: boolean;
  isError?: boolean;
}

export default function WordInput({ value, onChange, onSubmit, isSubmitting, isError }: WordInputProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      if (e.key === "Enter" && value.length >= 4) {
        onSubmit(value);
      } else if (e.key === "Backspace") {
        onChange(value.slice(0, -1));
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
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
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-2xl font-medium tracking-wider ${
            isError ? "text-destructive" : "text-foreground"
          }`}
        >
          {value || (
            <span className="inline-block w-[2px] h-6 bg-foreground animate-pulse" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}