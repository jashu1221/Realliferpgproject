import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

interface TimeBlockingHeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function TimeBlockingHeader({ selectedDate, setSelectedDate }: TimeBlockingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
      <h3 className="text-sm font-medium text-gray-300">Time Blocking</h3>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          className="p-1 rounded hover:bg-[#2A2B35] text-gray-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-300">
          {format(selectedDate, 'EEE, MMM d')}
        </span>
        <button 
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="p-1 rounded hover:bg-[#2A2B35] text-gray-400 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}