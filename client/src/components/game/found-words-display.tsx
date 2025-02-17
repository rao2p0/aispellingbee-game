
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface FoundWordsDisplayProps {
  words: string[];
}

export default function FoundWordsDisplay({ words }: FoundWordsDisplayProps) {
  const sortedWords = [...words].sort((a, b) => a.length - b.length || a.localeCompare(b));
  
  return (
    <div className="bg-card rounded-lg p-4">
      <h3 className="text-sm font-medium mb-2">Found Words ({words.length})</h3>
      <ScrollArea className="h-[120px]">
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence>
            {sortedWords.map((word) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-sm px-2 py-1 rounded bg-muted/50"
              >
                {word.toUpperCase()}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
