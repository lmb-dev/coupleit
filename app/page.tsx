export const runtime = 'edge';

import Image from 'next/image';
import Game from './components/game';
import InfoModal from "./components/modals/info";
import { formatDateFromId } from "./utils/formatDate";


export default async function Home() {
  const res = await fetch("https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json", {
    cache: "no-store", 
  });
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const games: GameData[] = await res.json();
  const todaysGame = games.find((games) => games.id === today)!;
  const sortedIds = games.map(game => game.id).sort();
  const poemNumber = sortedIds.indexOf(todaysGame.id) + 1;

  return (
    <main className="welcome py-4">
      <Image 
        src="/coupleitquill1.webp" 
        alt="Couple It Quill" 
        width={223} 
        height={329}
        className='w-14 h-18 mx-auto'
      />

      <h1 className="text-5xl merienda mb-8">Couple It!</h1>

      <p className="text-2xl px-12 mb-4">
        Guess the rhyming word in today&apos;s poem:
      </p>
      
      <section className='r-section space-y-4'>
        <strong className="text-3xl merienda">{todaysGame.poem.title}</strong>
        <p className="text-xl merienda">{todaysGame.poem.author} ({todaysGame.poem.date})</p>
        <Game todaysGame={todaysGame} poemNumber={poemNumber}/>
      </section>

      <p className="text-xl font-semibold mt-8 ">{formatDateFromId(todaysGame.id)}</p>
      
      <div className="text-sm mt-2">          
        <p>Edited by James Haikney</p>
        <p>Developed by Louis Bodfield</p>
      </div>

      <InfoModal />

    </main>
  );
}