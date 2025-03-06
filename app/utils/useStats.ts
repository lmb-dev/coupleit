import { useState, useEffect } from 'react';

interface GameStats {
  wins: number;
  losses: number;
  currentStreak: number;
  longestStreak: number;
  averageGuesses: number;
}

const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  currentStreak: 0,
  longestStreak: 0,
  averageGuesses: 0, // Now storing average directly
};

export default function useStats(today: string) {
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATS;
    return JSON.parse(localStorage.getItem('poemGameStats') || 'null') ?? DEFAULT_STATS;
  });

  // Reset current streak if the stored game date doesn't match today's date.
  useEffect(() => {
    const savedGameState = localStorage.getItem('poemGame');
    if (savedGameState) {
      const gameState = JSON.parse(savedGameState);
      if (gameState.date !== today && stats.currentStreak !== 0) {
        setStats(prev => ({ ...prev, currentStreak: 0 }));
      }
    }
  }, [today, stats.currentStreak]);

  // Persist stats to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem('poemGameStats', JSON.stringify(stats));
  }, [stats]);

  // Update stats based on the outcome of a game.
  const recordGame = (won: boolean, guesses: number) => {
    setStats(prev => {
      const newStats = { ...prev };

      if (won) {
        newStats.wins += 1;
        newStats.currentStreak += 1;
        newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak);

        // Calculate new average guesses
        newStats.averageGuesses =
          newStats.wins === 1
            ? guesses // First win, just use this guess count
            : (prev.averageGuesses * (prev.wins - 1) + guesses) / prev.wins;
      } else {
        newStats.losses += 1;
        newStats.currentStreak = 0;
      }

      return newStats;
    });
  };

  return { stats, recordGame };
}
