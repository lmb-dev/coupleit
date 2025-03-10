import { useState, useEffect } from 'react';

interface GameStats {
  wins: number;
  losses: number;
  currentStreak: number;
  longestStreak: number;
  averageGuesses: number;
  completedGames: string[]; // Simple array of completed game IDs
}

const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  currentStreak: 0,
  longestStreak: 0,
  averageGuesses: 0,
  completedGames: [],
};

export default function useStats(today: string) {
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATS;
    
    const savedStats = JSON.parse(localStorage.getItem('poemGameStats') || 'null') || DEFAULT_STATS;
    
    // Add completedGames if it doesn't exist in saved stats - THIS IS A FIX FOR RETURNING USERS
    return {
      ...savedStats,
      completedGames: savedStats.completedGames || []
    };
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
      // Check if this game has already been counted
      const completedGames = prev.completedGames || [];
      if (completedGames.includes(today)) {
        return prev; // Don't update stats if game already completed
      }

      const newStats = { ...prev };
      // Add this game to completed games
      newStats.completedGames = [...newStats.completedGames, today];

      if (won) {
        newStats.wins += 1;
        newStats.currentStreak += 1;
        newStats.longestStreak = Math.max(newStats.longestStreak, newStats.currentStreak);

        // Calculate new average guesses
        const totalGuesses = (prev.averageGuesses * prev.wins) + guesses;
        newStats.averageGuesses = totalGuesses / (prev.wins + 1);
      } else {
        newStats.losses += 1;
        newStats.currentStreak = 0;
      }

      return newStats;
    });
  };

  return { stats, recordGame };
}