'use client'
import React, { useState, useEffect } from 'react';



const Admin: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [games, setGames] = useState<Map<string, GameData>>(new Map());
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json');
        if (!response.ok) throw new Error('Failed to fetch poems');
        const data: GameData[] = await response.json();
        const gamesMap = new Map();
        data.forEach(game => gamesMap.set(game.id, game));
        setGames(gamesMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isDateHighlighted = (date: string): boolean => {
    return games.has(date);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const game = games.get(date);
    if (game) {
      setCurrentGame(game);
    } else {
      // Initialize new game with empty values
      setCurrentGame({
        id: date,
        poem: {
          title: '',
          author: '',
          date: '',
          lines: [],
          displayRange: [1, 1]
        },
        clues: []
      });
    }
    setIsEditing(!game); // Edit mode for new games
  };

  const handleAddClue = () => {
    if (!currentGame) return;
    setCurrentGame({
      ...currentGame,
      clues: [...currentGame.clues, { type: '', text: '' }]
    });
  };

  const handleRemoveClue = (index: number) => {
    if (!currentGame) return;
    const newClues = currentGame.clues.filter((_, i) => i !== index);
    setCurrentGame({
      ...currentGame,
      clues: newClues
    });
  };

  const handleClueChange = (index: number, field: 'type' | 'text', value: string) => {
    if (!currentGame) return;
    const newClues = currentGame.clues.map((clue, i) => {
      if (i === index) {
        return { ...clue, [field]: value };
      }
      return clue;
    });
    setCurrentGame({
      ...currentGame,
      clues: newClues
    });
  };

  const handlePoemChange = (field: keyof Poem, value: string | string[] | [number, number]) => {
    if (!currentGame) return;
    setCurrentGame({
      ...currentGame,
      poem: {
        ...currentGame.poem,
        [field]: value
      }
    });
  };

  const handleSave = () => {
    if (!currentGame) return;
    const newGames = new Map(games);
    newGames.set(selectedDate, currentGame);
    setGames(newGames);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      const newGames = new Map(games);
      newGames.delete(selectedDate);
      setGames(newGames);
      setCurrentGame(null);
    }
  };
  
  return (
    <main className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Game Admin Panel</h1>

      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous Month
        </button>
        <h2 className="text-xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
          })}{' '}
          {currentYear}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next Month
        </button>
      </div>

      <div className="mb-6 grid grid-cols-7 gap-2">
        {Array.from(
          { length: getDaysInMonth(currentMonth, currentYear) },
          (_, i) => {
            const day = i + 1;
            const date = formatDate(currentYear, currentMonth, day);
            return (
              <button
                key={date}
                className={`p-2 rounded ${
                  isDateHighlighted(date) ? 'bg-teal-500 text-white' : 'bg-gray-200'
                } ${selectedDate === date ? 'ring-2 ring-teal-700' : ''}`}
                onClick={() => handleDateSelect(date)}
              >
                {day}
              </button>
            );
          }
        )}
      </div>

      {selectedDate && currentGame && (
        <div className="mt-4 border rounded-lg p-6 bg-white shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">
              {games.has(selectedDate) ? 'Edit Game' : 'New Game'} - {selectedDate}
            </h3>
            <div className="space-x-2">
              {games.has(selectedDate) && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
              {isEditing && (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      handleDateSelect(selectedDate);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 ">
              <div>
                <label className="block mb-2">Title:</label>
                <input
                  type="text"
                  value={currentGame.poem.title}
                  onChange={(e) => handlePoemChange('title', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Author:</label>
                <input
                  type="text"
                  value={currentGame.poem.author}
                  onChange={(e) => handlePoemChange('author', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Date Written:</label>
                <input
                  type="text"
                  value={currentGame.poem.date}
                  onChange={(e) => handlePoemChange('date', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. 1980"
                />
              </div>
              <div>
                <label className="block mb-2">Poem Lines (one per line):</label>
                <textarea
                  value={currentGame.poem.lines.join('\n')}
                  onChange={(e) => handlePoemChange('lines', e.target.value.split('\n'))}
                  className="w-full p-2 border rounded"
                  rows={5}
                />
              </div>
              <div>
                <label className="block mb-2">Display Range:</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={currentGame.poem.displayRange[0]}
                    onChange={(e) => handlePoemChange('displayRange', [parseInt(e.target.value), currentGame.poem.displayRange[1]])}
                    className="w-24 p-2 border rounded"
                    min="1"
                  />
                  <span className="self-center">to</span>
                  <input
                    type="number"
                    value={currentGame.poem.displayRange[1]}
                    onChange={(e) => handlePoemChange('displayRange', [currentGame.poem.displayRange[0], parseInt(e.target.value)])}
                    className="w-24 p-2 border rounded"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Clues:</label>
                {currentGame.clues.map((clue, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={clue.type}
                      onChange={(e) => handleClueChange(index, 'type', e.target.value)}
                      placeholder="Type"
                      className="w-1/4 p-2 border rounded"
                    />
                    <input
                      type="text"
                      value={clue.text}
                      onChange={(e) => handleClueChange(index, 'text', e.target.value)}
                      placeholder="Text"
                      className="w-2/3 p-2 border rounded"
                    />
                    <button
                      onClick={() => handleRemoveClue(index)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddClue}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Clue
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <strong>Title:</strong> {currentGame.poem.title}
              </div>
              <div>
                <strong>Author:</strong> {currentGame.poem.author}
              </div>
              <div>
                <strong>Date Written:</strong> {currentGame.poem.date}
              </div>
              <div>
                <strong>Lines:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded">
                  {currentGame.poem.lines.join('\n')}
                </pre>
              </div>
              <div>
                <strong>Display Range:</strong> {currentGame.poem.displayRange[0]} to{' '}
                {currentGame.poem.displayRange[1]}
              </div>
              <div>
                <strong>Clues:</strong>
                <ul className="mt-2 space-y-2">
                  {currentGame.clues.map((clue, index) => (
                    <li key={index}>
                      <strong>{clue.type}:</strong> {clue.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Admin;