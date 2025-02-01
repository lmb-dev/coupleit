export const runtime = 'edge';

export async function GET() {
  const res = await fetch("https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json");
  const games: GameData[] = await res.json();
  
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const todaysGame = games.find((game) => game.id === today);

  if (!todaysGame) {
    return new Response(JSON.stringify({ error: "Poem not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ poem: todaysGame }), { status: 200 });
}
