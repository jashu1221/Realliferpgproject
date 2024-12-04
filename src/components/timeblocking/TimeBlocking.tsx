import React, { useState, useRef, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { TimeBlockSelector } from './TimeBlockSelector';
import { TimeGrid } from './TimeGrid';
import { useTimeBlocks } from '../../hooks/useTimeBlocks';
import type { TimeBlockFormData } from '../../types/timeblock';

export function TimeBlocking() {
  const [showSelector, setShowSelector] = useState(false);
  const { blocks, selectedDate, loading, error, fetchBlocks, addBlock } = useTimeBlocks();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const date = new Date(selectedDate);
    fetchBlocks(format(date, 'yyyy-MM-dd'));
  }, [selectedDate, fetchBlocks]);

  const handleAddBlock = async (blockData: TimeBlockFormData) => {
    await addBlock(selectedDate, blockData);
  };

  const handleDateChange = (date: Date) => {
    fetchBlocks(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="card-dark space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
        <h3 className="text-sm font-medium text-gray-300">Time Blocking</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleDateChange(subDays(new Date(selectedDate), 1))}
              className="p-1 rounded hover:bg-[#2A2B35] text-gray-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-300">
              {format(new Date(selectedDate), 'EEE, MMM d')}
            </span>
            <button 
              onClick={() => handleDateChange(addDays(new Date(selectedDate), 1))}
              className="p-1 rounded hover:bg-[#2A2B35] text-gray-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowSelector(true)}
            className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
              hover:bg-[#4F46E5]/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>
        </div>
      </div>

      {/* Time Grid */}
      <div 
        ref={gridRef}
        className="relative h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin 
          scrollbar-thumb-[#2A2B35] scrollbar-track-transparent"
      >
        <TimeGrid
          blocks={blocks}
          loading={loading}
          error={error}
        />
      </div>

      {/* Time Block Selector */}
      <TimeBlockSelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleAddBlock}
      />
    </div>
  );
}