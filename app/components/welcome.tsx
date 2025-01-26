import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';

interface WelcomeSectionProps {
  onStartGame: () => void;
}


const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onStartGame }) => {
  
  //#region Load Poem and Local Storage
  const [poems, setPoems] = useState<Poem[]>([]);
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const currentPoem = poems.find((poem) => poem.id === today);

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch('https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json');
        if (response.ok) {
          const data: Poem[] = await response.json();
          setPoems(data);
        } 
    };

    fetchData();
  }, []);


  return (
    <div className='welcome text-center justify-center '>
      <Image 
        src="/coupleitquill1.webp" 
        alt="Couple It Quill" 
        width={223} 
        height={329}
        className='w-24 h-32 mx-auto'
      />

      <h1 className="mb-4">Couple It!</h1>

      <p className="text-[clamp(24px,5vw,32px)] mb-8 px-12">
        Guess the rhyming word in today&apos;s poem:
      </p>
      
      <section className='p-4'>
        <p>{currentPoem?.title}</p>
        <p>{currentPoem?.author}</p>
        <button 
          onClick={onStartGame} 
          className="text-2xl text-white bg-black px-16 py-2 rounded-full max-w-xs mx-auto transition duration-700 ease-in-out hover:scale-105 hover:rotate-3"
        >
          Play
        </button>
      </section>

      <div>
        <p>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <p>Edited by James Haikney</p>
        <p>Developed by Louis Bodfield</p>
      </div>


    </div>
  );
};

export default WelcomeSection;