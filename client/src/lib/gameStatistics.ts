// Advanced statistics module for Word Games application
// Supports statistics tracking across multiple game types

// Common statistics interface for all games
export interface GameStats {
  id: string;
  date: string;
  score: number;
  wordsFound: string[];
  totalPossibleWords: number;
  totalPossiblePoints: number;
  gameType?: GameType; // Adding game type to differentiate between games
}

// Game types in our application
export type GameType = 'spellbee' | 'wordle' | 'wordsearch' | 'connections' | 'hangman' | 'wordladder';

// Keys for storing game-specific stats
const SPELL_BEE_STATS_KEY = 'spell-bee-stats';
const WORDLE_STATS_KEY = 'wordle-stats';
const WORD_SEARCH_STATS_KEY = 'word-search-stats';
const CONNECTIONS_STATS_KEY = 'connections-stats';
const HANGMAN_STATS_KEY = 'hangman-stats';
const WORD_LADDER_STATS_KEY = 'word-ladder-stats';

// Game-specific titles for display
export const GAME_TITLES: Record<GameType, string> = {
  spellbee: 'Spell Bee',
  wordle: 'Wordle',
  wordsearch: 'Word Search',
  connections: 'Connections',
  hangman: 'Hangman',
  wordladder: 'Word Ladder'
};

// Helper function to get date string without time
function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get appropriate storage key for game type
function getStorageKeyForGame(gameType: GameType = 'spellbee'): string {
  switch (gameType) {
    case 'wordle':
      return WORDLE_STATS_KEY;
    case 'wordsearch':
      return WORD_SEARCH_STATS_KEY;
    case 'connections':
      return CONNECTIONS_STATS_KEY;
    case 'hangman':
      return HANGMAN_STATS_KEY;
    case 'wordladder':
      return WORD_LADDER_STATS_KEY;
    case 'spellbee':
    default:
      return SPELL_BEE_STATS_KEY;
  }
}

// Get today's game stats if it exists for a specific game
export function getTodayGameStats(gameType: GameType = 'spellbee'): GameStats | undefined {
  const stats = getGameStats(gameType);
  const today = getDateString(new Date());
  return stats.find(stat => getDateString(new Date(stat.date)) === today);
}

// Save stats for the current game session
export function saveGameStats(stats: Omit<GameStats, 'id'>) {
  const gameType = stats.gameType || 'spellbee';
  const storageKey = getStorageKeyForGame(gameType);
  const existingStats = getGameStats(gameType);

  // Remove any existing entry for today's game
  const today = getDateString(new Date());
  const filteredStats = existingStats.filter(stat => 
    getDateString(new Date(stat.date)) !== today
  );

  // Add new stats with unique ID
  const newStats = {
    ...stats,
    id: new Date().toISOString(),
  };

  filteredStats.push(newStats);

  // Keep only last 30 days of stats
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const finalStats = filteredStats.filter(stat => 
    new Date(stat.date) >= thirtyDaysAgo
  );

  localStorage.setItem(storageKey, JSON.stringify(finalStats));
}

// Get all stats for a specific game type
export function getGameStats(gameType: GameType = 'spellbee'): GameStats[] {
  const storageKey = getStorageKeyForGame(gameType);
  const statsJson = localStorage.getItem(storageKey);
  return statsJson ? JSON.parse(statsJson) : [];
}

// Get all stats across all games
export function getAllGameStats(): GameStats[] {
  const allGameTypes: GameType[] = ['spellbee', 'wordle', 'wordsearch', 'connections', 'hangman', 'wordladder'];
  
  return allGameTypes.flatMap(gameType => {
    const stats = getGameStats(gameType);
    // Make sure each stat has the game type set
    return stats.map(stat => ({
      ...stat,
      gameType: gameType
    }));
  });
}

// Get the best score for a specific game
export function getBestScore(gameType: GameType = 'spellbee'): number {
  const stats = getGameStats(gameType);
  if (stats.length === 0) return 0;
  return Math.max(...stats.map(s => s.score));
}

// Get the average score for a specific game
export function getAverageScore(gameType: GameType = 'spellbee'): number {
  const stats = getGameStats(gameType);
  if (stats.length === 0) return 0;
  const sum = stats.reduce((acc, curr) => acc + curr.score, 0);
  return Math.round(sum / stats.length);
}

// Get total words found for a specific game
export function getTotalWordsFound(gameType: GameType = 'spellbee'): number {
  const stats = getGameStats(gameType);
  if (stats.length === 0) return 0;
  return stats.reduce((acc, curr) => acc + curr.wordsFound.length, 0);
}

// Get total words found across all games
export function getTotalWordsFoundAllGames(): number {
  const allStats = getAllGameStats();
  if (allStats.length === 0) return 0;
  return allStats.reduce((acc, curr) => acc + curr.wordsFound.length, 0);
}

// Reset today's game stats for a specific game
export function resetTodayGameStats(gameType: GameType = 'spellbee') {
  const storageKey = getStorageKeyForGame(gameType);
  const stats = getGameStats(gameType);
  const today = getDateString(new Date());
  const filteredStats = stats.filter(stat => 
    getDateString(new Date(stat.date)) !== today
  );
  localStorage.setItem(storageKey, JSON.stringify(filteredStats));
}

// Get word length distribution for a specific game
export function getWordLengthDistribution(gameType: GameType = 'spellbee'): { length: number; count: number }[] {
  const stats = getGameStats(gameType);
  if (stats.length === 0) return [];

  const distribution = new Map<number, number>();

  stats.forEach(game => {
    game.wordsFound.forEach(word => {
      const length = word.length;
      distribution.set(length, (distribution.get(length) || 0) + 1);
    });
  });

  return Array.from(distribution.entries())
    .map(([length, count]) => ({ length, count }))
    .sort((a, b) => a.length - b.length);
}

// Get word length distribution across all games
export function getWordLengthDistributionAllGames(): { length: number; count: number }[] {
  const allStats = getAllGameStats();
  if (allStats.length === 0) return [];

  const distribution = new Map<number, number>();

  allStats.forEach(game => {
    game.wordsFound.forEach(word => {
      const length = word.length;
      distribution.set(length, (distribution.get(length) || 0) + 1);
    });
  });

  return Array.from(distribution.entries())
    .map(([length, count]) => ({ length, count }))
    .sort((a, b) => a.length - b.length);
}

// Get games played count for each game type
export function getGamesPlayedByType(): { gameType: GameType; count: number; title: string }[] {
  const gameTypes: GameType[] = ['spellbee', 'wordle', 'wordsearch', 'connections', 'hangman', 'wordladder'];
  
  return gameTypes.map(gameType => {
    const stats = getGameStats(gameType);
    return {
      gameType,
      count: stats.length,
      title: GAME_TITLES[gameType]
    };
  }).sort((a, b) => b.count - a.count); // Sort by count desc
}