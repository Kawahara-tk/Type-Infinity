import { motion } from "framer-motion";

interface StatsDisplayProps {
  score: number;
  combo: number;
  maxCombo: number;
  className?: string;
}

export const StatsDisplay = ({ score, combo, maxCombo, className }: StatsDisplayProps) => {
  return (
    <div className={`flex gap-8 ${className}`}>
      <div className="flex flex-col items-center">
        <span className="text-sm text-muted uppercase tracking-wider">Score</span>
        <motion.span 
          key={score}
          initial={{ scale: 1.2, color: "#3b82f6" }}
          animate={{ scale: 1, color: "#f8fafc" }}
          className="text-4xl font-bold"
        >
          {score.toLocaleString()}
        </motion.span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-muted uppercase tracking-wider">Combo</span>
        <motion.span 
          key={combo}
          initial={{ scale: 1.5, color: "#10b981" }}
          animate={{ scale: 1, color: combo > 0 ? "#10b981" : "#94a3b8" }}
          className="text-4xl font-bold"
        >
          {combo}x
        </motion.span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-muted uppercase tracking-wider">Max Combo</span>
        <span className="text-4xl font-bold">{maxCombo}</span>
      </div>
    </div>
  );
};
