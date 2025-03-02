
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Game {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  comingSoon?: boolean;
}

export default function GamesCarousel() {
  const games: Game[] = [
    {
      id: "wordle",
      name: "Wordle",
      logoUrl: "/wordle-logo.svg",
      description: "Guess the 5-letter word in 6 tries",
      comingSoon: true
    },
    {
      id: "anagrams",
      name: "Word Anagrams",
      logoUrl: "/wordle-logo.svg", // Using wordle logo as placeholder
      description: "Rearrange letters to form as many words as possible",
      comingSoon: true
    },
    {
      id: "word-connect",
      name: "Word Connect",
      logoUrl: "/wordle-logo.svg", // Using wordle logo as placeholder
      description: "Connect letters to form words across a grid",
      comingSoon: true
    },
    {
      id: "word-scramble",
      name: "Word Scramble",
      logoUrl: "/wordle-logo.svg", // Using wordle logo as placeholder
      description: "Unscramble jumbled letters to form words",
      comingSoon: true
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextGame = () => {
    setActiveIndex((prev) => (prev + 1) % games.length);
  };

  const prevGame = () => {
    setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">More Word Games</h2>
      
      <div className="relative pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden"
        >
          <div className="flex gap-4 justify-center">
            {games.map((game, index) => (
              <Card 
                key={game.id}
                className={`w-full max-w-[280px] transition-all duration-300 ${
                  index === activeIndex ? "opacity-100 scale-100" : "opacity-40 scale-95"
                }`}
              >
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
                    <img
                      src={game.logoUrl}
                      alt={`${game.name} logo`}
                      className="w-full h-full object-contain"
                    />
                    {game.comingSoon && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                        <span className="text-white font-medium text-sm">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{game.name}</h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {game.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
        
        {games.length > 1 && (
          <>
            <button
              onClick={prevGame}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/80 rounded-full shadow-md"
              aria-label="Previous game"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextGame}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-background/80 rounded-full shadow-md"
              aria-label="Next game"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
