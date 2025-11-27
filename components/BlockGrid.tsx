import { motion, AnimatePresence } from "framer-motion";
import { Block } from "@/hooks/useBlockGame";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface BlockGridProps {
  blocks: Block[];
}

export const BlockGrid = ({ blocks }: BlockGridProps) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-background/50 rounded-xl border border-surface/50">
      {/* Danger Line */}
      <div className="absolute bottom-[5%] left-0 right-0 h-1 bg-red-500/50 border-t border-red-500 animate-pulse z-0" />
      
      <AnimatePresence>
        {blocks.map((block) => {
          if (block.status === "destroyed") return null;

          return (
            <motion.div
              key={block.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                left: `${block.x}%`,
                top: `${block.y}%`
              }}
              exit={{ scale: 0, opacity: 0, rotate: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute flex flex-col items-center justify-center rounded-lg shadow-lg z-10 transition-colors",
                block.isBoss ? "w-32 h-32 border-4 border-yellow-400 z-20" : "w-16 h-16",
                block.color
              )}
            >
              {block.isBoss && (
                <div className="absolute -top-6 text-yellow-400 animate-bounce">
                  <Crown size={32} fill="currentColor" />
                </div>
              )}
              
              <div className={cn("text-white font-bold drop-shadow-md", block.isBoss ? "text-3xl" : "text-lg")}>
                {block.hp}
              </div>
              
              {/* HP Bar */}
              <div className={cn("bg-black/30 rounded-full mt-2 overflow-hidden", block.isBoss ? "w-24 h-3" : "w-12 h-1.5")}>
                <div 
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${(block.hp / block.maxHp) * 100}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
