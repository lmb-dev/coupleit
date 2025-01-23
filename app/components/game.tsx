import { useState, useEffect } from 'react';
import Keyboard from './keyboard';
import ResultsModal from './results';
import HintsModal from './hints';
import useGameState from '../utils/useGameState';
import {parseLine} from '../utils/parseLine';

import { ImCross, ImCheckmark, ImMusic   } from "react-icons/im";


export default function Game() {
  //#region Load Poem and Local Storage
  const poems: Poem[] = require('../utils/poems.json');
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const currentPoem = poems.find((poem) => poem.id === today);

  const { guessedWords, setGuessedWords } = useGameState(today);
  //#endregion

  //#region Game State Logic
  const [guess, setGuess] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);

  const isGameOver =
    guessedWords.some(({ status }) => status === 'correct') || guessedWords.length >= 4;

  const handleSubmit = async () => {
    if (!guess || isGameOver) return;

    const correctWord = currentPoem?.lines.join('\n').match(/\/(.+?)\//)?.[1];
    const rhymeWord = currentPoem?.lines.join('\n').match(/\*(.+?)\*/)?.[1];

    if (!correctWord || !rhymeWord) return;

    const isCorrect = guess.toLowerCase() === correctWord.toLowerCase();

    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${rhymeWord}`);
    const rhymes: { word: string }[] = await response.json();
    const isRhyme = rhymes.some(({ word }) => word.toLowerCase() === guess.toLowerCase());

    const status: 'incorrect' | 'rhyme' | 'correct' = isCorrect
      ? 'correct'
      : isRhyme
      ? 'rhyme'
      : 'incorrect';

    setGuessedWords((prev) => [...prev, { word: guess, status }]);
    setGuess('');

    if (isCorrect) {
      setShowResults(true);
    }
  };
  //#endregion

  //#region Helpers & Event Handlers


  const handleKeyPress = (key: string) => {
    if (isGameOver) return;
    console.log(key);
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
  //#endregion

  const handleHintBoxClick = () => {
    setShowHintsModal(true);
  };

  if (!currentPoem) return null;

  return (
    <section className="w-[100vw] p-[3vw]">
      {/* Game Progress */}
      <div className="mb-4 text-center">
        <p className="text-gray-600">Guesses remaining: {4 - guessedWords.length}/4</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {guessedWords.map(({ word, status }, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-sm flex items-center justify-center ${
                status === 'correct'
                  ? 'bg-green-100 text-green-800'
                  : status === 'rhyme'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {word}
              {status === 'correct' && <ImCheckmark className='ml-2'/>}
              {status === 'rhyme' && <ImMusic className='ml-2'/>}
              {status === 'incorrect' && <ImCross className='ml-2'/>}
            </span>
          ))}
        </div>
      </div>

      {/* Poem Display */}
      <div className="my-[4vh] space-y-2 text-xl text-center">
        {Array.from(
          { length: currentPoem.displayRange[1] - currentPoem.displayRange[0] + 1 },
          (_, i) => i + currentPoem.displayRange[0]
        ).map((lineIndex) => (
          <p key={lineIndex}>{parseLine(currentPoem.lines[lineIndex], false, guess)}</p>
        ))}
      </div>

      {/* Guess Input Display */}
      <div className="p-4 mb-6 border-2 border-gray-200 rounded-lg bg-gray-50 text-center text-xl max-w-lg mx-auto font-medium min-h-[60px]">
        {guess || (isGameOver ? 'Game Over' : 'Type your answer...')}
      </div>

      {/* Keyboard */}
      <Keyboard isGameOver={isGameOver} handleKeyPress={handleKeyPress} />

      {/* Hint Box */}
      <div
        title="Hints"
        onClick={handleHintBoxClick}
        className="absolute bottom-4 left-4 p-3 bg-gray-200 rounded-full cursor-pointer text-blue-500"
      >
        ?
      </div>

      {/* Button to Reopen Results Modal */}
      {isGameOver && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowResults(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            View Results
          </button>
        </div>
      )}


      {/* Results Modal */}
      <ResultsModal
        showResults={showResults}
        setShowResults={setShowResults}
        guessedWords={guessedWords}
        currentPoem={currentPoem}
        isGameOver={isGameOver}
      />

      {/* Hints Modal */}
      <HintsModal
        showHintsModal={showHintsModal}
        setShowHintsModal={setShowHintsModal}
        clues={currentPoem.clues}
        unlockedClues={currentPoem.clues.slice(0, guessedWords.length)}
      />
    </section>

  );
}
