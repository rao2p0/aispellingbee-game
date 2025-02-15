import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import NotFound from "@/pages/not-found";
import Game from "@/pages/game";
import Statistics from "@/pages/statistics";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary/10 backdrop-blur-sm border-b border-primary/20 p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img src="/logo.webp" alt="Spell Bee Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-primary logo-font">Spell Bee</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant={location === "/" ? "default" : "ghost"}
            asChild
            className={location === "/" ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/10"}
          >
            <Link href="/">Game</Link>
          </Button>
          <Button
            variant={location === "/statistics" ? "default" : "ghost"}
            asChild
            className={location === "/statistics" ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/10"}
          >
            <Link href="/statistics">Statistics</Link>
          </Button>
          <ThemeToggle />
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 pt-16">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;