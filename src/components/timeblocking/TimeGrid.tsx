import React from 'react';
import { format } from 'date-fns';
import { TimeBlock } from './types';
import { TimeBlockCard } from './TimeBlockCard';

interface TimeGridProps {
  timeBlocks: TimeBlock[];
  onUpdateBlock: (id: string, title: string) => void;
  onDeleteBlock: (id: string) => void;
  currentTime: number;
}

export function TimeGrid({ timeBlocks, onUpdateBlock, onDeleteBlock, currentTime }: TimeGridProps) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: format(new Date().setHours(i, 0), 'h:mm a')
  }));

  // Calculate current time position
  const currentTimePosition = (currentTime / (24 * 60)) * 100;

  return (
    <div className="relative">
      {/* Current Time Indicator */}
      <div 
        className="absolute left-20 right-0 h-0.5 bg-[#4F46E5] z-10 shadow-lg shadow-[#4F46E5]/20"
        style={{ 
          top: `${currentTimePosition}%`,
          width: 'calc(100% - 5rem)'
        }}
      >
        <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-[#4F46E5] shadow-lg shadow-[#4F46E5]/20" />
      </div>

      {/* Time Slots */}
      {timeSlots.map((slot) => (
        <div
          key={slot.hour}
          className="flex items-center gap-3 h-12 transition-colors relative"
        >
          <div className="w-20 text-xs text-gray-500 flex-shrink-0">{slot.label}</div>
          <div className="flex-1 relative min-w-0">
            <div className="absolute inset-0 border-t border-[#2A2B35]/30" />
            {timeBlocks
              .filter(block => parseInt(block.startTime) === slot.hour)
              .map((block) => (
                <div
                  key={block.id}
                  className={`absolute left-0 right-0 bg-[#2A2B35]/30 rounded-lg 
                    border border-[#4F46E5]/20 group transition-all cursor-pointer
                    hover:border-[#4F46E5]/40 hover:bg-[#2A2B35]/40`}
                  style={{
                    height: `${(block.duration / 15) * 12}px`,
                    zIndex: 5
                  }}
                >
                  <TimeBlockCard
                    block={block}
                    onUpdate={onUpdateBlock}
                    onDelete={onDeleteBlock}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}