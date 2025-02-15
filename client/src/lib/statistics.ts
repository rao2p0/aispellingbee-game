import { z } from "zod";

interface GameStats {
  id: string;
  date: string;
  score: number;
  wordsFound: string[];
  totalPossibleWords: number;
  totalPossiblePoints: number;
}

const STATS_KEY = 'spell-bee-stats';

// Helper function to get date string without time
function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get today's game stats if it exists
export function getTodayGameStats(): GameStats | undefined {
  const stats = getGameStats();
  const today = getDateString(new Date());
  return stats.find(stat => getDateString(new Date(stat.date)) === today);
}

// Save stats for the current game session
export function saveGameStats(stats: Omit<GameStats, 'id'>) {
  const existingStats = getGameStats();

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

  localStorage.setItem(STATS_KEY, JSON.stringify(finalStats));
}

export function getGameStats(): GameStats[] {
  const statsJson = localStorage.getItem(STATS_KEY);
  return statsJson ? JSON.parse(statsJson) : [];
}

export function getBestScore(): number {
  const stats = getGameStats();
  if (stats.length === 0) return 0;
  return Math.max(...stats.map(s => s.score));
}

export function getAverageScore(): number {
  const stats = getGameStats();
  if (stats.length === 0) return 0;
  const sum = stats.reduce((acc, curr) => acc + curr.score, 0);
  return Math.round(sum / stats.length);
}

export function getTotalWordsFound(): number {
  const stats = getGameStats();
  if (stats.length === 0) return 0;
  return stats.reduce((acc, curr) => acc + curr.wordsFound.length, 0);
}

export function getWordLengthDistribution(): { length: number; count: number }[] {
  const stats = getGameStats();
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