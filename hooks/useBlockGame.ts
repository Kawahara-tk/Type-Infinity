import { useState, useEffect, useCallback, useRef } from "react";
import { getRandomWord } from "@/lib/words";

export interface Block {
  id: string;
  color: string;
  x: number;
  y: number;
  status: "active" | "destroyed";
  hp: number;
  maxHp: number;
  isBoss?: boolean;
  slowed?: boolean;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetId: string;
  damage: number;
  isCrit: boolean;
  isSplash?: boolean;
}

export interface DamageNumber {
  id: string;
  x: number;
  y: number;
  value: number;
  timestamp: number;
  isCrit: boolean;
}

export type GameState = "idle" | "playing" | "shop" | "gameover" | "paused";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: "talent" | "passive" | "special";
  category: "atk_pct" | "base_atk" | "heal_hp" | "combo_rate" | "max_combo" | "crit_rate" | "crit_dmg" | "multishot" | "splash" | "slow" | "nuke" | "shield" | "timeslow";
  value: number;
  price: number;
  rarity: "common" |"rare" | "epic" | "legendary";
}

// Backward compatibility
export type Talent = ShopItem;

export interface PlayerStats {
  baseAtk: number;
  atkMultiplier: number;
  comboRate: number;
  maxComboCap: number;
  critRate: number;
  critDmg: number;
  multishot: number;
  splashRadius: number;
  slowEffect: number;
  atkLevel: number; // New: Attack level for upgrades
}

export interface Special {
  id: string;
  name: string;
  category: "nuke" | "shield" | "timeslow";
  charges: number;
}

const COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
  "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
  "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
  "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
  "bg-rose-500",
];

