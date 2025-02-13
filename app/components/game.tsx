'use client'
import { useState, useEffect } from 'react';
import Keyboard from './keyboard';
import ResultsModal from './modals/results';
import Hints from './hints';
import useGameState from '../utils/useGameState';
import { parseLine } from '../utils/parseLine';
import Image from 'next/image';

interface GameProps {
  todaysGame: GameData;
  poemNumber: number;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>; // Receive setter
}

export default function Game({ todaysGame, poemNumber, setGameStarted }: GameProps) {
  const { guessedWords, setGuessedWords } = useGameState(todaysGame.id);
  
  const [guess, setGuess] = useState('');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 2000);
  };


  const isGameOver = guessedWords.some(({ status }) => status === 'correct') || guessedWords.length >= 4;

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

    const status: 'incorrect' | 'correct' = isCorrect ? 'correct' : 'incorrect';
    setGuessedWords((prev) => [...prev, { word: guess, status }]);
    setGuess('');

    if (isCorrect || guessedWords.length + 1 >= 4) {
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

  return (
    <section>
      <div className="bg-[var(--y1)] flex-grow min-h-screen overflow-auto py-2">
        <Image 
          src="/coupleitquill1.webp" 
          alt="Couple It Quill" 
          width={223} 
          height={329}
          className='w-8 h-12 mx-auto hover:cursor-pointer'
          onClick={() => setGameStarted(false)} // Set gameStarted to false, bringing back the intro screen
        />

        <div className="my-2 y-section text-lg text-left">
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



        <div className="border-b-4 p-2 border-black  mb-6 text-2xl text-center max-w-72 md:max-w-sm mx-auto">
          {guess || (isGameOver ? (
            <button onClick={() => setShowResultsModal(true)} className="font-bold">
              VIEW RESULTS
            </button>
          ) : '\u00A0')}
        </div>

        <Keyboard isGameOver={isGameOver} handleKeyPress={handleKeyPress} />

        <Hints clues={todaysGame.clues} unlockedClues={todaysGame.clues.slice(0, guessedWords.filter(({ status }) => status !== "correct").length)} guessedWords={guessedWords.filter(({ status }) => status !== "correct")}/>
      </div>
   

      <ResultsModal
        showResultsModal={showResultsModal}
        setShowResultsModal={setShowResultsModal}
        guessedWords={guessedWords}
        todaysGame={todaysGame}
        poemNumber={poemNumber}
      />
    </section>
  );
}
