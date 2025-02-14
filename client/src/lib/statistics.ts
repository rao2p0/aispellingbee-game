interface GameStats {
  date: string;
  score: number;
  wordsFound: string[];
  totalPossibleWords: number;
  totalPossiblePoints: number;
}

const STATS_KEY = 'spell-bee-stats';

export function saveGameStats(stats: GameStats) {
  const existingStatsJson = localStorage.getItem(STATS_KEY);
  const existingStats: GameStats[] = existingStatsJson ? JSON.parse(existingStatsJson) : [];
  
  // Add new stats
  existingStats.push(stats);
  
  // Keep only last 30 days of stats
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const filteredStats = existingStats.filter(stat => 
    new Date(stat.date) >= thirtyDaysAgo
  );
  
  localStorage.setItem(STATS_KEY, JSON.stringify(filteredStats));
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
