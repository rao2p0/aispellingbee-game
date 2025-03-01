import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import { HowToPlayButton } from "@/components/game/how-to-play-button";
import NotFound from "@/pages/not-found";
import Game from "@/pages/game";
import Statistics from "@/pages/statistics";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

function ResponsiveNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary/10 backdrop-blur-sm border-b border-primary/20 p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img src="/logo.png" alt="Spell Bee Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-primary logo-font">Spell Bee</h1>
        </Link>
        <div className="flex items-center space-x-4 md:space-x-6 lg:space-x-8"> {/* Added responsiveness */}
          <Button
            variant={location === "/" ? "default" : "ghost"}
            asChild
            className={`${location === "/" ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/10"} px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4`} {/* Added padding responsiveness */}
          >
            <Link href="/">Game</Link>
          </Button>
          <Button
            variant={location === "/statistics" ? "default" : "ghost"}
            asChild
            className={`${location === "/statistics" ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/10"} px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4`} {/* Added padding responsiveness */}
          >
            <Link href="/statistics">Statistics</Link>
          </Button>
          <HowToPlayButton />
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
          <ResponsiveNavigation />
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