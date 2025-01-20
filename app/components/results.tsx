
interface ResultsModalProps {
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  generateShareText: () => string;
}

export default function ResultsModal ({ showResults, setShowResults, generateShareText }: ResultsModalProps){
  
  return (
    showResults && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl max-w-md w-full m-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Game Over</h2>
          <div className="mb-6">
            <p className="mb-4">Here&apos;s your result to share:</p>
            <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
              {generateShareText()}
            </pre>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigator.clipboard.writeText(generateShareText())}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setShowResults(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

