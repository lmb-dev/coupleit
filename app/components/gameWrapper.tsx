"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Game from "./game";
import { formatDateFromId } from "../utils/formatDate";

export default function GameWrapper({ todaysGame, poemNumber }: { todaysGame: GameData; poemNumber: number }) {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = ""; 
    }

    return () => {
      document.body.style.overflow = ""; 
    };
  }, [gameStarted]);

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Game is always rendered underneath */}
      <Game 
        todaysGame={todaysGame} 
        poemNumber={poemNumber} 
        setGameStarted={setGameStarted} 
      />

      {/* Overlay Intro Screen */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: gameStarted ? "-100vh" : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full h-full bg-[var(--r1)] overflow-auto flex flex-col items-center justify-center z-30 text-center"
      >
        <img 
          src="/coupleitquill1.webp" 
          alt="Couple It Quill" 
          width={223} 
          height={329}
          className="w-14 h-18 mx-auto"
        />
        
        <h1 className="text-5xl merienda mb-8">Couple It!</h1>
        <p className="text-2xl px-12 mb-4">Guess the rhyming word in today&apos;s poem:</p>
        
        <section className="r-section w-full space-y-4">
          <strong className="text-3xl merienda">{todaysGame.poem.title}</strong>
          <p className="text-xl merienda">{todaysGame.poem.author} ({todaysGame.poem.date})</p>
          <button
            onClick={() => setGameStarted(true)}
            className="text-2xl text-white bg-black px-16 py-2 rounded-full max-w-xs mx-auto"
          >
            Play
          </button>      
        </section>

        <p className="text-xl font-semibold mt-8">{formatDateFromId(todaysGame.id)}</p>
        
        <div className="text-sm mt-2">          
          <p>Edited by James Haikney</p>
          <p>Developed by Louis Bodfield</p>
        </div>
      </motion.div>
    </div>
  );
}
