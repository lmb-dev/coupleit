'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ImCross } from 'react-icons/im';
import { motion } from 'framer-motion';
import { HiQuestionMarkCircle } from "react-icons/hi";

export default function InfoModal() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowInfoModal(false);
      }
    };

    if (showInfoModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfoModal]);

  return (
    <>
      {/* Question Mark Icon Button */}
      <button
        className="fixed top-2 left-2 z-40  hover:text-gray-700 text-3xl"
        onClick={() => setShowInfoModal(true)}
      >
        <HiQuestionMarkCircle />
      </button>

      {/* Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50  flex justify-center items-center bg-gray-900 bg-opacity-50">
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-[var(--b1)] rounded-xl max-w-lg w-full relative py-8 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-4xl font-bold merienda text-center p-4">How to Play</h2>
            
            <ul className="b-section space-y-4 mb-4">
              <li>📜 <strong>Read the Poem:</strong> A word is missing—can you find it?</li>
              <li>🔍 <strong>Find the Rhyme:</strong> A <strong>bolded word</strong> gives you a hint.</li>
              <li>🎯 <strong>Make Your Guess:</strong> Type in the missing word and submit.</li>
              <li>💡 <strong>Unlock Hints:</strong> Every wrong guess reveals a clue.</li>
              <li>🏆 <strong>Win the Round:</strong> Keep going until you find the perfect fit!</li>
            </ul>

            <div className="text-sm my-4 text-center">          
              <p>Edited by James Haikney</p>
              <p>Developed by Louis Bodfield</p>
            </div>

            <div className="flex justify-center absolute top-4 right-4  space-x-4">
              <button onClick={() => setShowInfoModal(false)} className="text-gray-800">
                <ImCross/>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
