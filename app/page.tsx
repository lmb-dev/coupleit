'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Game from "./components/game";
import Header from "./components/header";

export default function Home() {
  const [showGame, setShowGame] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center h-full">
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
            <motion.button
              onClick={() => setShowGame(true)}
              className="text-2xl text-white bg-black px-16 py-2 rounded-full transition"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Play
            </motion.button>
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