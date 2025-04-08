import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface WordInputProps {
  onSubmit: (word: string) => void;
  isValidating: boolean;
  error?: string | null;
  placeholder?: string;
  wordLength: number;
  previousWord?: string;
}

export default function WordInput({
  onSubmit,
  isValidating,
  error,
  placeholder = 'Enter a word',
  wordLength,
  previousWord
}: WordInputProps) {
  const [word, setWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && word.length === wordLength && !isValidating) {
      onSubmit(word.toLowerCase());
      setWord('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters
    const newValue = e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase();
    // Limit to the same length as the previous word
    setWord(newValue.slice(0, wordLength));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={word}
          onChange={handleChange}
          placeholder={placeholder}
          className={`flex-1 ${error ? 'border-red-500' : ''}`}
          disabled={isValidating}
          maxLength={wordLength}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <Button 
          type="submit" 
          disabled={word.length !== wordLength || isValidating}
          className="bg-primary hover:bg-primary/90"
        >
          Submit
        </Button>
      </div>
      
      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
      
      {previousWord && (
        <div className="text-sm text-muted-foreground">
          <span>Previous word: <strong>{previousWord}</strong></span>
        </div>
      )}
    </form>
  );
}