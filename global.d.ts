interface GameData {
  id: string;
  poem: Poem;
  clues: { type: string; text: string }[];
}

interface Poem {
  title: string;
  author: string; 
  date: string; 
  lines: string[];
  displayRange: [number, number]; 
}


interface GameState {
  guessedWords: {
    word: string;
    status: 'incorrect' | 'correct';
  }[];
  date: string;
}