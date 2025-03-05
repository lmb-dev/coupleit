import React, { useState } from "react";
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import Image from "next/image";
import { ImCross, ImCheckmark } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

interface HintsProps {
  clues: { type: string; text: string }[];
  unlockedClues: { type: string; text: string }[];
  guessedWords: { word: string; status: "incorrect" | "correct" }[];
}

export default function Hints({ clues, unlockedClues, guessedWords }: HintsProps) {
  const [hoveredHint, setHoveredHint] = useState<string | null>(null);

  return (
    <div className="flex justify-center space-x-8 mt-6">
      {/* Left Side - Guessed Words */}
      <div className="flex flex-col space-y-2">
        {[0, 1, 2].map((index) => {
          const guess = guessedWords[index];
          return (
            <AnimatePresence key={index} mode="wait">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { 
                    type: "spring",
                    stiffness: 500,
                    damping: 25
                  }
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`w-24 h-8 flex items-center rounded-full font-semibold 
                  ${guess ? (guess.status === "correct" ? "bg-[var(--g1)] text-black" : "bg-[var(--r1)] text-black") : "bg-[#ccc3b4]"}`}
              >
                {guess ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    >
                      {guess.status === "correct" && <ImCheckmark className="mx-3 text-[var(--g3)] text-xs flex-shrink-0" />}
                      {guess.status === "incorrect" && <ImCross className="mx-3 text-[var(--r3)] text-xs flex-shrink-0" />}
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="truncate font-semibold mr-2"
                    >
                      {guess.word}
                    </motion.span>
                  </>
                ) : (
                  <Image src="/coupleitquill2.webp" alt="Placeholder" width={223} height={329} className="w-4 h-6 mx-auto" />
                )}
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      {/* Right Side - Hints */}
      <div className="flex flex-col space-y-2">
        {clues.map((clue, index) => {
          const isUnlocked = unlockedClues.some((unlocked) => unlocked.text === clue.text);
          const isHovered = hoveredHint === clue.text;

          return (
            <AnimatePresence key={index} mode="wait">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    delay: index * 0.1
                  }
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`w-36 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                  ${isUnlocked ? (isHovered ? "bg-black text-gray-300 uppercase" : "bg-[var(--g1)] text-black cursor-pointer") : "bg-black text-gray-300"}`}
                onMouseEnter={() => isUnlocked && setHoveredHint(clue.text)}
                onMouseLeave={() => isUnlocked && setHoveredHint(null)}
                onClick={() => isUnlocked && setHoveredHint(isHovered ? null : clue.text)}
              >
                {isUnlocked ? (
                  <motion.div className="flex items-center">
                    {isHovered ? <IoLockOpen className="mr-1" /> : null}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {isHovered ? clue.type : clue.text}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div className="flex items-center">
                    <IoLockClosed className="mr-1" />
                    <span className="uppercase">{clue.type}</span>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
}
