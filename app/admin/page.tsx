'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0 = January
  const [newPoem, setNewPoem] = useState<Partial<Poem>>({
    id: '',
    title: '',
    author: '',
    lines: [],
    displayRange: [0, 0],
    clues: [],
  });

  // #region Helper Functions
  const isLeapYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const getDaysInMonth = (month: number, year: number) => {
    const daysPerMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysPerMonth[month];
  };

  const formatDate = (year: number, month: number, day: number) =>
    `${year}${(month + 1).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  // #endregion

  // #region R2 Data Functions
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://pub-c69f6032f7494f389caf8f27e64853d3.r2.dev/poems.json',
        { cache: 'no-cache' }
      );
      const data: Poem[] = await response.json();
      setPoems(data);
    };

    fetchData();
  }, []);

  const saveDataToR2 = async () => {
    await fetch('/api/updatePoems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: poems,
      }),
    });
  };

  const addPoem = () => {
    if (!newPoem.id || !newPoem.title || !newPoem.author || !newPoem.lines) {
      alert('Please fill in all fields for the poem.');
      return;
    }

    setPoems([...poems, newPoem as Poem]);
    saveDataToR2();
    setNewPoem({ id: '', title: '', author: '', lines: [], displayRange: [0, 0], clues: [] });
    setSelectedDate(null);
  };

  const isDateHighlighted = (date: string) =>
    poems.some((poem) => poem.id === date);
  // #endregion

  // #region Navigation Functions
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); // December
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonth((month) => month - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); // January
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonth((month) => month + 1);
    }
  };
  // #endregion

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Month and Year Navigation */}
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

      {/* Calendar UI */}
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
                onClick={() => setSelectedDate(date)}
              >
                {day}
              </button>
            );
          }
        )}
      </div>

      {/* Poem Input Section */}
      {selectedDate && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add/Edit Poem for {selectedDate}</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newPoem.title || ''}
              onChange={(e) => setNewPoem({ ...newPoem, id: selectedDate, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              value={newPoem.author || ''}
              onChange={(e) => setNewPoem({ ...newPoem, author: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Lines (comma-separated)</label>
            <textarea
              value={newPoem.lines?.join(', ') || ''}
              onChange={(e) =>
                setNewPoem({ ...newPoem, lines: e.target.value.split(',').map((line) => line.trim()) })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Clues</label>
            <textarea
              placeholder="Type:Text, one per line"
              onChange={(e) =>
                setNewPoem({
                  ...newPoem,
                  clues: e.target.value
                    .split('\n')
                    .map((line) => {
                      const [type, text] = line.split(':');
                      return { type: type.trim(), text: text.trim() };
                    })
                    .filter((clue) => clue.type && clue.text),
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={addPoem}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Save Poem
          </button>
        </div>
      )}

      {/* Display All Poems */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Poems</h2>
        {poems.map((poem, index) => (
          <div key={index} className="border-b py-2">
            <strong>{poem.id}</strong>: {poem.title} by {poem.author}
          </div>
        ))}
      </div>
    </main>
  );
}

interface Poem {
  id: string; // this is a date such as 20250125
  title: string;
  author: string;
  lines: string[];
  displayRange: [number, number];
  clues: { type: string; text: string }[];
}
