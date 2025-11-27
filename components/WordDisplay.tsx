import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordDisplayProps {
  text: string;
  cursor: number;
  className?: string;
}

export const WordDisplay = ({ text, cursor, className }: WordDisplayProps) => {
  return (
    <div className={cn("font-mono text-2xl leading-relaxed break-all", className)}>
      {text.split("").map((char, index) => {
        const isTyped = index < cursor;
        const isCurrent = index === cursor;

        return (
          <span
            key={index}
            className={cn(
              "relative transition-colors duration-100",
              isTyped ? "text-primary" : "text-muted",
              isCurrent && "text-text"
            )}
          >
            {isCurrent && (
              <motion.span
                layoutId="cursor"
                className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-secondary"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            {char}
          </span>
        );
      })}
    </div>
  );
};
