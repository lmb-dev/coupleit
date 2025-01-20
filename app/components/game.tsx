'use client';
import { useState, useEffect } from 'react';

export default function Game() {
  //#region Load Today's Poem
  const poems: Poem[] = require('../utils/poems.json');
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const currentPoem = poems.find((poem) => poem.id === today) as Poem;
  //#endregion

  //#region Submit Logic
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    const correctWord = currentPoem.lines.join('\n').match(/\/(.+?)\//)?.[1];
    const rhymeWord = currentPoem.lines.join('\n').match(/\*(.+?)\*/)?.[1];
    console.log(guess);

    if (guess.toLowerCase() === correctWord?.toLowerCase()) {
      setFeedback('Correct! You guessed the hidden word.');
      return;
    }

    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${rhymeWord}`);
    const rhymes: { word: string }[] = await response.json();

    const isRhyme = rhymes.some(({ word }) => word.toLowerCase() === guess.toLowerCase());
    setFeedback(isRhyme ? 'Valid rhyme! Nice try.' : 'Not a valid rhyme or correct word.');
    setGuess('');
  };
  //#endregion

  //#region Helpers
  const parseLine = (line: string) => {
    const regex = /(\*.*?\*|\/.*?\/|[^*/]+)/g;
    return line.match(regex)?.map((segment, index) => {
      if (segment.startsWith('*')) {
        return <strong key={index}>{segment.slice(1, -1)}</strong>; // Bold for rhyming hints
      }
      if (segment.startsWith('/')) {
        return (
          <span key={index} className="underline">
            {guess || '_____'}
          </span> // Replace '_____' with the current guess
        );
      }
      return segment;
    });
  };

  const handleKeyPress = (key: string) => {
    if (key === 'Backspace') {
      setGuess((prev) => prev.slice(0, -1));
    } else if (key === 'Enter') {
      handleSubmit();
    } else if (/^[a-zA-Z]$/.test(key)) {
      setGuess((prev) => prev + key.toLowerCase());
    }
  };
  //#endregion

  //#region Event Handlers
  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      handleKeyPress(event.key);
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => {
      window.removeEventListener('keydown', handlePhysicalKeyPress);
    };
  }, []);
  //#endregion

  if (!currentPoem) {
    return null;
  }

  return (
    <section className="max-w-2xl w-full p-8 rounded-xl shadow-lg bg-white">
      {/* Poem Display */}
      <div className="mb-8 space-y-2 text-xl text-center leading-relaxed">
        {currentPoem.lines.map((line, index) => (
          <p key={index}>{parseLine(line)}</p>
        ))}
      </div>

      {/* Guess Input Display */}
      <div className="p-4 mb-6 border-2 border-gray-200 rounded-lg bg-gray-50 text-center text-2xl font-medium min-h-[60px]">
        {guess || 'Type your answer...'}
      </div>

      {/* Keyboard */}
      <div className="space-y-2 mb-6">
        {[
          ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
          ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
          ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
        ].map((row, rowIndex) => (
          <div className="flex justify-center gap-1" key={rowIndex}>
            {row.map((key) => {
              const isSpecialKey = key === 'Enter' || key === 'Backspace';
              return (
                <button
                  key={key}
                  className={`
                    ${isSpecialKey ? 'px-4 w-20' : 'px-3 aspect-square'}
                    py-3
                    text-sm font-medium
                    bg-gray-800 hover:bg-gray-700
                    text-white
                    rounded-lg
                    transition-all
                    shadow-sm
                    hover:shadow-md
                    active:scale-95
                    uppercase
                  `}
                  onClick={() =>
                    handleKeyPress(key === 'Backspace' ? 'Backspace' : key === 'Enter' ? 'Enter' : key)
                  }
                >
                  {key === 'Backspace' ? '←' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div className={`
          p-4 rounded-lg text-center font-medium
          ${feedback.includes('Correct') 
            ? 'bg-green-100 text-green-800' 
            : feedback.includes('Valid') 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-red-100 text-red-800'
          }
        `}>
          {feedback}
        </div>
      )}
    </section>
  );
}