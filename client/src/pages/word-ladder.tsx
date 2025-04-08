import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Trophy } from 'lucide-react';
import { wordLadderApi, type Difficulty, type WordLadderPuzzle } from '@/lib/wordLadderApi';
import WordInput from '@/components/game/word-ladder/word-input';
import WordPath from '@/components/game/word-ladder/word-path';
import DifficultySelector from '@/components/game/word-ladder/difficulty-selector';
import HintSystem from '@/components/game/word-ladder/hint-system';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/game/LoadingSpinner';
import GameLayout from '@/components/global/game-layout';

export default function WordLadder() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [words, setWords] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentPuzzleId, setCurrentPuzzleId] = useState<number | null>(null);
  
  // Get puzzle data
  const { data: puzzle, isLoading, refetch } = useQuery({
    queryKey: ['word-ladder', difficulty],
    queryFn: () => wordLadderApi.getRandomPuzzle(difficulty),
    staleTime: Infinity, // Don't refetch automatically
  });
  
  // Reset game when difficulty changes
  useEffect(() => {
    setWords([]);
    setHintsUsed(0);
    setError(null);
    setGameComplete(false);
  }, [difficulty]);
  
  // Update puzzle ID when new puzzle is loaded
  useEffect(() => {
    if (puzzle) {
      setCurrentPuzzleId(puzzle.id);
    }
  }, [puzzle]);
  
  // Handle word submission
  const handleSubmitWord = async (word: string) => {
    if (!puzzle || gameComplete) return;
    
    setIsValidating(true);
    setError(null);
    
    try {
      // Get the previous word - either the last word in the path or the start word
      const previousWord = words.length > 0 ? words[words.length - 1] : puzzle.startWord;
      
      // Validate the word
      const validation = await wordLadderApi.validateWord(previousWord, word);
      
      if (validation.valid) {
        // Add the word to the path
        const newWords = [...words, word];
        setWords(newWords);
        
        // Check if the puzzle is complete
        if (word.toLowerCase() === puzzle.targetWord.toLowerCase()) {
          setGameComplete(true);
        }
      } else {
        setError(validation.reason || 'Invalid word. Try again.');
      }
    } catch (err) {
      console.error('Error validating word:', err);
      setError('An error occurred while validating your word. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };
  
  // Handle starting a new game
  const handleNewGame = () => {
    setWords([]);
    setHintsUsed(0);
    setError(null);
    setGameComplete(false);
    refetch();
  };
  
  // Handle using a hint
  const handleUseHint = () => {
    setHintsUsed(prev => prev + 1);
  };
  
  // Calculate current score based on steps taken and hints used
  const calculateScore = () => {
    if (!puzzle || !gameComplete) return null;
    
    const minSteps = puzzle.minSteps || 5;
    const actualSteps = words.length;
    const hintPenalty = hintsUsed * 2;
    
    // Base score calculation
    let score = 100;
    
    // Deduct points for extra steps beyond minimum
    if (actualSteps > minSteps) {
      score -= (actualSteps - minSteps) * 5;
    }
    
    // Deduct points for hints used
    score -= hintPenalty;
    
    // Ensure score doesn't go below zero
    return Math.max(0, score);
  };
  
  if (isLoading) {
    return (
      <GameLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </GameLayout>
    );
  }
  
  return (
    <GameLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Word Ladder</CardTitle>
              <CardDescription>
                Change one letter at a time to transform the start word into the target word.
                Each step must be a valid English word.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {puzzle && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <Card className="bg-primary/5 p-4 text-center">
                        <h3 className="text-sm font-medium mb-1">Start Word</h3>
                        <div className="text-2xl font-bold">{puzzle.startWord.toUpperCase()}</div>
                      </Card>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-xl font-semibold">→</div>
                    </div>
                    <div className="flex-1">
                      <Card className="bg-primary/5 p-4 text-center">
                        <h3 className="text-sm font-medium mb-1">Target Word</h3>
                        <div className="text-2xl font-bold">{puzzle.targetWord.toUpperCase()}</div>
                      </Card>
                    </div>
                  </div>
                  
                  {gameComplete ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <Alert className="bg-green-100 dark:bg-green-900 mb-4">
                        <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                          You completed the ladder in {words.length} steps!
                          {puzzle.minSteps && (
                            <span> The minimum possible is {puzzle.minSteps} steps.</span>
                          )}
                          {calculateScore() !== null && (
                            <div className="text-lg font-semibold mt-2">
                              Your score: {calculateScore()} points
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                      
                      <Button onClick={handleNewGame} className="mt-2">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Play Again
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <WordInput 
                        onSubmit={handleSubmitWord}
                        isValidating={isValidating}
                        error={error}
                        placeholder={`Enter a valid ${puzzle.startWord.length}-letter word`}
                        wordLength={puzzle.startWord.length}
                        previousWord={words.length > 0 ? words[words.length - 1] : puzzle.startWord}
                      />
                      
                      <HintSystem 
                        currentWord={words.length > 0 ? words[words.length - 1] : puzzle.startWord}
                        hintsUsed={hintsUsed}
                        onUseHint={handleUseHint}
                        puzzleHint={puzzle.hint}
                      />
                    </>
                  )}
                  
                  {words.length > 0 && (
                    <WordPath 
                      words={words}
                      startWord={puzzle.startWord}
                      targetWord={puzzle.targetWord}
                    />
                  )}
                </div>
              )}
              
              {!puzzle && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load puzzle. Please try refreshing the page.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <DifficultySelector 
                  difficulty={difficulty}
                  onChangeDifficulty={setDifficulty}
                  disabled={isValidating}
                />
                
                <Button 
                  variant="outline" 
                  onClick={handleNewGame}
                  disabled={isValidating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Puzzle
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="text-sm text-center text-muted-foreground mb-8">
            <p>
              Try to transform the start word into the target word by changing one letter at a time.
              Each word in your chain must be a valid English word.
            </p>
            <p className="mt-1">
              Example: CAT → COT → DOT → DOG (changing one letter per step)
            </p>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}