'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Game from "./components/game";
import Header from "./components/header";
import WelcomeSection from "./components/welcome";

//Server-Side Fetching

export default function Home() {
  const [showGame, setShowGame] = useState<boolean>(false);

  return (
    <main className="relative overflow-hidden h-[100dvh]">
      <Header />
      <WelcomeSection onStartGame={() => setShowGame(true)} />
      <AnimatePresence>
        {showGame && (
          <motion.div 
            className="fixed inset-0 z-10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Game />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}