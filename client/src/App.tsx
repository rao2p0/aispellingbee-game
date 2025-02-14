import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Game from "@/pages/game";
import Statistics from "@/pages/statistics";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Spell Bee</h1>
        <div className="space-x-4">
          <Button
            variant={location === "/" ? "default" : "ghost"}
            asChild
          >
            <Link href="/">Game</Link>
          </Button>
          <Button
            variant={location === "/statistics" ? "default" : "ghost"}
            asChild
          >
            <Link href="/statistics">Statistics</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Game} />
      <Route path="/statistics" component={Statistics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <main className="pt-16">
        <Router />
      </main>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;