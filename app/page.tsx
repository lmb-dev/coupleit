'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Game from "./components/game";
import Header from "./components/header";

export default function Home() {
  const [showGame, setShowGame] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center h-full p-[3vw]">
      <Header />

      <AnimatePresence mode="wait">
        {!showGame ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8, rotate: -10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            <motion.h1
              className="text-7xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              Couple It!
            </motion.h1>
            <motion.p
              className="text-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              Three chances to rhyme the final <strong>word</strong>
              <br /> Find the perfect match or one{" "}
              <strong className="underline">unheard</strong>
            </motion.p>
            <button onClick={() => setShowGame(true)} className="text-2xl text-white bg-black px-16 py-2 rounded-full transition duration-700 ease-in-out hover:scale-105 hover:rotate-3">
              Play
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9, rotate: 10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Game />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}