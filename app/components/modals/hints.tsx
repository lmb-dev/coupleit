import React, { useEffect, useRef } from 'react';
import { ImCross } from 'react-icons/im';
import { motion } from 'framer-motion';


interface HintsModalProps {
  showHintsModal: boolean;
  setShowHintsModal: (show: boolean) => void;
  clues: { type: string; text: string }[]; // All clues
  unlockedClues: { type: string; text: string }[]; // Unlocked clues
}

export default function HintsModal ({ showHintsModal, setShowHintsModal, clues, unlockedClues }: HintsModalProps) {
  
  // #region Popup Close
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowHintsModal(false);
      }
    };

    if (showHintsModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHintsModal, setShowHintsModal]);
  // #endregion  
  
  
  return (
    showHintsModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-white p-4 rounded-lg max-w-lg w-5/6 relative"
        >
          <h2 className="text-2xl font-bold mb-4">Hints</h2>
          <div className="space-y-4">
            {clues.map((clue, index) => {
              const isUnlocked = unlockedClues.some(
                (unlockedClue) => unlockedClue.text === clue.text && unlockedClue.type === clue.type
              );

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    isUnlocked ? 'bg-gray-100 text-gray-800' : 'bg-gray-300 text-gray-500 blur-sm'
                  }`}
                >
                  <span className="font-semibold">{clue.type}:</span>{' '}
                  {isUnlocked ? clue.text : 'Clue locked'}
                </div>
              );
            })}
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={() => setShowHintsModal(false)} className="text-gray-400">
              <ImCross/>
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

