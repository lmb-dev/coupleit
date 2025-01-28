'use client'
import { useState } from "react";
import InfoModal from "./modals/info";


export default function Header() {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleInfoBoxClick = () => {
    setShowInfoModal(true);
  };

  return (
    <header className="grid grid-cols-2">
      
      {/* Logo Section */}
      <h4 className="font-semibold">Couple It!</h4>



      {/* Info Button */}
      <div className="flex justify-end">
        <button onClick={handleInfoBoxClick}>Info</button>
      </div>
      

      <InfoModal showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal}/>
    </header>
  );
}
