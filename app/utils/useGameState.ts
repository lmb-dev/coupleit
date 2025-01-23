import { useState, useEffect } from 'react';

export default function useGameState(today: string) {
  const [guessedWords, setGuessedWords] = useState<GameState['guessedWords']>([]);

  useEffect(() => {
    const loadState = () => {
      const savedState = localStorage.getItem('poemGame');
      if (savedState) {
        const state: GameState = JSON.parse(savedState);
        if (state.date === today) {
          setGuessedWords(state.guessedWords);
        }
      }
    };
    loadState();
  }, [today]);

  useEffect(() => {
    if (guessedWords.length > 0) {
      const saveState = () => {
        const state: GameState = { guessedWords, date: today };
        localStorage.setItem('poemGame', JSON.stringify(state));
      };
      saveState();
    }
  }, [guessedWords, today]);

  return { guessedWords, setGuessedWords };
}