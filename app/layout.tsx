import { Lora, Merienda } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const lora = Lora({ subsets: ["latin"] });
const merienda = Merienda({ subsets: ["latin"], variable: "--merienda" });

export async function generateMetadata(): Promise<Metadata> {  
  return {
    title: "Couple It!",
    description: await fetchDynamicDescription(),
  };
};


export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${lora.className} ${merienda.variable}`}>
        {children}
      </body>
    </html>
  );
}



//#region Dynamic Metadata
const fetchDynamicDescription = async (): Promise<string> => {
  
  const response = await fetch("https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json", {
    cache: "no-store", 
  });
  const poems: GameData[] = await response.json();
  
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');  
  const todaysGame = poems.find(poem => poem.id === today);
  return todaysGame 
    ? `Guess the rhyming word in today's poem: "${todaysGame.poem.title}" by ${todaysGame.poem.author}`
    : "Guess today's rhyming word!";
};
//#endregion
