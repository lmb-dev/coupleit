import Header from "./components/header";
import Image from 'next/image';
import Game from './components/game';
import InfoModal from "./components/modals/info";
import { formatDateFromId } from "./utils/formatDate";



export default async function Home() {
  const res = await fetch("https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json",
    {
      cache: 'no-store'
    }
  );  
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const games: GameData[] = await res.json();
  const todaysGame = games.find((games) => games.id === today)!;
  const sortedIds = games.map(game => game.id).sort();
  const poemNumber = sortedIds.indexOf(todaysGame.id) + 1;

  return (
    <main className="relative overflow-hidden min-h-screen">
      {/*<Header />*/}
      <InfoModal />
      <div className='welcome text-center justify-center py-4'>
        <Image 
          src="/coupleitquill1.webp" 
          alt="Couple It Quill" 
          width={223} 
          height={329}
          className='w-20 h-28 mx-auto'
        />

        <h1 className="mb-4 text-6xl merienda">Couple It!</h1>

        <p className="text-2xl mb-8 px-12">
          Guess the rhyming word in today&apos;s poem:
        </p>
        
        <section className='r-section space-y-4'>
          <strong className="text-3xl merienda">{todaysGame.poem.title}</strong>
          <p className="text-xl merienda">{todaysGame.poem.author} ({todaysGame.poem.date})</p>
          <Game todaysGame={todaysGame} poemNumber={poemNumber}/>
        </section>

        <p className="mt-8 text-xl font-semibold">{formatDateFromId(todaysGame.id)}</p>
        
        <div className="text-sm mt-2">          
          <p>Edited by James Haikney</p>
          <p>Developed by Louis Bodfield</p>
        </div>


      </div>
    </main>
  );
}