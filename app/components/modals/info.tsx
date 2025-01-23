import React, { useEffect, useRef } from 'react';
import { ImCross } from 'react-icons/im';
import { motion } from 'framer-motion';


interface InfoModalProps {
  showInfoModal: boolean;
  setShowInfoModal: (show: boolean) => void;
}

export default function InfoModal ({ showInfoModal, setShowInfoModal }: InfoModalProps) {
  
  // #region Popup Close
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
  }, [showInfoModal, setShowInfoModal]);
  // #endregion  
  
  
  return (
    showInfoModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
        <motion.div
          ref={popupRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-white p-4 rounded-lg max-w-lg w-5/6 relative"
        >
            <h2 className="text-2xl font-bold mb-4">Info</h2>
            <div className="space-y-4">
              <p>lorem ipsum </p>
            </div>
          <div className=" absolute top-4 right-4">
            <button onClick={() => setShowInfoModal(false)} className="text-gray-400">
              <ImCross/>
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

