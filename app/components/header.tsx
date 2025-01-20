

export default function Header() {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr]">
      
      {/* Logo Section */}
      <h4 className="font-semibold">Couple It!</h4>

      {/* Date Section */}
      <nav className="flex space-x-[2vw]">
        <p>{new Date().toLocaleDateString("en-GB")}</p>
      </nav>

      {/* Info Button */}
      <div className="flex justify-end">
        <button className="">Info</button>
      </div>
      
    </header>
  );
}
