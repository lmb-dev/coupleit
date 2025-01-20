import { useState, useEffect } from 'react';
import Keyboard from './keyboard';
import ResultsModal from './results';
import useGameState from '../utils/useGameState';


export default function Game() {
  //#region Load Poem and Local Storage
  const poems: Poem[] = require('../utils/poems.json');
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const currentPoem = poems.find((poem) => poem.id === today);
  
  const { guessedWords, setGuessedWords} = useGameState(today);
  //#endregion


  //#region Game State Logic
  const [guess, setGuess] = useState('');
  const [showResults, setShowResults] = useState(false);

  const isGameOver = guessedWords.some(({ lockedIn }) => lockedIn) || guessedWords.length >= 3;


  const handleSubmit = async () => {
    if (!guess || guessedWords.length >= 3) return;
  
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
  
    const popularity = status === 'rhyme' ? Math.floor(Math.random() * 100) + 1 : undefined;
  
    setGuessedWords((prev) => [...prev, { word: guess, status, popularity }]);
    setGuess('');
  };
  
  useEffect(() => {
    if (guessedWords.length === 3 && !guessedWords.some(({ lockedIn }) => lockedIn)) {
      const finalGuess = guessedWords[guessedWords.length - 1];
      if (finalGuess) {
        lockInAnswer(finalGuess.word);
      }
    }
  }, [guessedWords]);
  
  

  const lockInAnswer = (selectedGuess: string) => {
    setGuessedWords((prev) =>
      prev.map((entry) =>
        entry.word === selectedGuess ? { ...entry, lockedIn: true } : entry
      )
    );
    setShowResults(true);
  };
  
  //#endregion

  //#region Results Sharing
  const generateShareText = () => {
    const lockedInGuess = guessedWords.find(({ lockedIn }) => lockedIn)?.word || 'None';
    const rarestRhymePopularity = guessedWords
      .filter(({ status }) => status === 'rhyme')
      .sort((a, b) => (a.popularity || 0) - (b.popularity || 0))[0]?.popularity || 'None';
    const correctWordFound = guessedWords.some(({ status }) => status === 'correct');
    const guessesUsed = guessedWords.length;
  
    return `Daily Poem Game\n` +
           `Date: ${today}\n` +
           `Guesses used: ${guessesUsed}/3\n` +
           `Rarest rhyme: ${rarestRhymePopularity === 'None' ? 'None' : `${rarestRhymePopularity}%`}\n` +
           `Correct word found: ${correctWordFound ? 'Yes' : 'No'}\n` +
           `Locked in: ${lockedInGuess}`;
  };
  
  
  
  
  //#endregion

  //#region Helpers & Event Handlers
  const parseLine = (line: string) => {
    const regex = /(\*.*?\*|\/.*?\/|[^*/]+)/g;
    const matches = line.match(regex);
    return matches?.map((segment, index) => {
      if (segment.startsWith('*')) {
        return <strong key={index}>{segment.slice(1, -1)}</strong>;
      }
      if (segment.startsWith('/')) {
        return (
          <span key={index} className="underline">
            {guess || '_____'}
          </span>
        );
      }
      return segment;
    });
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
  //#endregion

  if (!currentPoem) return null;

  return (
    <>
      <section className="max-w-2xl w-full p-8 rounded-xl shadow-lg bg-white">
        {/* Game Progress */}
        <div className="mb-4 text-center">
          <p className="text-gray-600">Guesses remaining: {3 - guessedWords.length}/3</p>
          <div className="mt-2 space-y-2">
            {guessedWords.map(({ word, status, popularity, lockedIn }, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm flex items-center justify-center ${
                  lockedIn
                    ? 'bg-yellow-100 text-yellow-800'
                    : status === 'correct'
                    ? 'bg-green-100 text-green-800'
                    : status === 'rhyme'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {word}
                {status === 'correct' && <span className="ml-2">✔️</span>}
                {status === 'rhyme' && (
                  <span className="ml-2 text-xs">{popularity}%</span>
                )}
                {status === 'incorrect' && <span className="ml-2">❌</span>}
                {lockedIn && <span className="ml-2">🔒</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Poem Display */}
        <div className="mb-8 space-y-2 text-xl text-center leading-relaxed">
          {currentPoem.lines.map((line, index) => (
            <p key={index}>{parseLine(line)}</p>
          ))}
        </div>

        {/* Guess Input Display */}
        <div className="p-4 mb-6 border-2 border-gray-200 rounded-lg bg-gray-50 text-center text-2xl font-medium min-h-[60px]">
          {guess || (isGameOver ? 'Game Over' : 'Type your answer...')}
        </div>

        {/* Lock In Button */}
        {!isGameOver &&
          guessedWords
            .slice() // Create a shallow copy of the array to avoid mutating the state
            .reverse() // Reverse the order to prioritize the most recent guess
            .find(({ status }) => status === 'rhyme' || status === 'correct') && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={() =>
                    lockInAnswer(
                      guessedWords
                        .slice()
                        .reverse()
                        .find(({ status }) => status === 'rhyme' || status === 'correct')!.word
                    )
                  }
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Lock In "
                  {
                    guessedWords
                      .slice()
                      .reverse()
                      .find(({ status }) => status === 'rhyme' || status === 'correct')!.word
                  }
                  " as Final Answer
                </button>
              </div>
        )}


        {/* Keyboard */}
        <Keyboard
          isGameOver={isGameOver}
          handleKeyPress={handleKeyPress}
        />

      </section>

      {/* Results Modal */}
      <ResultsModal
        showResults={showResults}
        setShowResults={setShowResults}
        generateShareText={generateShareText}
      />
    </>
  );
}