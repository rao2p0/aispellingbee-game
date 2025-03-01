
import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
// Import the dialog component dynamically to avoid errors if not found
const HowToPlayDialog = React.lazy(() => import("./how-to-play-dialog"));

export function HowToPlayButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setOpen(true)}
        className="hover:bg-primary/10" 
        aria-label="How to play"
        title="How to play"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      {/* Wrap in error boundary/suspense to handle loading */}
      <React.Suspense fallback={null}>
        {open && <HowToPlayDialog open={open} onOpenChange={setOpen} />}
      </React.Suspense>
    </>
  );
}
