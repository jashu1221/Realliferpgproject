import React from 'react';
import { TimeOption } from './types';

interface TimeDropdownProps {
  time: TimeOption;
  onChange: (time: TimeOption) => void;
  label: string;
}

export function TimeDropdown({ time, onChange, label }: TimeDropdownProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];
  const periods = ['AM', 'PM'] as const;

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-1">
          {hours.map(hour => (
            <button
              key={hour}
              onClick={() => onChange({ ...time, hour })}
              className={`p-1.5 text-xs rounded transition-colors ${
                time.hour === hour 
                  ? 'bg-[#4F46E5]/20 text-[#4F46E5]' 
                  : 'text-gray-400 hover:bg-[#2A2B35]/30'
              }`}
            >
              {hour}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1">
          {minutes.map(minute => (
            <button
              key={minute}
              onClick={() => onChange({ ...time, minute })}
              className={`p-1.5 text-xs rounded transition-colors ${
                time.minute === minute 
                  ? 'bg-[#4F46E5]/20 text-[#4F46E5]' 
                  : 'text-gray-400 hover:bg-[#2A2B35]/30'
              }`}
            >
              :{minute.toString().padStart(2, '0')}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {periods.map(period => (
            <button
              key={period}
              onClick={() => onChange({ ...time, period })}
              className={`p-1.5 text-xs rounded transition-colors ${
                time.period === period 
                  ? 'bg-[#4F46E5]/20 text-[#4F46E5]' 
                  : 'text-gray-400 hover:bg-[#2A2B35]/30'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}