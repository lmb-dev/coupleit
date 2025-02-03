'use client'
import { useState, useEffect } from 'react';
import Keyboard from './keyboard';
import ResultsModal from './modals/results';
import Hints from './hints';
import useGameState from '../utils/useGameState';
import { parseLine } from '../utils/parseLine';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface GameProps {
  todaysGame: GameData;
  poemNumber: number;
}

export default function Game({ todaysGame, poemNumber }: GameProps) {
  const { guessedWords, setGuessedWords } = useGameState(todaysGame.id);
  
  const [guess, setGuess] = useState('');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showGame, setShowGame] = useState<boolean>(false);

  const isGameOver = guessedWords.some(({ status }) => status === 'correct') || guessedWords.length >= 4;

  const handleSubmit = async () => {
    if (!guess || isGameOver) return;

    const wordCheckResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`);
    if (!wordCheckResponse.ok || guess.length < 2 || guessedWords.some(({ word }) => word.toLowerCase() === guess.toLowerCase())) {
      return;
    }

    const correctWord = todaysGame?.poem.lines.join('\n').match(/\/(.+?)\//)?.[1];
    const isCorrect = guess.toLowerCase() === correctWord?.toLowerCase();

    const status: 'incorrect' | 'correct' = isCorrect ? 'correct' : 'incorrect';
    setGuessedWords((prev) => [...prev, { word: guess, status }]);
    setGuess('');

    if (isCorrect) {
      setShowResultsModal(true);
    }
  };

  const handleKeyPress = (key: string) => {
    if (isGameOver) return;
    if (key === 'Backspace') {
      setGuess((prev) => prev.slice(0, -1));
    } else if (key === 'Enter') {
      handleSubmit();
    } else if (/^[a-zA-Z]$/.test(key)) {
      setGuess((prev) => prev + key.toLowerCase());
    }
  };

  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (showGame) {
      document.body.style.overflow = 'hidden';  // Disable scrolling on the body
    } else {
      document.body.style.overflow = '';  // Enable scrolling when the game is closed
    }
    return () => {
      document.body.style.overflow = '';  // Clean up on unmount
    };
  }, [showGame]);

  return (
    <div className="text-center">
      <button
        onClick={() => setShowGame((prev) => !prev)}
        className="text-2xl text-white bg-black px-16 py-2 rounded-full max-w-xs mx-auto"
        disabled={showGame}
      >
        Play
      </button>

      <AnimatePresence>
      {showGame && (
        <motion.div
          className="fixed inset-0 z-10 overflow-hidden bg-black bg-opacity-80"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            height: '100svh', // Fill the entire viewport height
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Ensure the content is properly spaced vertically
          }}
        >
          <div className="bg-[var(--y1)] flex-grow overflow-auto py-2">
            <Image 
              src="/coupleitquill1.webp" 
              alt="Couple It Quill" 
              width={223} 
              height={329}
              className='w-8 h-12 mx-auto'
              onClick={() => setShowGame(false)}
            />

            <div className="my-2 y-section text-lg text-left">
              {todaysGame.poem.lines
                .slice(todaysGame.poem.displayRange[0], todaysGame.poem.displayRange[1] + 1)
                .map((line, index) => (
                  <p key={index} className='lg:px-[33vw]'>
                    {parseLine(line, false, isGameOver ? guessedWords[guessedWords.length - 1].word : guess)}
                  </p>
                ))}
              
              <p className="merienda text-right text-sm mt-4 lg:px-[33vw]">
                {todaysGame.poem.title} - {todaysGame.poem.author}
              </p>
            </div>

            <div className="border-b-4 p-2 border-black my-12 text-center text-3xl max-w-72 md:max-w-sm mx-auto">
              {guess || (isGameOver ? (
                <button
                  onClick={() => setShowResultsModal(true)}
                  className="font-bold"
                >
                  VIEW RESULTS
                </button>
              ) : '\u00A0')}
            </div>

            <Keyboard isGameOver={isGameOver} handleKeyPress={handleKeyPress} />

            <Hints
              clues={todaysGame.clues}
              unlockedClues={todaysGame.clues.slice(0, guessedWords.filter(({ status }) => status !== "correct").length)}
              guessedWords={guessedWords.filter(({ status }) => status !== "correct")}
            />

            <ResultsModal
              showResultsModal={showResultsModal}
              setShowResultsModal={setShowResultsModal}
              guessedWords={guessedWords}
              todaysGame={todaysGame}
              poemNumber={poemNumber}
            />
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
