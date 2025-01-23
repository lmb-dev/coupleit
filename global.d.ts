//----POEM DATA----
interface Poem {
  id: string; 
  title: string;
  author: string; 
  lines: string[];
  displayRange: [number, number]; 
  clues: { type: 'Synonym' | 'First Letter' | 'Anagram'; text: string }[];
}


interface GameState {
  guessedWords: {
    word: string;
    status: 'incorrect' | 'rhyme' | 'correct';
  }[];
  date: string;
}