const SHOP_POOL: ShopItem[] = [
  // Talents - Attack Level (NEW)
  { id: "atk_lvl_1", name: "Attack Lv.2", description: "Upgrade Attack Level", type: "talent", category: "base_atk", value: 1, price: 100, rarity: "rare" },
  { id: "atk_lvl_2", name: "Attack Lv.3", description: "Upgrade Attack Level", type: "talent", category: "base_atk", value: 1, price: 150, rarity: "rare" },
  { id: "atk_lvl_3", name: "Attack Lv.4", description: "Upgrade Attack Level", type: "talent", category: "base_atk", value: 1, price: 200, rarity: "epic" },
  { id: "atk_lvl_4", name: "Attack Lv.5", description: "Upgrade Attack Level", type: "talent", category: "base_atk", value: 1, price: 250, rarity: "epic" },
  
  // Talents - Attack
  { id: "atk_1", name: "Sharpness", description: "+10% Attack", type: "talent", category: "atk_pct", value: 0.1, price: 50, rarity: "common" },
  { id: "atk_2", name: "Sharpness II", description: "+15% Attack", type: "talent", category: "atk_pct", value: 0.15, price: 80, rarity: "rare" },
  { id: "atk_3", name: "Sharpness III", description: "+25% Attack", type: "talent", category: "atk_pct", value: 0.25, price: 130, rarity: "epic" },
  { id: "base_atk_1", name: "Power", description: "+5 Base Damage", type: "talent", category: "base_atk", value: 5, price: 60, rarity: "common" },
  { id: "base_atk_2", name: "Power II", description: "+10 Base Damage", type: "talent", category: "base_atk", value: 10, price: 100, rarity: "rare" },
  { id: "base_atk_3", name: "Power III", description: "+20 Base Damage", type: "talent", category: "base_atk", value: 20, price: 160, rarity: "epic" },
  
  // Talents - Survival
  { id: "heal_1", name: "Repair Kit", description: "Heal 30% HP & +10 Max HP", type: "talent", category: "heal_hp", value: 0.3, price: 80, rarity: "common" },
  { id: "heal_2", name: "Repair Kit II", description: "Heal 50% HP & +20 Max HP", type: "talent", category: "heal_hp", value: 0.5, price: 120, rarity: "rare" },
  
  // Talents - Crit
  { id: "crit_1", name: "Precision", description: "+1% Crit Rate", type: "talent", category: "crit_rate", value: 0.01, price: 60, rarity: "rare" },
  { id: "crit_2", name: "Precision II", description: "+3% Crit Rate", type: "talent", category: "crit_rate", value: 0.03, price: 120, rarity: "epic" },
  { id: "crit_3", name: "Precision III", description: "+5% Crit Rate", type: "talent", category: "crit_rate", value: 0.05, price: 150, rarity: "legendary" },
  { id: "crit_dmg_1", name: "Lethality", description: "+10% Crit Dmg", type: "talent", category: "crit_dmg", value: 0.01, price: 80, rarity: "rare" },
  { id: "crit_dmg_2", name: "Lethality II", description: "+30% Crit Dmg", type: "talent", category: "crit_dmg", value: 0.03, price: 120, rarity: "epic" },
  { id: "crit_dmg_3", name: "Lethality III", description: "+50% Crit Dmg", type: "talent", category: "crit_dmg", value: 0.05, price: 150, rarity: "legendary" },
  
  // Talents - Multi & Splash (Multi-Attack)
  { id: "multi_1", name: "Barrage", description: "+5% Multishot", type: "talent", category: "multishot", value: 0.05, price: 150, rarity: "epic" },
  { id: "multi_2", name: "Barrage II", description: "+10% Multishot", type: "talent", category: "multishot", value: 0.1, price: 250, rarity: "legendary" },
  { id: "multi_3", name: "Barrage III", description: "+20% Multishot", type: "talent", category: "multishot", value: 0.2, price: 330, rarity: "legendary" },
  { id: "splash_1", name: "Explosive", description: "Splash Radius +2", type: "talent", category: "splash", value: 2, price: 90, rarity: "epic" },
  { id: "splash_2", name: "Explosive II", description: "Splash Radius +5", type: "talent", category: "splash", value: 5, price: 180, rarity: "legendary" },
  { id: "splash_3", name: "Explosive III", description: "Splash Radius +10", type: "talent", category: "splash", value: 10, price: 330, rarity: "legendary" },
  
  // Talents - Combo (Nerfed)
  { id: "combo_1", name: "Flow", description: "+10% Combo Scaling", type: "talent", category: "combo_rate", value: 0.1, price: 70, rarity: "common" },
  { id: "combo_2", name: "Flow II", description: "+15% Combo Scaling", type: "talent", category: "combo_rate", value: 0.15, price: 110, rarity: "rare" },
  { id: "max_combo_1", name: "Focus", description: "+10 Max Combo Cap", type: "talent", category: "max_combo", value: 10, price: 90, rarity: "rare" },
  { id: "max_combo_2", name: "Focus II", description: "+20 Max Combo Cap", type: "talent", category: "max_combo", value: 20, price: 140, rarity: "epic" },
  
  // Passives
  { id: "slow_p", name: "Frost Aura", description: "Slow all enemies 20%", type: "passive", category: "slow", value: 0.2, price: 100, rarity: "rare" },
  { id: "regen_p", name: "Regeneration", description: "Heal 1 HP/sec", type: "passive", category: "heal_hp", value: 1, price: 120, rarity: "rare" },
  { id: "armor_p", name: "Armor Plating", description: "Reduce damage by 20%", type: "passive", category: "base_atk", value: 0.2, price: 150, rarity: "epic" },
  
  // Specials
  { id: "nuke_s", name: "Nuke", description: "2000% damage to all (Space)", type: "special", category: "nuke", value: 20, price: 200, rarity: "legendary" },
  { id: "shield_s", name: "Shield", description: "Invincible 5s (Space)", type: "special", category: "shield", value: 5, price: 150, rarity: "epic" },
  { id: "time_s", name: "Time Warp", description: "Slow time 10s (Space)", type: "special", category: "timeslow", value: 10, price: 180, rarity: "epic" },
];

