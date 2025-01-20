
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
    <div className="space-y-1 mb-6">
      {rows.map((row, rowIndex) => (
        <div className="flex justify-center gap-1" key={rowIndex}>
          {row.map((key) => {
            const isSpecialKey = key === 'Enter' || key === 'Backspace';
            return (
              <button
                key={key}
                disabled={isGameOver}
                className={`${
                  isSpecialKey ? 'px-4 w-20' : 'px-3 aspect-square'
                } py-3 text-sm font-medium ${
                  isGameOver
                    ? 'bg-gray-400'
                    : 'bg-gray-800 hover:bg-gray-700'
                } text-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 uppercase disabled:cursor-not-allowed`}
                onClick={() =>
                  handleKeyPress(
                    key === 'Backspace' ? 'Backspace' : key === 'Enter' ? 'Enter' : key
                  )
                }
              >
                {key === 'Backspace' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

