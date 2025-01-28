import { parseLine } from '../../utils/parseLine';
import React, { useEffect, useRef, useState } from 'react';
import { ImCross, ImCopy } from "react-icons/im";
import { motion } from 'framer-motion';
import { formatDateFromId } from '@/app/utils/formatDate';

interface ResultsModalProps {
  showResultsModal: boolean;
  setShowResultsModal: React.Dispatch<React.SetStateAction<boolean>>;
  guessedWords: {
    word: string;
    status: 'incorrect' | 'correct';
  }[];
  todaysGame: GameData;
  poemNumber: number;
}

export default function ResultsModal({showResultsModal, setShowResultsModal, guessedWords, todaysGame, poemNumber}: ResultsModalProps) {
  const [copyStatus, setCopyStatus] = useState<string>("Share Your Result");
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const guessesUsed = guessedWords.length;
  const maxGuesses = 4;

  // Generate guesses as emojis
  const guessesEmojis = Array.from({ length: maxGuesses }, (_, i) => {
    if (i < guessesUsed) return guessedWords[i].status === 'correct' ? '📗' : '📕'; 
    return '📖'; 
  }).join('');

  // Copy results to clipboard
  const handleCopyText = () => {
    const poemLines = todaysGame?.poem.lines
    .slice(todaysGame.poem.displayRange[0], todaysGame.poem.displayRange[1] + 1) // Slice based on displayRange
    .map(line => 
      line
        .replace(/\/.*?\//g, '____') // Replace text between / with ____
        .replace(/\*/g, '')          // Hide asterisks
    )
    .join('\n') || '';
    const textToCopy = `You Coupled It!\nCouple It #${String(poemNumber).padStart(3, "0")} / ${formatDateFromId(todaysGame?.id)}\n${guessesEmojis}\nGood work! You used ${guessesUsed} ${guessesUsed === 1 ? 'guess' : 'guesses'}\n\n${poemLines}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Share Your Result"), 2000);
    }).catch(() => {
      setCopyStatus("Failed to Copy");
    });
  };
  

  // #region Popup Close
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowResultsModal(false);
      }
    };

    if (showResultsModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResultsModal, setShowResultsModal]);
  // #endregion  

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextUTCReset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
      const diff = nextUTCReset.getTime() - now.getTime();

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
      
      setTimeRemaining(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    showResultsModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-[var(--g1)] rounded-xl max-w-lg w-full relative py-8"
        >
          <h2 className="text-4xl font-bold mb-4 merienda text-center">You Coupled It!</h2>
          <p className='merienda'>Couple It #{String(poemNumber).padStart(3, "0")} / {formatDateFromId(todaysGame?.id)}</p>
          <p className='text-4xl'>{guessesEmojis}</p>
          <p>Good work! You used {guessesUsed} {guessesUsed === 1 ? 'guess' : 'guesses'}</p>
          
          <div 
            className="my-6 rounded-full merienda justify-center flex items-center cursor-pointer text-xl p-2 max-w-72 mx-auto text-white bg-black"
            onClick={handleCopyText}
          >
            <ImCopy className="mr-2" />
            <span>{copyStatus}</span>
          </div>

          <div className="mb-6 g-section">
            <div className="text-left max-h-24 overflow-y-auto">
              {todaysGame?.poem.lines.map((line, index) => (
                <p key={index}>{parseLine(line, true)}</p>
              ))}
            </div>
            <h3 className="text-sm text-right mt-2 merienda">
              {todaysGame?.poem.title} - {todaysGame?.poem.author}
            </h3>
          </div>

          <div className="text-center mt-6">
            <h3 className="text-xl">Next Poem In:</h3>
            <p className="text-2xl font-bold">{timeRemaining}</p>
          </div>

          <div className="flex justify-center absolute top-4 right-4  space-x-4">
            <button onClick={() => setShowResultsModal(false)} className="text-gray-800">
              <ImCross/>
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}