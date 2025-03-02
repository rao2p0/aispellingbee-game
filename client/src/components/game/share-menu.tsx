
import React from "react";
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from "react-share";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareMenuProps {
  shareText: string;
  url: string;
  title: string;
}

export function ShareMenu({ shareText, url, title }: ShareMenuProps) {
  const iconSize = 32;
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 items-center">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Share Your Score</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Share your Spelling Bee score with friends and challenge them to beat it!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <WhatsappShareButton url={url} title={shareText}>
              <WhatsappIcon size={iconSize} round />
            </WhatsappShareButton>
            
            <TwitterShareButton url={url} title={shareText}>
              <TwitterIcon size={iconSize} round />
            </TwitterShareButton>
            
            <FacebookShareButton url={url} quote={shareText}>
              <FacebookIcon size={iconSize} round />
            </FacebookShareButton>
            
            <EmailShareButton url={url} subject={title} body={shareText}>
              <EmailIcon size={iconSize} round />
            </EmailShareButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
