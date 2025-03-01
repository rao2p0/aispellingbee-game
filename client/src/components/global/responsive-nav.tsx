
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { HowToPlayButton } from "@/components/game/how-to-play-button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function ResponsiveNav() {
  const isMobile = useIsMobile();
  
  return (
    <NavigationMenu className="max-w-full w-full justify-between px-2">
      <NavigationMenuList className={cn(
        "w-full justify-between",
        isMobile && "flex-wrap gap-y-2"
      )}>
        <NavigationMenuItem className="flex-shrink-0">
          <NavigationMenuLink 
            href="/" 
            className="font-bold text-lg px-2"
          >
            Spelling Bee
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <div className={cn(
          "flex items-center gap-2",
          isMobile && "w-full justify-end"
        )}>
          <NavigationMenuItem>
            <HowToPlayButton />
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
