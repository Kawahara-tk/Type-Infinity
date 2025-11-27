import { Talent } from "@/hooks/useBlockGame";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sword, Shield, Zap, Heart, TrendingUp, Crosshair, Copy, Bomb, Snowflake } from "lucide-react";

interface TalentCardProps {
  talent: Talent;
  onClick: () => void;
}

const RARITY_COLORS = {
  common: "border-slate-400 bg-slate-900/80 text-slate-100",
  rare: "border-blue-400 bg-blue-900/80 text-blue-100",
  epic: "border-purple-400 bg-purple-900/80 text-purple-100",
  legendary: "border-amber-400 bg-amber-900/80 text-amber-100",
};

const ICONS = {
  atk_pct: Sword,
  base_atk: Zap,
  heal_hp: Heart,
  combo_rate: TrendingUp,
  max_combo: Shield,
  crit_rate: Crosshair,
  crit_dmg: Crosshair,
  multishot: Copy,
  splash: Bomb,
  slow: Snowflake,
  nuke: Bomb,
  shield: Shield,
  timeslow: Snowflake,
};

export const TalentCard = ({ talent, onClick }: TalentCardProps) => {
  const Icon = ICONS[talent.category];

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-4 p-6 rounded-xl border-2 shadow-xl transition-all w-64 h-80",
        RARITY_COLORS[talent.rarity]
      )}
    >
      <div className="p-4 rounded-full bg-white/10 ring-2 ring-white/20">
        <Icon size={48} />
      </div>
      
      <div className="flex flex-col items-center gap-2 text-center flex-1">
        <h3 className="text-xl font-bold">{talent.name}</h3>
        <span className="text-xs uppercase tracking-widest opacity-70 font-mono">
          {talent.rarity}
        </span>
        <p className="mt-4 text-sm opacity-90 leading-relaxed">
          {talent.description}
        </p>
      </div>

      <div className="w-full py-2 bg-white/10 rounded text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors">
        Select
      </div>
    </motion.button>
  );
};
