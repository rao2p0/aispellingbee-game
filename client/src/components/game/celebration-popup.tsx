import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, Sparkles } from "lucide-react";

interface CelebrationPopupProps {
  word: string;
  points: number;
  isVisible: boolean;
  onAnimationComplete?: () => void;
  hasBonus?: boolean;
}

export default function CelebrationPopup({
  word,
  points,
  isVisible,
  onAnimationComplete,
  hasBonus,
}: CelebrationPopupProps) {
  const getIcon = () => {
    if (word.length >= 7) return Crown;
    if (word.length >= 5) return Star;
    return Sparkles;
  };

  const Icon = getIcon();

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: 1,
          }}
          exit={{ 
            scale: 0,
            opacity: 0,
            transition: { duration: 0.2 }
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div 
            className="bg-primary/90 text-primary-foreground rounded-lg px-6 py-4 shadow-lg flex flex-col items-center"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          >
            <motion.div
              animate={{ 
                rotate: hasBonus ? [0, 15, -15, 15, -15, 0] : [0, 15, -15, 0],
                scale: hasBonus ? [1, 1.4, 1.2, 1.4, 1.2, 1] : [1, 1.2, 1],
              }}
              transition={{
                duration: hasBonus ? 1.2 : 0.5,
                times: hasBonus ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.2, 0.8, 1],
              }}
            >
              <Icon className="w-8 h-8 mb-2" />
            </motion.div>
            <p className="text-lg font-bold">{word.toUpperCase()}</p>
            <p className="text-sm">+{points} points!</p>
            {hasBonus && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-yellow-500 font-semibold mt-1"
              >
                +7 BONUS POINTS!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
