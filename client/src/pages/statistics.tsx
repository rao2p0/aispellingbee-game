import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Trophy, Star, BookOpen } from "lucide-react";
import { getBestScore, getAverageScore, getTotalWordsFound, getWordLengthDistribution } from "@/lib/statistics";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatisticCard = ({ title, value, icon, description }: StatCard) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export default function Statistics() {
  const bestScore = getBestScore();
  const averageScore = getAverageScore();
  const totalWordsFound = getTotalWordsFound();
  const wordLengthData = getWordLengthDistribution();

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <h1 className="text-3xl font-bold">Statistics</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <StatisticCard
            title="Best Score"
            value={bestScore}
            icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          />
          <StatisticCard
            title="Total Words Found"
            value={totalWordsFound}
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          />
          <StatisticCard
            title="Average Score"
            value={averageScore}
            icon={<Star className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Word Length Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <BarChart
                width={800}
                height={300}
                data={wordLengthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="length" label={{ value: "Word Length", position: "bottom" }} />
                <YAxis label={{ value: "Number of Words", angle: -90, position: "left" }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}