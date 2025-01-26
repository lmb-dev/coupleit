import { parseLine } from '../../utils/parseLine';
import React, { useEffect, useRef, useState } from 'react';
import { ImCross, ImCopy } from "react-icons/im";
import { motion } from 'framer-motion';

interface ResultsModalProps {
  showResultsModal: boolean;
  setShowResultsModal: React.Dispatch<React.SetStateAction<boolean>>;
  guessedWords: {
    word: string;
    status: 'incorrect' | 'rhyme' | 'correct';
  }[];
  currentPoem: Poem | null;
  isGameOver: boolean;
}

export default function ResultsModal({showResultsModal, setShowResultsModal, guessedWords, currentPoem, isGameOver}: ResultsModalProps) {
  const [copyStatus, setCopyStatus] = useState<string>("Copy");

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

  // Helper function to convert text to italic Unicode characters
  const toItalicUnicode = (text: string): string => {
    const charMap: Record<string, string> = {
      A: '\u{1D434}', B: '\u{1D435}', C: '\u{1D436}', D: '\u{1D437}', E: '\u{1D438}',
      F: '\u{1D439}', G: '\u{1D43A}', H: '\u{1D43B}', I: '\u{1D43C}', J: '\u{1D43D}',
      K: '\u{1D43E}', L: '\u{1D43F}', M: '\u{1D440}', N: '\u{1D441}', O: '\u{1D442}',
      P: '\u{1D443}', Q: '\u{1D444}', R: '\u{1D445}', S: '\u{1D446}', T: '\u{1D447}',
      U: '\u{1D448}', V: '\u{1D449}', W: '\u{1D44A}', X: '\u{1D44B}', Y: '\u{1D44C}', Z: '\u{1D44D}',
      a: '\u{1D44E}', b: '\u{1D44F}', c: '\u{1D450}', d: '\u{1D451}', e: '\u{1D452}',
      f: '\u{1D453}', g: '\u{1D454}', h: '\u{210E}',  i: '\u{1D456}', j: '\u{1D457}',
      k: '\u{1D458}', l: '\u{1D459}', m: '\u{1D45A}', n: '\u{1D45B}', o: '\u{1D45C}',
      p: '\u{1D45D}', q: '\u{1D45E}', r: '\u{1D45F}', s: '\u{1D460}', t: '\u{1D461}',
      u: '\u{1D462}', v: '\u{1D463}', w: '\u{1D464}', x: '\u{1D465}', y: '\u{1D466}', z: '\u{1D467}',
    };

    return text.split('').map(char => charMap[char] || char).join('');
  };

  // Generate shareable text
  const generateShareText = () => {
    if (!currentPoem || !isGameOver) return '';

    const guessesUsed = guessedWords.length;
    const maxGuesses = 4;

    // Generate guesses as emojis
    const guessesEmojis = Array.from({ length: maxGuesses }, (_, i) => {
      if (i < guessesUsed) return guessedWords[i].status === 'correct' ? '📗' : '📕'; 
      return '🕮'; 
    }).join('');
    

    // Generate the couplet with formatting removed
    const couplet = Array.from(
      { length: currentPoem.displayRange[1] - currentPoem.displayRange[0] + 1 },
      (_, i) => i + currentPoem.displayRange[0]
    )
      .map((lineIndex) =>
        currentPoem.lines[lineIndex].replace(/\*/g, '').replace(/\/(.*?)\//g, (_, match) => '_'.repeat(match.length)) // Remove * and /
      )
      .join('\n');

    const date = new Date().toLocaleDateString("en-GB");

    return toItalicUnicode(`✨🌟 Couple It! 🌟✨\n${date}\n\n${couplet}\n\nGuesses: ${guessesEmojis}`);
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    const shareText = generateShareText();
    if (shareText) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => setCopyStatus('Copied!'))
        .catch(() => setCopyStatus('Failed!'));
    }
  };

  return (
    showResultsModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-white p-4 rounded-lg max-w-lg w-5/6 relative"
        >

          <h2 className="text-2xl font-bold mb-4 text-center">Couplet Complete!</h2>
          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap relative">
              {generateShareText()}
              <div className="absolute top-4 right-4 flex items-center space-x-2 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors">
                <ImCopy size={20} onClick={handleCopyText} />
                <span onClick={handleCopyText}>{copyStatus}</span>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">
              {currentPoem?.title} by {currentPoem?.author}
            </h3>
            <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
              {currentPoem?.lines.map((line, index) => (
                <p key={index} className="leading-6">{parseLine(line, true)}</p>
              ))}
            </div>
          </div>
          <div className="flex justify-center absolute top-4 right-4  space-x-4">
            <button
              onClick={() => setShowResultsModal(false)}
              className="text-gray-400"
            >
              <ImCross/>
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
}
