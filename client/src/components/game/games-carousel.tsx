
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

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
      id: "game",
      name: "Spell Bee",
      logoUrl: "/images/games/bee-game.png",
      description: "Create words from a set of letters",
      comingSoon: false
    },
    {
      id: "wordle",
      name: "Wordle",
      logoUrl: "/images/games/wordle-icon.svg",
      description: "Guess the 5-letter word in 6 tries",
      comingSoon: false
    },
    {
      id: "word-search",
      name: "Word Search",
      logoUrl: "/images/games/wordsearch-icon.svg",
      description: "Find hidden words in a grid",
      comingSoon: false
    },
    {
      id: "connections",
      name: "Connections",
      logoUrl: "/images/games/connections-icon.svg", 
      description: "Group words by their connections",
      comingSoon: false
    },
    {
      id: "hangman",
      name: "Hangman",
      logoUrl: "/images/games/hangman-icon.svg", 
      description: "Guess the word letter by letter",
      comingSoon: false
    },
    {
      id: "word-ladder",
      name: "Word Ladder",
      logoUrl: "/images/games/wordladder-icon.svg", 
      description: "Transform words one letter at a time",
      comingSoon: false
    }
    // {
    //   id: "combinations",
    //   name: "Combinations",
    //   logoUrl: "/wordle-logo.svg",
    //   description: "Combine letters and create words",
    //   comingSoon: true
    // },
    // {
    //   id: "strands",
    //   name: "Strands",
    //   logoUrl: "/wordle-logo.svg",
    //   description: "Solve a 6x8 letter grid",
    //   comingSoon: true
    // },
    // {
    //   id: "connections",
    //   name: "Connections",
    //   logoUrl: "/wordle-logo.svg",
    //   description: "Group words by topic",
    //   comingSoon: true
    // },
    // {
    //   id: "phrazle",
    //   name: "Phrazle",
    //   logoUrl: "/wordle-logo.svg",
    //   description: "Guess the Phrase",
    //   comingSoon: true
    // },
    // {
    //   id: "dordle",
    //   name: "Dordle",
    //   logoUrl: "/wordle-logo.svg",
    //   description: "Solve 2 Wordles at once",
    //   comingSoon: true
    // }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Play Other Games</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <Card 
            key={game.id}
            className="overflow-hidden border shadow-sm transition-all hover:shadow-md"
          >
            <div className={`h-32 flex items-center justify-center ${getBackgroundColor(game.id)}`}>
              <div className="w-20 h-20 relative">
                <img
                  src={game.logoUrl}
                  alt={`${game.name} logo`}
                  className="w-full h-full object-contain"
                />
                {game.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                    <span className="text-white font-medium text-xs">Coming Soon</span>
                  </div>
                )}
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-center mb-1">{game.name}</h3>
              <p className="text-xs text-muted-foreground text-center mb-3">
                {game.description}
              </p>
              {game.comingSoon ? (
                <Button 
                  className="w-full rounded-full text-sm py-1 h-auto"
                  variant="outline"
                  disabled
                >
                  Coming Soon
                </Button>
              ) : (
                <Link href={`/${game.id}`}>
                  <Button 
                    className="w-full rounded-full text-sm py-1 h-auto"
                    variant="default"
                  >
                    Play
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper function to get unique background colors for each game card
function getBackgroundColor(gameId: string): string {
  const colorMap: Record<string, string> = {
    game: "bg-amber-50", // Spell Bee (yellow theme)
    wordle: "bg-emerald-50", // Wordle
    "word-search": "bg-indigo-50", // Word Search (purple/blue theme)
    wordsearch: "bg-indigo-50",
    connections: "bg-fuchsia-50", // Connections (purple theme)
    hangman: "bg-rose-50", // Hangman (red theme)
    "word-ladder": "bg-blue-50", // Word Ladder (blue theme)
    spellbee: "bg-amber-50",
    squares: "bg-white",
    combinations: "bg-amber-50",
    strands: "bg-blue-100",
    phrazle: "bg-green-100",
    dordle: "bg-amber-50",
    default: "bg-gray-100"
  };

  return colorMap[gameId] || colorMap.default;
}
