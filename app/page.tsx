export const runtime = 'edge';

import GameWrapper from "./components/gameWrapper";
import InfoModal from "./components/modals/info";



export default async function Home() {
  const res = await fetch("https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json", {
    cache: "no-store", 
  });
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const games: GameData[] = await res.json();
  const todaysGame = games.find((game) => game.id === today)!;
  const sortedIds = games.map((game) => game.id).sort();
  const poemNumber = sortedIds.indexOf(todaysGame.id) + 1;

  return (
    <main className="">
      <GameWrapper todaysGame={todaysGame} poemNumber={poemNumber} />
      <InfoModal />
    </main>
  );
}