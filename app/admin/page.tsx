'use client'
export const runtime = 'edge';

import React, { useState, useEffect, useRef } from 'react';
import Calendar from './calendar';
import { parseLine } from '../utils/parseLine';



export default function Admin() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [games, setGames] = useState<Map<string, GameData>>(new Map());
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    const fetchGames = async () => {
      const response = await fetch("https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json", {
        cache: "no-store", 
      });
      const data: GameData[] = await response.json();
      const gamesMap = new Map();
      data.forEach(game => gamesMap.set(game.id, game));
      setGames(gamesMap);
    };

    fetchGames();
  }, []);

  const formatSelectedText = (formatChar: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const fullSelectedText = textarea.value.substring(start, end);
    const selectedText = fullSelectedText.trim();
    
    if (selectedText) {
      const startOffset = fullSelectedText.indexOf(selectedText);
      const formattedText = `${formatChar}${selectedText}${formatChar}`;
      
      const newValue = 
        textarea.value.slice(0, start + startOffset) + 
        formattedText + 
        textarea.value.slice(start + startOffset + selectedText.length);
      
      handlePoemChange('lines', newValue.split('\n'));
      
      // Set cursor position after formatting
      setTimeout(() => {
        textarea.setSelectionRange(start + startOffset, start + startOffset + formattedText.length);
        textarea.focus();
      }, 0);
    }
  };

  const setDisplayRangeFromSelection = () => {
    if (!textareaRef.current || !currentGame) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const lines = textarea.value.split('\n');
    const startLine = textarea.value.slice(0, start).split('\n').length-1;
    const endLine = textarea.value.slice(0, end).split('\n').length-1;
    
    handlePoemChange('displayRange', [startLine, endLine]);
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
        clues: Array(3).fill({ type: '', text: '' }),
      });
    }
    setIsEditing(!game); // Edit mode for new games
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

  const handleSave = async () => {
    if (!currentGame) return;
    
    try {
      const newGames = new Map(games);
      newGames.set(selectedDate, currentGame);

      const gamesArray = Array.from(newGames.values());
      
      const response = await fetch('/api/updatePoems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: gamesArray })
      });
  
      if (!response.ok) {
        throw new Error('Failed to save games');
      }
  
      setGames(newGames);
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save game. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        const newGames = new Map(games);
        newGames.delete(selectedDate);
        const gamesArray = Array.from(newGames.values());
  
        const response = await fetch('/api/updatePoems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: gamesArray })
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete game');
        }
  
        setGames(newGames);
        setCurrentGame(null);
        setSelectedDate('');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete game. Please try again.');
      }
    }
  };
  
  return (
    <main className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <Calendar
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        highlightedDates={new Set(games.keys())}
      />

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
                    className="px-4 py-2 bg-[var(--b3)] text-white rounded hover:brightness-90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-[var(--r3)] text-white rounded hover:brightness-90"
                  >
                    Delete
                  </button>
                </>
              )}
              {isEditing && (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-400 text-white rounded hover:brightness-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      handleDateSelect(selectedDate);
                    }}
                    className="px-4 py-2 bg-[var(--y3)] text-white rounded hover:brightness-90"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 ">
              <div className='flex space-x-4'>
                <div className='w-full'>
                  <label className="block mb-2">Title:</label>
                  <input
                    type="text"
                    value={currentGame.poem.title}
                    onChange={(e) => handlePoemChange('title', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className='w-full'>
                  <label className="block mb-2">Author:</label>
                  <input
                    type="text"
                    value={currentGame.poem.author}
                    onChange={(e) => handlePoemChange('author', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className='w-full'>
                  <label className="block mb-2">Date Written:</label>
                  <input
                    type="text"
                    value={currentGame.poem.date}
                    onChange={(e) => handlePoemChange('date', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Poem:</label>
                <div className="relative">
                  <div className="absolute right-0 top-0 mt-1 mr-1 space-x-1">
                    <button 
                      onClick={() => formatSelectedText('*')} 
                      className="bg-blue-100 px-2 py-1 rounded text-xs"
                      title="Surround with *"
                    >
                      *
                    </button>
                    <button 
                      onClick={() => formatSelectedText('/')} 
                      className="bg-blue-100 px-2 py-1 rounded text-xs"
                      title="Surround with /"
                    >
                      /
                    </button>
                    <button 
                      onClick={setDisplayRangeFromSelection} 
                      className="bg-green-100 px-2 py-1 rounded text-xs"
                      title="Set Display Range"
                    >
                      Set Range
                    </button>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={currentGame.poem.lines.join('\n')}
                    onChange={(e) => handlePoemChange('lines', e.target.value.split('\n'))}
                    className="w-full p-2 border rounded"
                    rows={5}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">Display Range (starting from 0):</label>
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

                  </div>
                ))}

              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className='text-xl italic'>
                {currentGame.poem.title} by {currentGame.poem.author} ({currentGame.poem.date})
              </p>
              <div>
                <p className="whitespace-pre-wrap">
                  {parseLine(currentGame.poem.lines.join('\n'), true)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

