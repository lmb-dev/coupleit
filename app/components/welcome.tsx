import React from 'react';
import { motion } from "framer-motion";

interface WelcomeSectionProps {
  onStartGame: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onStartGame }) => {
  return (
    <section className='h-[clamp(2px,80vh,80vh)] text-center space-y-8 justify-center flex flex-col p-[3vw]'>
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
      <button 
        onClick={onStartGame} 
        className="text-2xl text-white bg-black px-16 py-2 rounded-full max-w-xs mx-auto transition duration-700 ease-in-out hover:scale-105 hover:rotate-3"
      >
        Play
      </button>
    </section>
  );
};

export default WelcomeSection;