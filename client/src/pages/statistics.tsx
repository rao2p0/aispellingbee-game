import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Trophy, Star, BookOpen, Hash, AlignJustify, Gamepad2 } from "lucide-react";
import { 
  getBestScore, getAverageScore, getTotalWordsFound, getWordLengthDistribution,
  getGamesPlayedByType, getTotalWordsFoundAllGames, getWordLengthDistributionAllGames,
  GAME_TITLES, GameType
} from "@/lib/gameStatistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameLayout from "@/components/global/game-layout";

// Colors for the pie chart
const COLORS = ['#F7DA21', '#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#E91E63'];

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

// Component to display stats for a specific game
function GameStats({ gameType }: { gameType: GameType }) {
  const bestScore = Math.round(getBestScore(gameType));
  const averageScore = Math.round(getAverageScore(gameType));
  const totalWordsFound = getTotalWordsFound(gameType);
  const wordLengthData = getWordLengthDistribution(gameType);
  const gameTitle = GAME_TITLES[gameType];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatisticCard
          title={`Best ${gameTitle} Score`}
          value={bestScore}
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
        />
        <StatisticCard
          title={`Total ${gameTitle} Words Found`}
          value={totalWordsFound}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatisticCard
          title={`Average ${gameTitle} Score`}
          value={averageScore}
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {wordLengthData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{gameTitle} Word Length Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={wordLengthData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="length" 
                    label={{ value: "Word Length", position: "bottom", offset: 0 }}
                  />
                  <YAxis 
                    label={{ value: "Number of Words", angle: -90, position: "insideLeft", offset: 10 }}
                    tickFormatter={(value) => String(Math.floor(value))}
                    allowDecimals={false}
                    domain={[0, 'dataMax']}
                    tickCount={6}
                  />
                  <Tooltip 
                    formatter={(value) => [String(Math.floor(Number(value))), "Words"]}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {wordLengthData.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No data available for {gameTitle} yet. Play some games to see your statistics!
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Main statistics component
export default function Statistics() {
  const [selectedTab, setSelectedTab] = useState<string>("summary");
  const totalWordsFound = getTotalWordsFoundAllGames();
  const wordLengthData = getWordLengthDistributionAllGames();
  const gamesPlayedData = getGamesPlayedByType();

  // Calculate the total games played for percentage calculation
  const totalGamesPlayed = gamesPlayedData.reduce((sum, game) => sum + game.count, 0);

  // Prepare data for the pie chart
  const pieChartData = gamesPlayedData.map(game => ({
    name: game.title,
    value: game.count,
    percentage: totalGamesPlayed ? Math.round((game.count / totalGamesPlayed) * 100) : 0
  }));

  return (
    <GameLayout>
      <div className="bg-background p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <h1 className="text-3xl font-bold">Statistics</h1>

          <Tabs defaultValue="summary" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6 flex flex-wrap">
              <TabsTrigger value="summary">
                <AlignJustify className="h-4 w-4 mr-2" />
                All Games
              </TabsTrigger>
              <TabsTrigger value="spellbee">
                <Hash className="h-4 w-4 mr-2" />
                Spell Bee
              </TabsTrigger>
              <TabsTrigger value="wordle">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Wordle
              </TabsTrigger>
              <TabsTrigger value="wordsearch">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Word Search
              </TabsTrigger>
              <TabsTrigger value="connections">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Connections
              </TabsTrigger>
              <TabsTrigger value="hangman">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Hangman
              </TabsTrigger>
              <TabsTrigger value="wordladder">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Word Ladder
              </TabsTrigger>
            </TabsList>

            {/* Summary tab with overall statistics */}
            <TabsContent value="summary">
              <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <StatisticCard
                    title="Total Games Played"
                    value={totalGamesPlayed}
                    icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatisticCard
                    title="Total Words Found"
                    value={totalWordsFound}
                    icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatisticCard
                    title="Game Types Played"
                    value={gamesPlayedData.filter(g => g.count > 0).length}
                    icon={<Star className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Games played distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Games Played Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full" style={{ height: '300px' }}>
                        {pieChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [String(Math.floor(Number(value))), "Games"]} 
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            No game data available yet
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                
                  {/* Word length distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Word Length Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full" style={{ height: '300px' }}>
                        {wordLengthData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={wordLengthData}
                              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="length" 
                                label={{ value: "Word Length", position: "bottom", offset: 0 }}
                              />
                              <YAxis 
                                label={{ value: "Number of Words", angle: -90, position: "insideLeft", offset: 10 }}
                                tickFormatter={(value) => String(Math.floor(value))}
                                allowDecimals={false}
                                domain={[0, 'dataMax']}
                                tickCount={6}
                              />
                              <Tooltip 
                                formatter={(value) => [String(Math.floor(Number(value))), "Words"]}
                              />
                              <Bar dataKey="count" fill="hsl(var(--primary))" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            No word data available yet
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Individual game tabs */}
            <TabsContent value="spellbee">
              <GameStats gameType="spellbee" />
            </TabsContent>
            
            <TabsContent value="wordle">
              <GameStats gameType="wordle" />
            </TabsContent>
            
            <TabsContent value="wordsearch">
              <GameStats gameType="wordsearch" />
            </TabsContent>
            
            <TabsContent value="connections">
              <GameStats gameType="connections" />
            </TabsContent>
            
            <TabsContent value="hangman">
              <GameStats gameType="hangman" />
            </TabsContent>
            
            <TabsContent value="wordladder">
              <GameStats gameType="wordladder" />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </GameLayout>
  );
}