import { cache } from "react";

export const getPoems = cache(async () => {
  const res = await fetch("https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json", {
    cache: "no-store", 
  });


  return res.json() as Promise<GameData[]>;
});
