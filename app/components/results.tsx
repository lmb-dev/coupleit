import { line } from 'framer-motion/client';
import { parseLine } from '../utils/parseLine';
import React, { useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai'; // Import React Icon
import { ImCross } from "react-icons/im";


interface ResultsModalProps {
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  guessedWords: {
    word: string;
    status: 'incorrect' | 'rhyme' | 'correct';
  }[];
  currentPoem: Poem | null;
  isGameOver: boolean;
}

export default function ResultsModal({
  showResults,
  setShowResults,
  guessedWords,
  currentPoem,
  isGameOver,
}: ResultsModalProps) {
  const [copyStatus, setCopyStatus] = useState<string>("Copy");

  // Generate shareable text
  const generateShareText = () => {
    if (!currentPoem || !isGameOver) return '';

    const correctIndex = guessedWords.findIndex(({ status }) => status === 'correct');
    const guessesUsed = guessedWords.length;
    const maxGuesses = 4;

    // Generate guesses as emojis
    const guessesEmojis = Array.from({ length: maxGuesses }, (_, i) => {
      if (i < correctIndex) return '❌'; // Incorrect guesses
      if (i === correctIndex) return '✅'; // Correct guess
      if (i < guessesUsed) return '⚪'; // Guesses after correct
      return '⚪'; // Remaining unused guesses
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

    return `✨🌟 Couple It! 🌟✨\n${date}\n\n${couplet}\n\nGuesses: ${guessesEmojis}`;
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
    showResults && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl max-w-md w-full m-4 relative">


          <h2 className="text-2xl font-bold mb-4 text-center">Couplet Complete!</h2>
          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-lg italic whitespace-pre-wrap relative">
              {generateShareText()}
              <div className="absolute top-4 right-4 flex items-center space-x-2 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors">
                <AiOutlineCopy size={20} onClick={handleCopyText} />
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
              onClick={() => setShowResults(false)}
              className="text-gray-400"
            >
              <ImCross/>
            </button>
          </div>
        </div>
      </div>
    )
  );
}
