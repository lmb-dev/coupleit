import { useState, useEffect } from 'react';

interface CompletedGame {
  id: string;
  guesses: number;
  won: boolean;
}

interface GameStats {
  currentStreak: number;
  longestStreak: number;
  completedGames: CompletedGame[];
}

const DEFAULT_STATS: GameStats = {
  currentStreak: 0,
  longestStreak: 0,
  completedGames: [],
};

// Helper function to get yesterday's date in the same format as today (YYYYMMDD)
const getYesterday = (today: string): string => {
  const date = new Date(
    Number(today.substring(0, 4)),
    Number(today.substring(4, 6)) - 1,
    Number(today.substring(6, 8))
  );

  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10).replace(/-/g, '');
};

export default function useStats(today: string) {
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATS;

    const savedStats = JSON.parse(localStorage.getItem('poemGameStats') || 'null') || DEFAULT_STATS;

    return {
      ...savedStats,
      completedGames: savedStats.completedGames || [],
    };
  });

  // Reset streak if a new day starts but isn't continuous
  useEffect(() => {
    const savedGameState = localStorage.getItem('poemGame');
    if (savedGameState) {
      const gameState = JSON.parse(savedGameState);
      if (gameState.date !== today) {
        const yesterday = getYesterday(today);
        const playedYesterday = stats.completedGames.some(game => game.id === yesterday);

        setStats(prev => ({ ...prev, currentStreak: playedYesterday ? prev.currentStreak : 0 }));
      }
    }
  }, [today]);

  // Persist stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('poemGameStats', JSON.stringify(stats));
  }, [stats]);

  // Function to update stats when a game is completed
  const recordGame = (won: boolean, guesses: number) => {
    setStats(prev => {
      if (prev.completedGames.some(game => game.id === today)) return prev; // Prevent duplicate entries

      const completedGames = [...prev.completedGames, { id: today, guesses, won }];

      const yesterday = getYesterday(today);
      const playedYesterday = prev.completedGames.some(game => game.id === yesterday);

      const currentStreak = won ? (playedYesterday ? prev.currentStreak + 1 : 1) : 0;
      const longestStreak = Math.max(prev.longestStreak, currentStreak);

      return { currentStreak, longestStreak, completedGames };
    });
  };

  return { recordGame }; // No need to return stats since it's just for localStorage
}
