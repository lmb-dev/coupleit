//----POEM DATA----
interface Poem {
  id: string;
  lines: string[];
}

interface GameState {
  guessedWords: {
    word: string;
    status: 'incorrect' | 'rhyme' | 'correct';
    popularity?: number;
    lockedIn?: boolean;
  }[];
  date: string;
}

