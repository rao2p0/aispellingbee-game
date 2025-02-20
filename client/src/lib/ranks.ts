
interface Rank {
  threshold: number;
  title: string;
}

export const RANKS: Rank[] = [
  { threshold: 100, title: "Queen Bee" },
  { threshold: 70, title: "Genius" },
  { threshold: 50, title: "Amazing" },
  { threshold: 40, title: "Great" },
  { threshold: 25, title: "Nice" },
  { threshold: 15, title: "Solid" },
  { threshold: 8, title: "Good" },
  { threshold: 5, title: "Moving Up" },
  { threshold: 2, title: "Good Start" },
  { threshold: 0, title: "Beginner" },
];

export function getCurrentRank(score: number, maxScore: number): Rank {
  const percentage = (score / maxScore) * 100;
  console.log(`Current percentage: ${percentage}%, Score: ${score}, MaxScore: ${maxScore}`);
  const rank = RANKS.find(rank => percentage >= rank.threshold) || RANKS[RANKS.length - 1];
  console.log(`Selected rank: ${rank.title} (threshold: ${rank.threshold}%)`);
  return rank;
}

export function getNextRank(score: number, maxScore: number): Rank | null {
  const percentage = (score / maxScore) * 100;
  return RANKS.find(rank => percentage < rank.threshold) || null;
}
