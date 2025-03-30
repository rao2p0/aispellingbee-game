import { motion } from "framer-motion";

type CellStatus = "correct" | "present" | "absent" | "empty" | "filled";

interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  maxGuesses: number;
}

export default function Grid({ guesses, currentGuess, targetWord, maxGuesses }: GridProps) {
  // Create a padded array of guesses to match maxGuesses
  const paddedGuesses = [...guesses];
  while (paddedGuesses.length < maxGuesses) {
    paddedGuesses.push("");
  }

  // Calculate statuses for a completed guess
  const getStatusesForGuess = (guess: string): CellStatus[] => {
    const statuses: CellStatus[] = Array(5).fill("absent");
    const targetChars = targetWord.split("");
    
    // First mark correct letters
    guess.split("").forEach((letter, i) => {
      if (letter === targetWord[i]) {
        statuses[i] = "correct";
        targetChars[i] = "#"; // Mark as used
      }
    });
    
    // Then mark present letters (but not already marked as correct)
    guess.split("").forEach((letter, i) => {
      if (statuses[i] !== "correct") {
        const targetIndex = targetChars.indexOf(letter);
        if (targetIndex !== -1) {
          statuses[i] = "present";
          targetChars[targetIndex] = "#"; // Mark as used
        }
      }
    });
    
    return statuses;
  };

  // Get color class based on status
  const getColorClass = (status: CellStatus) => {
    switch (status) {
      case "correct":
        return "bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500";
      case "present":
        return "bg-yellow-600 dark:bg-yellow-500 text-white border-yellow-600 dark:border-yellow-500";
      case "absent":
        return "bg-gray-500 dark:bg-gray-600 text-white border-gray-500 dark:border-gray-600";
      case "filled":
        return "bg-gray-200 dark:bg-gray-700 text-foreground border-gray-300 dark:border-gray-600";
      default:
        return "bg-transparent border-gray-300 dark:border-gray-600 text-foreground";
    }
  };

  return (
    <div className="grid grid-rows-6 gap-1.5 max-w-sm mx-auto mb-4">
      {paddedGuesses.map((guess, guessIndex) => {
        // For current row being typed
        const isCurrentRow = guessIndex === guesses.length;
        const rowLetters = isCurrentRow ? currentGuess.padEnd(5, " ").split("") : guess.padEnd(5, " ").split("");
        const isCompletedRow = guessIndex < guesses.length;
        const statuses = isCompletedRow ? getStatusesForGuess(guess) : Array(5).fill("empty");

        return (
          <div key={guessIndex} className="grid grid-cols-5 gap-1.5">
            {rowLetters.map((letter, letterIndex) => {
              const isFilled = isCurrentRow && letter.trim() !== "";
              const status = isCurrentRow ? (isFilled ? "filled" : "empty") : statuses[letterIndex];
              const delay = isCompletedRow ? letterIndex * 0.2 : 0;
              
              return (
                <motion.div
                  key={letterIndex}
                  initial={isCompletedRow ? { rotateX: 0 } : {}}
                  animate={isCompletedRow ? { rotateX: [0, 90, 0] } : {}}
                  transition={isCompletedRow ? { delay, duration: 0.5, times: [0, 0.5, 1] } : {}}
                  className={`flex items-center justify-center h-14 w-14 text-xl font-bold border-2 ${getColorClass(status)}`}
                >
                  {letter !== " " ? letter.toUpperCase() : ""}
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}