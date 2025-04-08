import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface WordPathProps {
  words: string[];
  startWord: string;
  targetWord: string;
}

export default function WordPath({ words, startWord, targetWord }: WordPathProps) {
  // Include start and target words in the display
  const displayWords = [startWord, ...words.filter(w => w !== startWord && w !== targetWord)];
  
  // Only add the target word at the end if it's been reached
  if (words.includes(targetWord)) {
    displayWords.push(targetWord);
  }
  
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Your Path ({displayWords.length - 1} steps)</h3>
      <div className="space-y-2">
        {displayWords.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={`p-4 font-mono text-center text-lg font-bold
                  ${word === startWord ? 'bg-blue-100 dark:bg-blue-900' : ''}
                  ${word === targetWord ? 'bg-green-100 dark:bg-green-900' : ''}
                `}
              >
                {word.split('').map((letter, i) => {
                  // If not the first word, highlight the letter that changed
                  const prevWord = index > 0 ? displayWords[index - 1] : '';
                  const isChanged = prevWord && prevWord[i] !== letter;
                  
                  return (
                    <span 
                      key={i} 
                      className={`inline-block mx-0.5 ${isChanged ? 'text-primary font-extrabold underline' : ''}`}
                    >
                      {letter}
                    </span>
                  );
                })}
              </Card>
            </motion.div>
            
            {index < displayWords.length - 1 && (
              <div className="flex justify-center py-1">
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}