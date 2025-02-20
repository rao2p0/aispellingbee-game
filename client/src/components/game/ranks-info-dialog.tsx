
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RANKS } from "@/lib/ranks";

export default function RanksInfoDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ranks</DialogTitle>
          <DialogDescription>
            Progress through these ranks as you discover more words
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {RANKS.slice().reverse().map((rank, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="font-medium">{rank.title}</span>
              <span className="text-muted-foreground">{rank.threshold}%</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
