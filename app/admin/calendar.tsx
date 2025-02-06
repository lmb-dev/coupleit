'use client'
import { useState } from 'react';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
  highlightedDates: Set<string>;
}

export default function Calendar({ onDateSelect, selectedDate, highlightedDates }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

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

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Previous Month
        </button>
        <h2 className="text-xl font-semibold">
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </h2>
        <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Next Month
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold">
        {weekdays.map((day) => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }, (_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => {
          const day = i + 1;
          const date = formatDate(currentYear, currentMonth, day);
          return (
            <button
              key={date}
              className={`p-2 rounded text-center transition-all 
                ${highlightedDates.has(date) ? 'bg-[var(--b2)]' : 'bg-gray-200'}
                ${selectedDate === date ? 'ring-2 ring-[var(--b3)]' : ''}`}
              onClick={() => onDateSelect(date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
