
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface FoundWordsDisplayProps {
  words: string[];
}

export default function FoundWordsDisplay({ words }: FoundWordsDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const sortedWords = [...words].sort((a, b) => a.length - b.length || a.localeCompare(b));

  const WordList = () => (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 gap-1 p-2">
        {sortedWords.map((word) => (
          <div
            key={word}
            className="text-sm px-2 py-1 rounded bg-muted/30"
          >
            {word.toUpperCase()}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="w-full flex items-center justify-between p-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span>Found Words ({words.length})</span>
          <ChevronUp className="w-4 h-4" />
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[50vh]">
          <WordList />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar side="right" className="!fixed">
      <SidebarContent>
        <div className="p-2 font-medium">Found Words ({words.length})</div>
        <WordList />
      </SidebarContent>
    </Sidebar>
  );
}
