import { useState, useEffect, useCallback } from "react";
import { getRandomWord } from "@/lib/words";

export type GameState = "idle" | "playing" | "finished";

export const useTypingEngine = () => {
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Scoring System
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [errors, setErrors] = useState(0);

  const resetGame = useCallback(() => {
    setText(getRandomWord());
    setCursor(0);
    setGameState("idle");
    setStartTime(null);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setErrors(0);
  }, []);

  const nextWord = useCallback(() => {
    setText(getRandomWord());
    setCursor(0);
  }, []);

  // Initial load
  useEffect(() => {
    setText(getRandomWord());
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default behavior for some keys
      if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }

      if (gameState === "idle") {
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
          return;
        }
        setGameState("playing");
        setStartTime(Date.now());
      }

      if (e.key === "Backspace") {
        return; // Disable backspace
      }

      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const char = e.key;
      const expectedChar = text[cursor];

      if (char === expectedChar) {
        // Correct Key
        setCursor((prev) => prev + 1);
        
        // Combo & Score Logic
        // Base points per char = 10
        // Multiplier = 1 + (combo * 0.1)
        // Inflation: Let's make it more exponential?
        // Simple Inflation: Score += (10 + combo * 5)
        setCombo((prev) => {
          const newCombo = prev + 1;
          setMaxCombo(m => Math.max(m, newCombo));
          return newCombo;
        });
        
        setScore((prev) => prev + (10 + combo * 10)); // Linear inflation for now, feels good

        if (cursor + 1 === text.length) {
          // Word Completed
          // Bonus for word completion?
          setScore((prev) => prev + (100 + combo * 20));
          nextWord();
        }
      } else {
        // Incorrect Key
        setErrors((prev) => prev + 1);
        setCombo(0); // Reset combo!
      }
    },
    [cursor, gameState, text, nextWord, combo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    text,
    cursor,
    gameState,
    score,
    combo,
    maxCombo,
    errors,
    resetGame,
  };
};
