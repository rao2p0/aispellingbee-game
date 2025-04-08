import { ReactNode } from 'react';
import { motion } from "framer-motion";
import GamesCarousel from '@/components/game/games-carousel';

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="flex-grow">
        {children}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 mb-16 w-full"
      >
        <GamesCarousel />
      </motion.div>
    </div>
  );
}