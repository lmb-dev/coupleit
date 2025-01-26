import React, { useState, useEffect } from "react";
import { IoLockClosed } from "react-icons/io5";

interface HintsProps {
  clues: { type: string; text: string }[]; // All clues
  unlockedClues: { type: string; text: string }[]; // Unlocked clues
}

export default function HintsModal({ clues, unlockedClues }: HintsProps) {
  const [activeClueIndex, setActiveClueIndex] = useState<number | null>(null);

  const handleClueClick = (index: number, isUnlocked: boolean) => {
    if (isUnlocked) {
      setActiveClueIndex((prev) => (prev === index ? null : index));
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const key = event.key;
    const index = parseInt(key, 10) - 1; // Convert number key to array index (1-based to 0-based)
    if (!isNaN(index) && index >= 0 && index < clues.length) {
      const isUnlocked = unlockedClues.some(
        (unlockedClue) =>
          unlockedClue.text === clues[index].text &&
          unlockedClue.type === clues[index].type
      );
      if (isUnlocked) {
        setActiveClueIndex((prev) => (prev === index ? null : index));
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [clues, unlockedClues]);

  return (
    <div className="mt-6 space-y-4 flex flex-col items-center">
      <div className="flex space-x-4 justify-center items-center">
        <h3 className="font-bold">Hints:</h3>
        {clues.map((clue, index) => {
          const isUnlocked = unlockedClues.some(
            (unlockedClue) =>
              unlockedClue.text === clue.text && unlockedClue.type === clue.type
          );

          return (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center border rounded-lg cursor-pointer transition-all
                 ${isUnlocked ? "bg-gray-100 text-gray-800" : "bg-gray-300 text-gray-500"} 
                 ${activeClueIndex === index ? "border-2 border-gray-800" : "border"}`}
              onClick={() => handleClueClick(index, isUnlocked)}
            >
              {isUnlocked ? (
                <span className="text-lg font-bold">{index + 1}</span>
              ) : (
                <IoLockClosed size={16} className="flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
      {activeClueIndex !== null && (
        <div className="mt-4 p-4 bg-gray-100 text-gray-800 rounded-lg">
          <span className="font-semibold">{clues[activeClueIndex].type}:</span> {clues[activeClueIndex].text}
        </div>
      )}
    </div>
  );
}
