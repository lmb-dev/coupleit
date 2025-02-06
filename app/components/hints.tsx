import React from "react";
import { IoLockClosed } from "react-icons/io5";
import Image from "next/image";
import { ImCross, ImCheckmark, ImMusic } from "react-icons/im";

interface HintsProps {
  clues: { type: string; text: string }[];
  unlockedClues: { type: string; text: string }[];
  guessedWords: { word: string; status: "incorrect" | "correct" }[];
}

export default function Hints({ clues, unlockedClues, guessedWords }: HintsProps) {
  return (
    <div className="flex justify-center space-x-8 mt-6">
      
      {/* Left Side - Guessed Words */}
      <div className="flex flex-col space-y-2">
        {[0, 1, 2].map((index) => {
          const guess = guessedWords[index];
          return (
            <div
              key={index}
              className={`w-24 h-8 flex items-center justify-center rounded-full text-sm font-semibold 
                ${guess ? (guess.status === "correct" ? "bg-[var(--g1)] text-black" : "bg-[var(--r1)] text-black") : "bg-[#ccc3b4]"}`}
            >
              {guess ? (
                <>
                  {guess.status === "correct" && <ImCheckmark className="mr-2 text-[var(--g3)]"/>}
                  {guess.status === "incorrect" && <ImCross className="mr-2 text-[var(--r3)]" />}
                  {guess.word}
                </>
              ) : (
                <Image src="/coupleitquill2.webp" alt="Placeholder" width={223} height={329} className="w-4 h-6"/>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Right Side - Hints */}
      <div className="flex flex-col space-y-2">
        {clues.map((clue, index) => {
          const isUnlocked = unlockedClues.some((unlocked) => unlocked.text === clue.text);
          return (
            <div
              key={index}
              className={`w-36 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                ${isUnlocked ? "bg-[var(--g1)] text-black" : "bg-black text-gray-300"}`}
            >
              {isUnlocked ? clue.text : (
                <>
                  <IoLockClosed className="mr-1" />
                  <span className="uppercase">{clue.type}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
