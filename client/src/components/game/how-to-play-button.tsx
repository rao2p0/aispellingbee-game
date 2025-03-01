import React from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
// Import the dialog component dynamically to avoid errors if not found
const HowToPlayDialog = React.lazy(() => import("./how-to-play-dialog"));

export function HowToPlayButton() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size={isMobile ? "sm" : "default"}
        className="flex gap-1 items-center whitespace-nowrap py-1 px-2"
        aria-label="How to play"
        title="How to play"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="text-sm">How to play</span>
      </Button>
      {/* Wrap in error boundary/suspense to handle loading */}
      <React.Suspense fallback={null}>
        {open && <HowToPlayDialog open={open} onOpenChange={setOpen} />}
      </React.Suspense>
    </>
  );
}