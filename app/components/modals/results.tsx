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
  const [isExpanded, setIsExpanded] = useState(false);


  const guessesUsed = guessedWords.length;
  const maxGuesses = 4;
  const hasCorrectGuess = guessedWords.some(guess => guess.status === 'correct');


  // Generate guesses as emojis
  const guessesEmojis = Array.from({ length: maxGuesses }, (_, i) => {
    if (i < guessesUsed) return guessedWords[i].status === 'correct' ? '📗' : '📕'; 
    return '📖'; 
  }).join('');

  // Copy results to clipboard
  const handleCopyText = () => {

    const textToCopy = `Couple It #${String(poemNumber).padStart(3, "0")} / ${formatDateFromId(todaysGame?.id)}\n${todaysGame?.poem.title} - ${todaysGame?.poem.author}\n${guessesEmojis}\ncoupleit.com`;
    
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
          className={`bg-[${hasCorrectGuess ? 'var(--g1)' : 'var(--r1)'}] rounded-xl max-w-lg text-center w-full relative py-8 max-h-[90vh] overflow-y-auto`}
        >
          <h2 className="text-4xl font-bold merienda text-center">{hasCorrectGuess ? "You Coupled It!" : "Bad luck!"}</h2>

          <div className="space-y-2 my-6">
            <p className="merienda">Couple It #{String(poemNumber).padStart(3, "0")} / {formatDateFromId(todaysGame?.id)}</p>
            <p className="text-4xl">{guessesEmojis}</p>
            <p>{hasCorrectGuess ? `Good work! You used ${guessesUsed} ${guessesUsed === 1 ? 'guess' : 'guesses'}` : "Today you didn't couple it in 4 guesses"}</p>
            
            <div onClick={handleCopyText} className="rounded-full merienda justify-center flex items-center cursor-pointer text-xl p-2 max-w-72 mx-auto text-white bg-black">
              <ImCopy className="mr-2" />
              <span>{copyStatus}</span>
            </div>          
          </div>

          {/* Clickable Poem Section */}
          <div className={`mb-6 cursor-pointer ${hasCorrectGuess ? 'g-section' : 'r-section'} `} onClick={() => setIsExpanded(!isExpanded)}>
            <h3 className="text-sm text-right mt-2 merienda">
              {todaysGame?.poem.title} - {todaysGame?.poem.author}
            </h3>            
            <div 
              className={`text-left whitespace-pre-wrap ${
                isExpanded ? "max-h-full" : "max-h-24 overflow-hidden"
              }`}
            >
              {todaysGame?.poem.lines.map((line, index) => (
                line === "" ? <br key={index} /> : <p key={index}>{parseLine(line, true)}</p>
              ))}
            </div>
            <p className='mt-2 italic text-xs'>Click to expand</p>
          </div>


          <div className="text-center mt-6">
            <h3 className="text-xl">Next Poem In:</h3>
            <p className="text-2xl font-bold">{timeRemaining}</p>
          </div>

          <div className="flex justify-center absolute top-4 right-4 space-x-4">
            <button onClick={() => setShowResultsModal(false)} className="text-gray-800">
              <ImCross/>
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}