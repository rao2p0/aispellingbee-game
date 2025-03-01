
import React from "react";
import { Button } from "@/components/ui/button";
import { QuestionMarkCircleIcon } from "lucide-react";
import HowToPlayDialog from "./how-to-play-dialog";

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
        <QuestionMarkCircleIcon className="h-5 w-5" />
      </Button>
      <HowToPlayDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
