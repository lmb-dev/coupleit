import React from 'react';
import { ImCross } from 'react-icons/im';

interface HintsModalProps {
  showHintsModal: boolean;
  setShowHintsModal: (show: boolean) => void;
  clues: { type: string; text: string }[]; // All clues
  unlockedClues: { type: string; text: string }[]; // Unlocked clues
}

const HintsModal: React.FC<HintsModalProps> = ({ showHintsModal, setShowHintsModal, clues, unlockedClues }) => {
  if (!showHintsModal) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
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
        <div className=" absolute top-4 right-4">
          <button
            onClick={() => setShowHintsModal(false)}
            className="text-gray-400"
          >
            <ImCross/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintsModal;
