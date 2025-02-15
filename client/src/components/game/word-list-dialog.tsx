import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { useState } from "react"

interface WordListDialogProps {
  foundWords: string[]
  allWords: string[]
  totalPoints: number
  userPoints: number
}

export default function WordListDialog({ foundWords, allWords, totalPoints, userPoints }: WordListDialogProps) {
  const [open, setOpen] = useState(false);

  const sortedWords = [...allWords].sort((a, b) => a.length - b.length || a.localeCompare(b));
  const foundWordsSet = new Set(foundWords);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          I'm Done! Show All Words
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] w-[500px] h-[80vh] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>All Possible Words</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Score: {userPoints}/{totalPoints} ({Math.round((userPoints/totalPoints) * 100)}%)
            <br />
            Found: {foundWords.length}/{allWords.length} ({Math.round((foundWords.length/allWords.length) * 100)}%)
          </div>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="grid grid-cols-2 gap-2">
            {sortedWords.map((word) => {
              const found = foundWordsSet.has(word);
              return (
                <div
                  key={word}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    found ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {found ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  {word.toUpperCase()}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
