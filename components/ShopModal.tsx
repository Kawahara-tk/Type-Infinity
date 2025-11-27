import { ShopItem } from "@/hooks/useBlockGame";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sword, Shield, Zap, Heart, TrendingUp, Crosshair, Copy, Bomb, Snowflake, Coins, RefreshCw, ArrowRight } from "lucide-react";

interface ShopModalProps {
  coins: number;
  items: ShopItem[];
  onPurchase: (item: ShopItem) => void;
  onReroll: () => void;
  onContinue: () => void;
}

const RARITY_COLORS = {
  common: "border-slate-400 bg-slate-900/90 text-slate-100",
  rare: "border-blue-400 bg-blue-900/90 text-blue-100",
  epic: "border-purple-400 bg-purple-900/90 text-purple-100",
  legendary: "border-amber-400 bg-amber-900/90 text-amber-100",
};

const TYPE_COLORS = {
  talent: "bg-green-600",
  passive: "bg-blue-600",
  special: "bg-red-600",
};

const ICONS: Record<string, any> = {
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
  timeslow: Zap,
};

export const ShopModal = ({ coins, items, onPurchase, onReroll, onContinue }: ShopModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-6xl p-8 flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-5xl font-bold text-white mb-4">SHOP</h3>
          <div className="flex items-center justify-center gap-3 text-2xl font-bold text-yellow-400">
            <Coins size={32} className="fill-current" />
            <span>{coins}</span>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-5 gap-4">
          {items.map((item) => {
            const Icon = ICONS[item.category];
            const canAfford = coins >= item.price;

            return (
              <motion.div
                key={item.id}
                whileHover={canAfford ? { scale: 1.05, y: -5 } : {}}
                className={cn(
                  "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 shadow-xl transition-all",
                  RARITY_COLORS[item.rarity],
                  !canAfford && "opacity-50 cursor-not-allowed"
                )}
              >
                {/* Type Badge */}
                <div className={cn("absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white uppercase", TYPE_COLORS[item.type])}>
                  {item.type}
                </div>

                {/* Icon */}
                <div className="p-3 rounded-full bg-white/10 ring-2 ring-white/20">
                  <Icon size={32} />
                </div>

                {/* Name & Description */}
                <div className="flex flex-col items-center gap-1 text-center flex-1">
                  <h4 className="text-sm font-bold">{item.name}</h4>
                  <p className="text-xs opacity-80 leading-tight">{item.description}</p>
                </div>

                {/* Price & Buy */}
                <button
                  onClick={() => canAfford && onPurchase(item)}
                  disabled={!canAfford}
                  className={cn(
                    "w-full py-2 rounded font-bold text-sm uppercase tracking-wider transition-all",
                    canAfford
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black active:scale-95"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Coins size={14} className="fill-current" />
                    <span>{item.price}</span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={onReroll}
            disabled={coins < 20}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all",
              coins >= 20
                ? "bg-blue-600 hover:bg-blue-500 text-white active:scale-95"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            )}
          >
            <RefreshCw size={20} />
            <span>Reroll (20)</span>
          </button>

          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-lg transition-all active:scale-95"
          >
            <span>Continue</span>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
