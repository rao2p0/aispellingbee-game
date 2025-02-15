import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t py-4 bg-background">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm text-muted-foreground">
        <div>
          © {new Date().getFullYear()} Spell Bee. All rights reserved.
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          View Source
        </a>
      </div>
    </footer>
  );
}
