interface KeyboardProps {
  isGameOver: boolean;
  handleKeyPress: (key: string) => void;
}

export default function Keyboard({ isGameOver, handleKeyPress }: KeyboardProps) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  return (
    <div className="space-y-1 max-w-xl mx-auto px-4 ">
      {rows.map((row, rowIndex) => (

        <div className={`keyboard flex gap-1 ${rowIndex === 1 ? 'px-[clamp(12px,2vw,24px)]' : ''}`}key={rowIndex}>
          {row.map((key) => {

            const isSpecialKey = key === 'Enter' || key === 'Backspace';

            return (
              <button
                key={key}
                disabled={isGameOver}
                className={`transition active:scale-95 ${isSpecialKey ? 'flex-[2]' : 'flex-1'}`}
                onClick={() => handleKeyPress(key === 'Backspace' ? 'Backspace' : key === 'Enter' ? 'Enter' : key)}
              >
                {key === 'Backspace' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
