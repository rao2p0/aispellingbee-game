import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { wordLadderApi } from '@/lib/wordLadderApi';
import { Card, CardContent } from '@/components/ui/card';

interface HintSystemProps {
  currentWord: string;
  hintsUsed: number;
  onUseHint: () => void;
  puzzleHint?: string;
}

export default function HintSystem({ 
  currentWord, 
  hintsUsed,
  onUseHint,
  puzzleHint
}: HintSystemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getPossibleWords = async () => {
    if (!currentWord || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await wordLadderApi.getHints(currentWord);
      setHints(response.possibleNextWords);
      onUseHint();
    } catch (error) {
      console.error('Error fetching hints:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
          <span className="font-medium">Need a hint?</span>
          {hintsUsed > 0 && (
            <Badge variant="secondary" className="ml-2">
              Used: {hintsUsed}
            </Badge>
          )}
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={toggleExpanded}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {isExpanded && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 space-y-3">
            {puzzleHint && (
              <div>
                <div className="text-sm font-medium mb-1">Puzzle Hint:</div>
                <div className="text-sm text-muted-foreground">{puzzleHint}</div>
              </div>
            )}
            
            <div>
              <div className="text-sm font-medium mb-1">Word Suggestions:</div>
              {hints.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hints.map(hint => (
                    <Badge key={hint} variant="outline">
                      {hint}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {hintsUsed > 0 
                      ? 'Get more suggestions from the current word.' 
                      : 'Get suggestions for possible next words.'}
                  </span>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={getPossibleWords}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Get Hints'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}