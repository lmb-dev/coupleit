'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Game from "./components/game";
import Header from "./components/header";
import WelcomeSection from "./components/welcome";

export default function Home() {
  const [showGame, setShowGame] = useState<boolean>(false);

  return (
    <main>
      <Header />
      <AnimatePresence mode="wait">
        {!showGame ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8, rotate: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <WelcomeSection onStartGame={() => setShowGame(true)} />
            </motion.div>

        ) : (

          <motion.div
            key="game"
            initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Game />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}