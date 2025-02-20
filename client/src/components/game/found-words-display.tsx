
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FoundWordsDisplayProps {
  words: string[];
}

export default function FoundWordsDisplay({ words }: FoundWordsDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedWords = [...words].sort((a, b) => b.length - a.length || a.localeCompare(b));
  const latestWords = words.slice(-3);
  
  return (
    <div className="space-y-2">
      {/* Latest words - always visible */}
      <div className="flex gap-2 flex-wrap">
        {latestWords.map((word, index) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1.5 bg-primary/10 rounded-md text-sm font-medium"
          >
            {word.toUpperCase()}
          </motion.div>
        ))}
      </div>

      {/* Full list with expand/collapse */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>All Words ({words.length})</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ScrollArea className="h-[200px]">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {sortedWords.map((word) => (
                    <div
                      key={word}
                      className="text-sm px-2 py-1 rounded bg-muted/30"
                    >
                      {word.toUpperCase()}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