export const useBlockGame = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>("idle");
  const [wave, setWave] = useState(1);
  const [baseHp, setBaseHp] = useState(100);
  const [maxBaseHp, setMaxBaseHp] = useState(100);
  const [timeLeft, setTimeLeft] = useState(0); // Survival timer starts at 0
  const [coins, setCoins] = useState(0);
  
  // Entities
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  
  // Typing
  const [currentWord, setCurrentWord] = useState("");
  const [typed, setTyped] = useState("");
  
  // Score & Stats
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [stats, setStats] = useState<PlayerStats>({
    baseAtk: 10,
    atkMultiplier: 1.0,
    comboRate: 0.2,
    maxComboCap: 20,
    critRate: 0.05,
    critDmg: 1.5,
    multishot: 0,
    splashRadius: 0,
    slowEffect: 0,
    atkLevel: 1, // New: Attack level
  });

  // Shop & Items
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [specials, setSpecials] = useState<Special[]>([]);
  const [activePassives, setActivePassives] = useState<string[]>([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [timeSlowActive, setTimeSlowActive] = useState(false);

  // Wave Management
  const [blocksSpawned, setBlocksSpawned] = useState(0);
  const [blocksToSpawn, setBlocksToSpawn] = useState(10);
  const [bossActive, setBossActive] = useState(false);

  // Refs
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const spawnTimerRef = useRef<number>(0);
  const bossSpawnTimerRef = useRef<number>(0);
  const speedRef = useRef<number>(5);
  const shieldTimerRef = useRef<number>(0);
  const timeSlowTimerRef = useRef<number>(0);

  const getWaveHp = useCallback((isBoss: boolean = false) => {
    let hp = 20;
    if (wave <= 10) {
      // Easy: 1.2x scaling
      hp = 20 * Math.pow(1.2, wave - 1);
    } else if (wave <= 20) {
      // Normal: 1.3x scaling
      const hp10 = 20 * Math.pow(1.2, 9);
      hp = hp10 * Math.pow(1.3, wave - 10);
    } else if (wave <= 30) {
      // Hard: 1.5x scaling
      const hp10 = 20 * Math.pow(1.2, 9);
      const hp20 = hp10 * Math.pow(1.3, 10);
      hp = hp20 * Math.pow(1.5, wave - 20);
    } else {
      // Death: 1.8x scaling
      const hp10 = 20 * Math.pow(1.2, 9);
      const hp20 = hp10 * Math.pow(1.3, 10);
      const hp30 = hp20 * Math.pow(1.5, 10);
      hp = hp30 * Math.pow(1.8, wave - 30);
    }
    
    const finalHp = Math.floor(isBoss ? hp * 10 : hp);
    return Math.max(1, finalHp);
  }, [wave]);

  const getCoinReward = useCallback((isBoss: boolean = false) => {
    return Math.floor(isBoss ? 50 : 10);
  }, []);

  const spawnBlock = useCallback((isMinion: boolean = false, bossX?: number, bossY?: number) => {
    const maxHp = getWaveHp(false);
    
    const x = isMinion && bossX !== undefined 
      ? Math.min(90, Math.max(0, bossX + (Math.random() * 20 - 10)))
      : Math.random() * 80 + 5;
      
    const y = isMinion && bossY !== undefined 
      ? bossY + 10 
      : -10;

    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x,
      y,
      status: "active",
      hp: maxHp,
      maxHp: maxHp,
      isBoss: false,
    };
    setBlocks((prev) => [...prev, newBlock]);
    if (!isMinion) setBlocksSpawned(prev => prev + 1);
  }, [getWaveHp]);

  const spawnBoss = useCallback(() => {
    const maxHp = getWaveHp(true);
    const newBlock: Block = {
      id: "BOSS_" + Math.random().toString(36).substr(2, 9),
      color: "bg-purple-900 border-4 border-yellow-400",
      x: 40,
      y: -20,
      status: "active",
      hp: maxHp,
      maxHp: maxHp,
      isBoss: true,
    };
    setBlocks((prev) => [...prev, newBlock]);
    setBossActive(true);
  }, [getWaveHp]);

  const generateShop = useCallback(() => {
    // Weighted probabilities: Common 40%, Rare 30%, Epic 20%, Legendary 10%
    const getRarity = () => {
      const r = Math.random();
      if (r < 0.4) return "common";
      if (r < 0.7) return "rare";
      if (r < 0.9) return "epic";
      return "legendary";
    };

    const items: ShopItem[] = [];
    while (items.length < 5) {
      const targetRarity = getRarity();
      const pool = SHOP_POOL.filter(i => i.rarity === targetRarity);
      if (pool.length > 0) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        // Avoid duplicates
        if (!items.find(i => i.id === item.id)) {
          items.push(item);
        }
      }
    }
    setShopItems(items);
  }, []);

  const rerollShop = useCallback(() => {
    const cost = 20;
    if (coins >= cost) {
      setCoins(prev => prev - cost);
      generateShop();
    }
  }, [coins, generateShop]);

  const purchaseItem = useCallback((item: ShopItem) => {
    if (coins < item.price) return;

    setCoins(prev => prev - item.price);

    if (item.type === "talent") {
      setStats(prev => {
        const newStats = { ...prev };
        switch (item.category) {
          case "atk_pct": newStats.atkMultiplier += item.value; break;
          case "base_atk":
            // Check if it's an attack level upgrade
            if (item.id.startsWith("atk_lvl")) {
              newStats.atkLevel += item.value;
            } else {
              newStats.baseAtk += item.value;
            }
            break;
          case "combo_rate": newStats.comboRate += item.value; break;
          case "max_combo": newStats.maxComboCap += item.value; break;
          case "crit_rate": newStats.critRate += item.value; break;
          case "crit_dmg": newStats.critDmg += item.value; break;
          case "multishot": newStats.multishot += item.value; break;
          case "splash": newStats.splashRadius += item.value; break;
          case "heal_hp":
            setMaxBaseHp(m => m + 10);
            setBaseHp(h => Math.min(maxBaseHp + 10, h + (maxBaseHp * item.value)));
            break;
        }
        return newStats;
      });
    } else if (item.type === "passive") {
      setActivePassives(prev => [...prev, item.id]);
      if (item.category === "slow") {
        setStats(prev => ({ ...prev, slowEffect: Math.max(prev.slowEffect, item.value) }));
      }
    } else if (item.type === "special") {
      setSpecials(prev => {
        const existing = prev.find(s => s.category === item.category);
        if (existing) {
          return prev.map(s => s.category === item.category ? { ...s, charges: s.charges + 1 } : s);
        }
        return [...prev, { id: item.id, name: item.name, category: item.category as "nuke" | "shield" | "timeslow", charges: 1 }];
      });
    }

    // Remove from shop
    setShopItems(prev => prev.filter(i => i.id !== item.id));
  }, [coins, maxBaseHp]);

  const useSpecial = useCallback((category: "nuke" | "shield" | "timeslow") => {
    const special = specials.find(s => s.category === category && s.charges > 0);
    if (!special) return;

    setSpecials(prev => prev.map(s => s.category === category ? { ...s, charges: s.charges - 1 } : s));

    if (category === "nuke") {
      // Nerfed: Deal 2000% damage instead of instant kill
      const nukeDamage = Math.floor((stats.baseAtk * stats.atkLevel) * stats.atkMultiplier * 20);
      setBlocks(prev => prev.map(b => {
        const newHp = Math.floor(b.hp - nukeDamage);
        if (newHp <= 0 && b.status === "active") {
          setCoins(c => c + getCoinReward(b.isBoss));
        }
        return { ...b, hp: newHp, status: newHp <= 0 ? "destroyed" : b.status };
      }));
    } else if (category === "shield") {
      setShieldActive(true);
      shieldTimerRef.current = 5;
    } else if (category === "timeslow") {
      setTimeSlowActive(true);
      timeSlowTimerRef.current = 10;
    }
  }, [specials, stats, getCoinReward]);

  const continueToNextWave = useCallback(() => {
    setWave(w => w + 1);
    setBlocksSpawned(0);
    setBlocksToSpawn(prev => Math.floor(prev * 1.1) + 2);
    setBossActive(false);
    setTimeLeft(0); // Reset to 0 for survival timer
    setGameState("playing");
    lastTimeRef.current = performance.now();
  }, []);

  const resetGame = useCallback(() => {
    setBlocks([]);
    setProjectiles([]);
    setDamageNumbers([]);
    setCurrentWord(getRandomWord());
    setTyped("");
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCoins(0);
    setGameState("idle");
    setWave(1);
    setBaseHp(100);
    setMaxBaseHp(100);
    setTimeLeft(0); // Start at 0 for survival timer
    setStats({
      baseAtk: 10,
      atkMultiplier: 1.0,
      comboRate: 0.2,
      maxComboCap: 20,
      critRate: 0.05,
      critDmg: 1.5,
      multishot: 0,
      splashRadius: 0,
      slowEffect: 0,
      atkLevel: 1,
    });
    setShopItems([]);
    setSpecials([]);
    setActivePassives([]);
    setBlocksSpawned(0);
    setBlocksToSpawn(10);
    setBossActive(false);
    setShieldActive(false);
    setTimeSlowActive(false);
    speedRef.current = 5;
    spawnTimerRef.current = 0;
  }, []);

  useEffect(() => {
    setCurrentWord(getRandomWord());
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (gameState !== "playing") return;

    if (lastTimeRef.current !== undefined) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      const effectiveDelta = timeSlowActive ? deltaTime * 0.3 : deltaTime;
      
      // Timer Logic (Survival Mode)
      const isBossWave = wave % 5 === 0;
      
      if (!isBossWave) {
        // Normal wave: count up to 30s
        setTimeLeft(prev => {
          const next = prev + deltaTime;
          if (next >= 30) {
            // Survived 30s, wave complete!
            setGameState("shop");
            generateShop();
            return 30;
          }
          return next;
        });
      }
      // Boss wave: no timer, just defeat the boss

      // Special Timers
      if (shieldActive) {
        shieldTimerRef.current -= deltaTime;
        if (shieldTimerRef.current <= 0) setShieldActive(false);
      }
      if (timeSlowActive) {
        timeSlowTimerRef.current -= deltaTime;
        if (timeSlowTimerRef.current <= 0) setTimeSlowActive(false);
      }

      // Spawn Logic
      if (isBossWave) {
        if (!bossActive && blocksSpawned === 0) {
          spawnBoss();
          setBlocksSpawned(1);
        } else if (bossActive) {
          const boss = blocks.find(b => b.isBoss && b.status === "active");
          if (boss) {
            bossSpawnTimerRef.current += effectiveDelta;
            if (bossSpawnTimerRef.current > 3.0) {
              spawnBlock(true, boss.x, boss.y);
              bossSpawnTimerRef.current = 0;
            }
          } else {
            const bossExists = blocks.some(b => b.isBoss && b.status === "active");
            if (!bossExists) {
               // Boss defeated, wave complete!
               setGameState("shop");
               generateShop();
               return;
            }
          }
        }
      } else {
        // Normal wave: keep spawning blocks
        // Ensure at least 1 enemy is always on field
        const activeEnemies = blocks.filter(b => b.status === "active").length;
        
        if (blocksSpawned < blocksToSpawn) {
          spawnTimerRef.current += effectiveDelta;
          const spawnInterval = Math.max(0.5, 2.0 - (wave * 0.1)); 
          
          // Spawn immediately if no enemies on field, otherwise use timer
          if (activeEnemies === 0 || spawnTimerRef.current > spawnInterval) {
            spawnBlock();
            spawnTimerRef.current = 0;
          }
        } else if (activeEnemies === 0) {
          // All blocks spawned AND no active blocks remaining -> Early Clear!
          const timeBonus = Math.floor((30 - timeLeft) * 5);
          if (timeBonus > 0) {
            setCoins(prev => prev + timeBonus);
          }
          setGameState("shop");
          generateShop();
          return;
        }
        // Note: Normal wave completion is also handled by timer reaching 30s (Survival)
      }

      // Move Blocks
      setBlocks((prevBlocks) => {
        const nextBlocks: Block[] = [];
        let damageToBase = 0;

        prevBlocks.forEach((block) => {
          if (block.status === "destroyed") return;
          
          // Wave-based speed increase
          const waveSpeedMultiplier = 1 + (wave * 0.05); // +5% speed per wave
          let moveSpeed = block.isBoss ? speedRef.current * 0.2 : speedRef.current;
          moveSpeed *= waveSpeedMultiplier;
          if (block.slowed) moveSpeed *= 0.5;
          if (timeSlowActive) moveSpeed *= 0.3;

          const newY = block.y + moveSpeed * effectiveDelta;
          
          if (newY > 95) {
            if (!shieldActive) damageToBase += 10;
            if (block.isBoss) {
               nextBlocks.push({ ...block, y: newY });
            }
          } else {
            nextBlocks.push({ ...block, y: newY });
          }
        });

        if (damageToBase > 0) {
          setBaseHp(prev => {
            const newHp = prev - damageToBase;
            if (newHp <= 0) {
              setGameState("gameover");
              return 0;
            }
            return newHp;
          });
        }
        
        return nextBlocks;
      });

      // Move Projectiles & Handle Collision
      setProjectiles(prevProjs => {
        const nextProjs: Projectile[] = [];
        const hits: { targetId: string; damage: number; isCrit: boolean; isSplash?: boolean }[] = [];

        prevProjs.forEach(p => {
          const target = blocks.find(b => b.id === p.targetId);
          
          if (!target || target.status === "destroyed") return;

          const dx = target.x + (target.isBoss ? 8 : 2) - p.x;
          const dy = target.y + (target.isBoss ? 8 : 2) - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < (target.isBoss ? 10 : 5)) {
            hits.push({ targetId: p.targetId, damage: p.damage, isCrit: p.isCrit, isSplash: p.isSplash });
            
            if (stats.splashRadius > 0 && !p.isSplash) {
              blocks.forEach(b => {
                if (b.id !== target.id && b.status === "active") {
                  const sdx = b.x - target.x;
                  const sdy = b.y - target.y;
                  const sdist = Math.sqrt(sdx*sdx + sdy*sdy);
                  if (sdist < stats.splashRadius) {
                    hits.push({ targetId: b.id, damage: p.damage * 0.5, isCrit: false, isSplash: true });
                  }
                }
              });
            }
          } else {
            const speed = 150 * effectiveDelta;
            const moveX = (dx / dist) * speed;
            const moveY = (dy / dist) * speed;
            nextProjs.push({ ...p, x: p.x + moveX, y: p.y + moveY });
          }
        });

        if (hits.length > 0) {
          setBlocks(prevBlocks => prevBlocks.map(b => {
            const hit = hits.find(h => h.targetId === b.id);
            if (hit) {
              const newHp = Math.floor(b.hp - hit.damage);
              
              setDamageNumbers(prev => [...prev, {
                id: Math.random().toString(),
                x: b.x + (b.isBoss ? 5 : 0),
                y: b.y + (b.isBoss ? 5 : 0),
                value: Math.floor(hit.damage),
                timestamp: Date.now(),
                isCrit: hit.isCrit
              }]);

              if (newHp <= 0 && b.status === "active") {
                setCoins(c => c + getCoinReward(b.isBoss));
              }

              return { 
                ...b, 
                hp: newHp, 
                status: newHp <= 0 ? "destroyed" : "active",
                slowed: stats.slowEffect > 0 || b.slowed
              };
            }
            return b;
          }));
          
          const totalDamage = hits.reduce((acc, h) => acc + h.damage, 0);
          setScore(s => s + Math.floor(totalDamage));
        }

        return nextProjs;
      });
      
      setDamageNumbers(prev => prev.filter(dn => Date.now() - dn.timestamp < 1000));
    }

    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, blocksSpawned, blocksToSpawn, wave, blocks, spawnBlock, spawnBoss, bossActive, generateShop, stats, shieldActive, timeSlowActive, getCoinReward]);

  useEffect(() => {
    if (gameState === "playing") {
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      lastTimeRef.current = undefined;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, gameLoop]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameState !== "playing" && gameState !== "idle" && gameState !== "paused") return;

      // Pause Toggle
      if (e.key === "Escape") {
        if (gameState === "playing") {
          setGameState("paused");
          lastTimeRef.current = undefined; // Stop timer
        } else if (gameState === "paused") {
          setGameState("playing");
          lastTimeRef.current = performance.now(); // Resume timer
        }
        return;
      }

      if (gameState === "paused") return;

      if (gameState === "idle") {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setGameState("playing");
          lastTimeRef.current = performance.now();
        } else {
          return;
        }
      }

      // Special Item Activation
      if (e.key === " ") {
        e.preventDefault();
        // Try to use specials in order: shield, timeslow, nuke
        if (specials.find(s => s.category === "shield" && s.charges > 0)) {
          useSpecial("shield");
        } else if (specials.find(s => s.category === "timeslow" && s.charges > 0)) {
          useSpecial("timeslow");
        } else if (specials.find(s => s.category === "nuke" && s.charges > 0)) {
          useSpecial("nuke");
        }
        return;
      }

      if (e.key === "Backspace") return;
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;

      const char = e.key;
      const nextTyped = typed + char;
      
      if (currentWord.startsWith(nextTyped)) {
        setTyped(nextTyped);
        
        const activeBlocks = blocks.filter(b => b.status === "active");
        const target = activeBlocks.sort((a, b) => b.y - a.y)[0];
        
        if (target) {
          const comboBonus = Math.min(combo * stats.comboRate, stats.maxComboCap);
          let damage = ((stats.baseAtk * stats.atkLevel) + comboBonus) * stats.atkMultiplier;
          
          const isCrit = Math.random() < stats.critRate;
          if (isCrit) damage *= stats.critDmg;
          
          damage = Math.floor(damage);

          // Improved multishot scaling: 100%=3 shots, 200%=4 shots, etc.
          let shots = 1;
          if (stats.multishot >= 1.0) {
            shots = 2 + Math.floor(stats.multishot); // 100%=3, 200%=4, 300%=5
          } else if (stats.multishot > 0) {
            shots = 1 + (Math.random() < stats.multishot ? 1 : 0); // Below 100%: chance for +1
          }

          for (let i = 0; i < shots; i++) {
            setProjectiles(prev => [...prev, {
              id: Math.random().toString(),
              x: 50 + (i * 5),
              y: 90,
              targetId: target.id,
              damage: damage,
              isCrit: isCrit
            }]);
          }
          
          setCombo(prev => {
            const newCombo = prev + 1;
            setMaxCombo(m => Math.max(m, newCombo));
            return newCombo;
          });
        }

        if (nextTyped === currentWord) {
          setCurrentWord(getRandomWord());
          setTyped("");
          setScore(s => s + 50);
        }
      } else {
        setCombo(0);
      }
    },
    [blocks, typed, currentWord, gameState, combo, stats, specials, useSpecial]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
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
    stats, // Export stats for pause menu
  };
};
