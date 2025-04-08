import { useState } from "react";
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
import Wordle from "@/pages/wordle";
import WordSearch from "@/pages/word-search";
import Connections from "@/pages/connections";
import Hangman from "@/pages/hangman";
import WordLadder from "@/pages/word-ladder";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

function ResponsiveNavigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Game routes configuration for easy management
  const gameRoutes = [
    { path: "/", label: "Spell Bee", mobileOnly: false },
    { path: "/wordle", label: "Wordle", mobileOnly: false },
    { path: "/word-search", label: "Word Search", mobileOnly: true },
    { path: "/connections", label: "Connections", mobileOnly: true },
    { path: "/hangman", label: "Hangman", mobileOnly: true },
    { path: "/word-ladder", label: "Word Ladder", mobileOnly: true },
    { path: "/statistics", label: "Stats", mobileOnly: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary/10 backdrop-blur-sm border-b border-primary/20 p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and title */}
        <Link href="/" className="flex items-center gap-2 no-underline mr-4">
          <img src="/images/bee-logo.png" alt="Spell Bee Logo" className="h-8 md:h-10 w-auto bee-logo" />
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary logo-font">Spell Bee</h1>
        </Link>

        {/* Mobile/smaller screen navigation */}
        <div className="flex md:hidden items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 flex items-center justify-center">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {gameRoutes.map((route) => (
                <DropdownMenuItem key={route.path} asChild>
                  <Link
                    href={route.path}
                    className={`w-full ${location === route.path ? "bg-primary/20" : ""}`}
                  >
                    {route.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <HowToPlayButton />
          <ThemeToggle />
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Main visible game buttons */}
          {gameRoutes
            .filter((route) => !route.mobileOnly)
            .map((route) => (
              <Button
                key={route.path}
                variant={location === route.path ? "default" : "ghost"}
                asChild
                size="sm"
                className={`${
                  location === route.path ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/10"
                } px-2 py-1 lg:px-3 lg:py-2`}
              >
                <Link href={route.path}>{route.label}</Link>
              </Button>
            ))}

          {/* Games dropdown for secondary games */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 px-2 py-1 lg:px-3 lg:py-2">
                More Games
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {gameRoutes
                .filter((route) => route.mobileOnly)
                .map((route) => (
                  <DropdownMenuItem key={route.path} asChild>
                    <Link
                      href={route.path}
                      className={`w-full ${location === route.path ? "bg-primary/20" : ""}`}
                    >
                      {route.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help and theme buttons */}
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
      <Route path="/wordle" component={Wordle} />
      <Route path="/word-search" component={WordSearch} />
      <Route path="/connections" component={Connections} />
      <Route path="/hangman" component={Hangman} />
      <Route path="/word-ladder" component={WordLadder} />
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