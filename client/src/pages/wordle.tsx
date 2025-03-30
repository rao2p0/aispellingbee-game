import { useState, useEffect, useCallback } from "react";
import Grid from "@/components/game/wordle/grid";
import Keyboard from "@/components/game/wordle/keyboard";
import HowToPlayDialog from "@/components/game/wordle/how-to-play-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

type KeyStatus = "correct" | "present" | "absent" | "unused";

export default function Wordle() {
  const { toast } = useToast();
  const [targetWord, setTargetWord] = useState<string>(""); // For testing, will be hidden in production
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [keyboardStatus, setKeyboardStatus] = useState<Record<string, KeyStatus>>({});
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [isLoading, setIsLoading] = useState(true);
  const [shake, setShake] = useState(false);
  
  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;

  // Function to fetch the daily word
  const fetchDailyWord = useCallback(async () => {
    try {
      setIsLoading(true);
      // In a real implementation, we wouldn't send the actual word to the client
      // Instead, we'd validate guesses on the server
      // For this demo, we'll handle it client-side
      const today = new Date().toISOString().split('T')[0];
      
      // For development, get the actual word
      // In production, this endpoint would only return a word ID or date
      const response = await fetch("/api/wordle");
      const data = await response.json();
      
      // This is only for development - in production, we would never expose the word
      // We'd validate guesses on the server instead
      const devResponse = await fetch("/api/wordle/daily-word-dev");
      if (devResponse.ok) {
        const devData = await devResponse.json();
        setTargetWord(devData.word);
      } else {
        // Fallback for demo
        setTargetWord("REACT");
      }
      
      // Load saved game state if it exists for today
      const savedState = localStorage.getItem(`wordle_state_${today}`);
      if (savedState) {
        const { guesses: savedGuesses, status } = JSON.parse(savedState);
        setGuesses(savedGuesses);
        setGameStatus(status);
        
        // Rebuild keyboard status
        const newKeyboardStatus: Record<string, KeyStatus> = {};
        savedGuesses.forEach((guess: string) => {
          updateKeyboardForGuess(guess, newKeyboardStatus);
        });
        setKeyboardStatus(newKeyboardStatus);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching daily word:", error);
      setTargetWord("REACT"); // Fallback word for demo purposes
      setIsLoading(false);
    }
  }, []);

  // Initialize the game
  useEffect(() => {
    fetchDailyWord();
  }, [fetchDailyWord]);

  // Save game state when it changes
  useEffect(() => {
    if (guesses.length > 0 || gameStatus !== "playing") {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`wordle_state_${today}`, JSON.stringify({
        guesses,
        status: gameStatus
      }));
    }
  }, [guesses, gameStatus]);
  
  // Add a shake animation to the CSS
  useEffect(() => {
    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0% { transform: translateX(0); }
        10% { transform: translateX(-5px); }
        20% { transform: translateX(5px); }
        30% { transform: translateX(-5px); }
        40% { transform: translateX(5px); }
        50% { transform: translateX(-5px); }
        60% { transform: translateX(5px); }
        70% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
        90% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
      }
      
      .animate-shake {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "playing") return;
      
      if (e.key === "Enter") {
        handleSubmitGuess();
      } else if (e.key === "Backspace") {
        handleDeleteLetter();
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + e.key.toUpperCase());
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, gameStatus]);

  // Handle keyboard button press
  const handleKeyPress = (key: string) => {
    if (gameStatus !== "playing") return;
    
    if (key === "ENTER") {
      handleSubmitGuess();
    } else if (key === "DELETE") {
      handleDeleteLetter();
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  // Delete the last letter of the current guess
  const handleDeleteLetter = () => {
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  // Update keyboard status based on a guess
  const updateKeyboardForGuess = (guess: string, statusMap: Record<string, KeyStatus> = {}) => {
    const newKeyboardStatus = { ...statusMap };
    const remainingTargetChars = targetWord.split("");
    
    // First pass: Mark correct letters
    guess.split("").forEach((letter: string, i: number) => {
      if (letter === targetWord[i]) {
        newKeyboardStatus[letter] = "correct";
        remainingTargetChars[i] = "#"; // Mark as used
      }
    });
    
    // Second pass: Mark present or absent letters
    guess.split("").forEach((letter: string, i: number) => {
      if (letter !== targetWord[i]) {
        const targetIndex = remainingTargetChars.indexOf(letter);
        if (targetIndex !== -1) {
          // Only update if the current status isn't already "correct"
          if (newKeyboardStatus[letter] !== "correct") {
            newKeyboardStatus[letter] = "present";
          }
          remainingTargetChars[targetIndex] = "#"; // Mark as used
        } else if (!newKeyboardStatus[letter]) {
          // Only mark as absent if not already marked
          newKeyboardStatus[letter] = "absent";
        }
      }
    });
    
    return newKeyboardStatus;
  };

  // Check if a word is valid using the API
  const isValidWord = async (word: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/wordle/validate", {
        method: "POST",
        body: JSON.stringify({ word }),
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error("Error validating word:", error);
      return true; // Fallback for demo
    }
  };

  // Submit the current guess
  const handleSubmitGuess = async () => {
    if (currentGuess.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast({
        title: "Not enough letters",
        description: "Word must be 5 letters long",
        variant: "destructive"
      });
      return;
    }
    
    // Validate the word
    const isValid = await isValidWord(currentGuess);
    if (!isValid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast({
        title: "Not in word list",
        description: "Please try another word",
        variant: "destructive"
      });
      return;
    }
    
    // Add the guess
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    
    // Update keyboard status
    setKeyboardStatus(prev => updateKeyboardForGuess(currentGuess, prev));
    
    // Check if the player won
    if (currentGuess === targetWord) {
      setGameStatus("won");
      toast({
        title: "Genius!",
        description: `You found the word in ${newGuesses.length} ${newGuesses.length === 1 ? 'try' : 'tries'}!`,
        variant: "default"
      });
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus("lost");
      toast({
        title: "Game Over",
        description: `The word was ${targetWord}`,
        variant: "destructive"
      });
    }
    
    // Reset current guess
    setCurrentGuess("");
  };

  return (
    <div className="container max-w-lg mx-auto px-4 pb-8">
      <div className="flex justify-between items-center mb-4 mt-6">
        <Link href="/">
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Spell Bee
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-center">Wordle</h1>
        <HowToPlayDialog />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className={`mb-8 ${shake ? 'animate-shake' : ''}`}>
            <Grid 
              guesses={guesses} 
              currentGuess={currentGuess} 
              targetWord={targetWord}
              maxGuesses={MAX_GUESSES}
            />
          </div>
          
          <Keyboard 
            onKeyPress={handleKeyPress} 
            keyboardStatus={keyboardStatus}
          />

          {gameStatus === "won" && (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold text-green-500">Congratulations!</h2>
              <p>You found the word in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!</p>
              <p className="mt-2 text-sm text-gray-500">Come back tomorrow for a new word!</p>
            </div>
          )}
          
          {gameStatus === "lost" && (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold text-red-500">Game Over</h2>
              <p>The word was <span className="font-bold">{targetWord}</span></p>
              <p className="mt-2 text-sm text-gray-500">Come back tomorrow for a new word!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}