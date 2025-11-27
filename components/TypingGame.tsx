"use client";

import { useEffect, useState } from "react";
import { useBlockGame } from "@/hooks/useBlockGame";
import { BlockGrid } from "@/components/BlockGrid";
import { StatsDisplay } from "@/components/StatsDisplay";
import { ShopModal } from "@/components/ShopModal";
import { RefreshCcw, Rocket, Heart, Shield, Timer, Coins, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypingGame = () => {
  const { 
    blocks, 
    projectiles,
    damageNumbers,
    currentWord,
    typed, 
    gameState, 
    score, 
    combo, 
    maxCombo, 
    wave,
    baseHp,
    maxBaseHp,
    timeLeft,
    coins,
    shopItems,
    specials,
    shieldActive,
    timeSlowActive,
    purchaseItem,
    rerollShop,
    continueToNextWave,
    resetGame,
    stats 
  } = useBlockGame();
  
  const [isFocused, setIsFocused] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (wave === 11 || wave === 21 || wave === 31) {
      setShowBanner(true);
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [wave]);

  useEffect(() => {
    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  const getBgColor = () => {
    if (wave <= 10) return "bg-surface/20";
    if (wave <= 20) return "bg-blue-900/40 border-blue-500/30";
    if (wave <= 30) return "bg-purple-900/40 border-purple-500/30";
    return "bg-red-900/40 border-red-500/30";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col items-center gap-8 min-h-screen">
      {/* Header / Stats */}
      <div className="w-full flex justify between items-end border-b border-surface pb-4 sticky top-0 bg-background/95 backdrop-blur z-50 pt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-primary">Type Infinity</h2>
          <div className="flex items-center gap-4 text-muted">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span className="font-mono font-bold">WAVE {wave}</span>
            </div>
            {wave % 5 === 0 ? (
              <div className="flex items-center gap-2 text-purple-400 font-mono font-bold animate-pulse">
                <Timer size={16} />
                <span>BOSS WAVE</span>
              </div>
            ) : (
              <div className={cn("flex items-center gap-2 font-mono font-bold", timeLeft > 20 ? "text-green-500" : "")}>
                <Timer size={16} />
                <span>{Math.floor(timeLeft)}s / 30s</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-yellow-400 font-mono font-bold">
              <Coins size={16} className="fill-current" />
              <span>{coins}</span>
            </div>
          </div>
        </div>
        <StatsDisplay 
          score={score} 
          combo={combo} 
          maxCombo={maxCombo} 
        />
      </div>

      {/* Game Area */}
      <div className={cn("relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border border-surface/50 transition-all duration-1000", getBgColor())}>
        {!isFocused && gameState !== "gameover" && gameState !== "shop" && gameState !== "paused" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <span className="text-xl font-medium text-muted">Click to focus</span>
          </div>
        )}
        
        {/* Status Effects */}
        {shieldActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500/90 px-4 py-2 rounded-full font-bold text-white z-40 flex items-center gap-2">
            <Shield size={20} />
            <span>SHIELD ACTIVE</span>
          </div>
        )}
        {timeSlowActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-purple-500/90 px-4 py-2 rounded-full font-bold text-white z-40 flex items-center gap-2">
            <Zap size={20} />
            <span>TIME SLOW</span>
          </div>
        )}

        {/* Difficulty Banners */}
        <AnimatePresence>
          {wave === 11 && gameState === "playing" && showBanner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="bg-blue-600/90 text-white px-8 py-4 rounded-xl shadow-2xl border-4 border-blue-400 backdrop-blur-md">
                <h3 className="text-4xl font-bold tracking-widest text-center">NORMAL MODE</h3>
                <p className="text-center text-blue-100 font-bold mt-2">Enemies are stronger!</p>
              </div>
            </motion.div>
          )}
          {wave === 21 && gameState === "playing" && showBanner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="bg-purple-600/90 text-white px-8 py-4 rounded-xl shadow-2xl border-4 border-purple-400 backdrop-blur-md">
                <h3 className="text-4xl font-bold tracking-widest text-center">HARD MODE</h3>
                <p className="text-center text-purple-100 font-bold mt-2">Prepare yourself!</p>
              </div>
            </motion.div>
          )}
          {wave === 31 && gameState === "playing" && showBanner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="bg-red-600/90 text-white px-8 py-4 rounded-xl shadow-2xl border-4 border-red-400 backdrop-blur-md animate-pulse">
                <h3 className="text-4xl font-bold tracking-widest text-center">DEATH MODE</h3>
                <p className="text-center text-red-100 font-bold mt-2">SURVIVE IF YOU CAN!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BlockGrid blocks={blocks} />
        
        {/* Projectiles */}
        {projectiles.map(p => (
          <motion.div
            key={p.id}
            className={cn(
              "absolute rounded-full z-20",
              p.isCrit ? "w-4 h-4 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" : "w-3 h-3 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
            )}
            style={{ 
              left: `${p.x}%`, 
              top: `${p.y}%`,
            }}
          />
        ))}

        {/* Damage Numbers */}
        <AnimatePresence>
          {damageNumbers.map(dn => (
            <motion.div
              key={dn.id}
              initial={{ opacity: 1, y: 0, scale: dn.isCrit ? 1 : 0.5 }}
              animate={{ opacity: 0, y: -50, scale: dn.isCrit ? 2 : 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={cn(
                "absolute font-bold z-30 pointer-events-none",
                dn.isCrit ? "text-red-500 text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" : "text-yellow-300 text-xl"
              )}
              style={{ 
                left: `${dn.x}%`, 
                top: `${dn.y}%`,
              }}
            >
              {dn.value}
              {dn.isCrit && "!"}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Base HP Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800 z-10">
          <motion.div 
            className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            initial={{ width: "100%" }}
            animate={{ width: `${(baseHp / maxBaseHp) * 100}%` }}
          />
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-red-400 font-bold z-30 bg-black/50 px-3 py-1 rounded-full backdrop-blur">
          <Heart size={16} fill="currentColor" />
          <span>{Math.ceil(baseHp)} / {maxBaseHp}</span>
        </div>

        {/* Special Items Display */}
        {specials.length > 0 && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
            {specials.filter(s => s.charges > 0).map(special => (
              <div key={special.id} className="bg-black/70 px-3 py-2 rounded-lg backdrop-blur flex items-center gap-2 text-white">
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs font-bold">SPACE</kbd>
                <span className="text-sm font-bold">{special.name}</span>
                <span className="text-yellow-400 font-bold">x{special.charges}</span>
              </div>
            ))}
          </div>
        )}

        {/* Shooter / Turret Visual */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-30">
          {/* Ammo Display */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-muted font-mono uppercase tracking-widest">Targeting System</div>
            <div className="flex items-center justify-center px-6 py-3 bg-surface/80 backdrop-blur rounded-xl border border-primary/30 shadow-lg min-w-[200px]">
              <span className="text-2xl font-mono font-bold tracking-wider">
                <span className="text-primary">{typed}</span>
                <span className="text-muted opacity-50">{currentWord.slice(typed.length)}</span>
              </span>
            </div>
          </div>

          <div className="relative">
            <motion.div 
              animate={{ 
                scale: typed.length > 0 ? [1, 1.2, 1] : 1,
                y: typed.length > 0 ? [0, -5, 0] : 0
              }}
              transition={{ duration: 0.1 }}
              className="p-4 bg-primary rounded-full shadow-lg shadow-primary/50 ring-4 ring-surface"
            >
              <Rocket size={32} className="text-white transform -rotate-45" />
            </motion.div>
          </div>
        </div>

        {gameState === "idle" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-muted animate-pulse font-bold text-center z-40">
            <p>DEFEND THE BASE</p>
            <p className="text-sm font-normal mt-2">Survive 30s per wave!</p>
            <p className="text-xs font-normal mt-1 text-yellow-400">Press SPACE to use items</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface/80 text-text rounded-lg transition-all active:scale-95 shadow-lg"
        >
          <RefreshCcw size={20} />
          <span>Reset</span>
        </button>
      </div>

      {/* Shop Overlay */}
      <AnimatePresence>
        {gameState === "shop" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ShopModal
              coins={coins}
              items={shopItems}
              onPurchase={purchaseItem}
              onReroll={rerollShop}
              onContinue={continueToNextWave}
              wave={wave}
              timeLeft={timeLeft}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameState === "gameover" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <div className="bg-surface border border-surface/50 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 max-w-2xl w-full">
              <h3 className="text-3xl font-bold text-error">BASE DESTROYED</h3>
              
              <div className="grid grid-cols-2 gap-8 w-full">
                <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl w-full">
                  <span className="text-sm text-muted">Final Score</span>
                  <span className="text-3xl sm:text-4xl font-bold text-secondary whitespace-nowrap text-center leading-tight">{score.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-background/50 rounded-xl">
                  <span className="text-sm text-muted">Waves Cleared</span>
                  <span className="text-5xl font-bold text-secondary">{wave - 1}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Modal */}
      <AnimatePresence>
        {gameState === "paused" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <div className="bg-surface border border-surface/50 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-2xl w-full">
              <h3 className="text-3xl font-bold text-primary tracking-widest">PAUSED</h3>
              
              <div className="w-full grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Total Attack</span>
                  <span className="font-bold text-xl text-yellow-400">{Math.floor(stats.baseAtk * stats.atkLevel * stats.atkMultiplier)}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Base Atk</span>
                  <span className="font-bold text-lg">{stats.baseAtk}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Atk Level</span>
                  <span className="font-bold text-lg">Lv.{stats.atkLevel}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Multiplier</span>
                  <span className="font-bold text-lg">x{stats.atkMultiplier.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Crit Rate</span>
                  <span className="font-bold text-lg">{(stats.critRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Crit Dmg</span>
                  <span className="font-bold text-lg">{(stats.critDmg * 100).toFixed(0)}%</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Multishot</span>
                  <span className="font-bold text-lg">{(stats.multishot * 100).toFixed(0)}%</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Splash</span>
                  <span className="font-bold text-lg">{stats.splashRadius}px</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Slow</span>
                  <span className="font-bold text-lg">{(stats.slowEffect * 100).toFixed(0)}%</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Combo Rate</span>
                  <span className="font-bold text-lg">{(stats.comboRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider">Max Combo</span>
                  <span className="font-bold text-lg">{stats.maxComboCap}</span>
                </div>
              </div>

              <div className="text-sm text-muted animate-pulse">
                Press ESC to Resume
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
