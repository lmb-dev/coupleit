export const runtime = 'edge';

import { redirect } from "next/navigation";
import GameWrapper from "./components/gameWrapper";
import InfoModal from "./components/modals/info";
import { getPoems } from "./utils/fetchPoems";


export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const games = await getPoems();

  // Extract the game ID from the URL or default to today's date, or choose random game if 'r' is passed
  let gameId =
    typeof searchParams.game === "string"
      ? searchParams.game
      : new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // If 'r' is passed, choose a random game
  if (gameId === "r") {
    const randomIndex = Math.floor(Math.random() * games.length);
    gameId = games[randomIndex].id;
  }

  // Try to find the selected game or fallback to today's game if not found
  const selectedGame = games.find((game) => game.id === gameId) || games.find((game) => game.id === new Date().toISOString().slice(0, 10).replace(/-/g, ""))!;

  if (!selectedGame) {
    redirect('/404');
  }

  const sortedIds = games.map((game) => game.id).sort();
  const poemNumber = sortedIds.indexOf(selectedGame.id) + 1;

  return (
    <main className="">
      <GameWrapper todaysGame={selectedGame} poemNumber={poemNumber} />
      <InfoModal />
    </main>
  );
}