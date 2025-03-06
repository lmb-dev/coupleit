'use client'
import { useState, useEffect } from 'react';
import Keyboard from './keyboard';
import ResultsModal from './modals/results';
import Hints from './hints';
import { useAnalytics } from '../utils/analytics';
import useStats from "../utils/useStats";
import useGameState from '../utils/useGameState';
import { parseLine } from '../utils/parseLine';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface GameProps {
  todaysGame: GameData;
  poemNumber: number;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Game({ todaysGame, poemNumber, setGameStarted }: GameProps) {  
  const { sendEvent } = useAnalytics(); 
  const { stats, recordGame } = useStats(todaysGame.id);

  const { guessedWords, setGuessedWords } = useGameState(todaysGame.id);
  
  const [guess, setGuess] = useState('');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [animatingGuess, setAnimatingGuess] = useState<string | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
  };
  
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const isGameOver = guessedWords.some(({ status }) => status === 'correct') || guessedWords.length >= 4;
  
  useEffect(() => {
    if (isGameOver) {
      setShowResultsModal(true);
  
      sendEvent('game_completed', {
        poem_id: todaysGame.id,
        success: guessedWords.some(({ status }) => status === 'correct'),
        guesses_used: guessedWords.length,
      });
  
      recordGame(guessedWords.some(({ status }) => status === 'correct'), guessedWords.length);
    }
  }, [isGameOver]);
  
  

  const handleSubmit = async () => {
    if (!guess || isGameOver) return;

    if (guess.length < 2) {
      showError("Invalid Word");
      return;
    }

    if (guessedWords.some(({ word }) => word.toLowerCase() === guess.toLowerCase())) {
      showError("Duplicate Guess");
      return;
    }

    const wordCheckResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`);
    if (!wordCheckResponse.ok) {
      showError("Invalid Word");
      return;
    }

    const correctWord = todaysGame?.poem.lines.join('\n').match(/\/(.+?)\//)?.[1];
    const isCorrect = guess.toLowerCase() === correctWord?.toLowerCase();

    if (!isCorrect) {
      setAnimatingGuess(guess);
      setGuess('');
    } else {
      setGuessedWords((prev) => [...prev, { word: guess, status: 'correct' }]);
      setGuess('');
    }
  };

  const handleKeyPress = (key: string) => {
    if (isGameOver || animatingGuess) return;
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

  const handleAnimationComplete = () => {
    if (animatingGuess) {
      setGuessedWords((prev) => [...prev, { word: animatingGuess, status: 'incorrect' }]);
      setAnimatingGuess(null);
    } 
  };

  return (
    <section>
      <div className="bg-[var(--y1)] flex-grow min-h-screen overflow-auto py-2">
        <Image 
          src="/coupleitquill1.webp" 
          alt="Couple It Quill" 
          width={223} 
          height={329}
          className='w-8 h-12 mx-auto hover:cursor-pointer'
          onClick={() => setGameStarted(false)}
        />

        <div className="my-2 y-section text-base lg:text-lg text-left">
          {todaysGame.poem.lines
            .slice(todaysGame.poem.displayRange[0], todaysGame.poem.displayRange[1] + 1)
            .map((line, index) => (
              <p key={index} className='lg:px-[33vw]'>
                {parseLine(line, false, isGameOver ? todaysGame?.poem.lines.join('\n').match(/\/(.+?)\//)?.[1] : guess)}
              </p>
            ))}
          
          <p className="merienda text-right text-sm mt-4 lg:px-[33vw]">
            {todaysGame.poem.title} - {todaysGame.poem.author}
          </p>
        </div>

        <div className="flex justify-center min-h-[40px]">
          {errorMessage && (
            <div className="bg-[var(--tx1)] text-[var(--tx2)] py-2 px-4 rounded-lg text-sm font-semibold inline-block text-center"> 
              {errorMessage}
            </div>
          )}
        </div>

        <div className="border-b-4 p-2 border-black mb-6 text-2xl text-center max-w-72 md:max-w-sm mx-auto">
          {isGameOver ? (
            <button onClick={() => setShowResultsModal(true)} className="font-bold">
              VIEW RESULTS
            </button>
          ) : (
            <div className="min-h-[1.5rem]">
              {animatingGuess ? (
                <motion.div
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: [1, 1, 0], x: [0, -5, 5, -5, 5, -3, 3, 0, 0] }}
                  transition={{ times: [0, 0.4, 1], duration: 0.8 }}
                  onAnimationComplete={handleAnimationComplete}
                  className="relative"
                >
                  {animatingGuess}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.2 }}
                    className="absolute left-0 top-1/2 h-[2px] bg-black w-full origin-left"
                  />
                </motion.div>
              ) : (
                <span>{guess || '\u00A0'}</span>
              )}
            </div>
          )}
        </div>

        <Keyboard isGameOver={isGameOver} handleKeyPress={handleKeyPress} />
        <Hints clues={todaysGame.clues} unlockedClues={todaysGame.clues.slice(0, guessedWords.filter(({ status }) => status !== "correct").length)} guessedWords={guessedWords.filter(({ status }) => status !== "correct")} />
      </div>

      <ResultsModal showResultsModal={showResultsModal} setShowResultsModal={setShowResultsModal} guessedWords={guessedWords} todaysGame={todaysGame} poemNumber={poemNumber} />
    </section>
  );
}
