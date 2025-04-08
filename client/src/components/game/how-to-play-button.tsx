
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import { HowToPlayDialogProps } from "./how-to-play-types";
// Import the dialog component dynamically to avoid errors if not found
const HowToPlayDialog = React.lazy(() => import("./how-to-play-dialog"));

export function HowToPlayButton() {
  const [open, setOpen] = React.useState(false);
  const [location] = useLocation();
  
  // Extract the game name from the path
  const gamePath = location === "/" ? "game" : location.substring(1);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0 flex items-center justify-center"
        aria-label="How to play"
        title="How to play"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      {/* Wrap in error boundary/suspense to handle loading */}
      <React.Suspense fallback={null}>
        {open && <HowToPlayDialog open={open} onOpenChange={setOpen} gamePath={gamePath} />}
      </React.Suspense>
    </>
  );
}
