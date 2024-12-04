import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, GripVertical, Timer, X, Check, Calendar, ChevronDown, Edit2 } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'habit' | 'daily' | 'todo' | 'custom';
  duration: number;
}

interface TimeOption {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

export function TimeBlocking() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState<TimeOption>({ hour: 9, minute: 0, period: 'AM' });
  const [selectedEndTime, setSelectedEndTime] = useState<TimeOption>({ hour: 10, minute: 0, period: 'AM' });
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end' | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = [0, 15, 30, 45];
  const periods = ['AM', 'PM'] as const;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimeDropdown(false);
        setActiveTimeField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (time: TimeOption) => {
    return `${time.hour}:${time.minute.toString().padStart(2, '0')} ${time.period}`;
  };

  const to24Hour = (time: TimeOption) => {
    let hour = time.hour;
    if (time.period === 'PM' && hour !== 12) hour += 12;
    if (time.period === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  const calculateDuration = (start: TimeOption, end: TimeOption) => {
    const startMinutes = to24Hour(start) * 60 + start.minute;
    const endMinutes = to24Hour(end) * 60 + end.minute;
    return endMinutes - startMinutes;
  };

  const handleAddTimeBlock = () => {
    if (newBlockTitle) {
      const startHour = to24Hour(selectedStartTime);
      const endHour = to24Hour(selectedEndTime);
      
      const startTimeStr = `${startHour.toString().padStart(2, '0')}:${selectedStartTime.minute.toString().padStart(2, '0')}`;
      const endTimeStr = `${endHour.toString().padStart(2, '0')}:${selectedEndTime.minute.toString().padStart(2, '0')}`;
      const duration = calculateDuration(selectedStartTime, selectedEndTime);

      const newBlock: TimeBlock = {
        id: `${Date.now()}`,
        title: newBlockTitle,
        startTime: startTimeStr,
        endTime: endTimeStr,
        type: 'custom',
        duration
      };

      setTimeBlocks([...timeBlocks, newBlock]);
      setNewBlockTitle('');
      setShowTimeDropdown(false);
      setActiveTimeField(null);
    }
  };

  const TimeDropdown = ({ 
    time, 
    onChange,
    label
  }: { 
    time: TimeOption;
    onChange: (time: TimeOption) => void;
    label: string;
  }) => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTimeBlock();
    }
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: format(new Date().setHours(i, 0), 'h:mm a')
  }));

  return (
    <div className="card-dark space-y-3">
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

      {/* Quick Add Form */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newBlockTitle}
          onChange={(e) => setNewBlockTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new time block"
          className="flex-1 input-dark text-sm"
        />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowTimeDropdown(!showTimeDropdown);
              setActiveTimeField(activeTimeField ? null : 'start');
            }}
            className="p-2 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50 
              text-gray-400 hover:border-[#4F46E5]/30 transition-colors"
            title="Set time"
          >
            <Clock className="w-4 h-4" />
          </button>
          {showTimeDropdown && (
            <div className="absolute right-0 mt-1 bg-[#1A1B23] border border-[#2A2B35]/50 
              rounded-lg shadow-xl p-4 z-50 min-w-[280px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTimeField('start')}
                    className={`text-left ${activeTimeField === 'start' ? 'text-[#4F46E5]' : 'text-gray-400'}`}
                  >
                    <div className="text-xs mb-1">Start Time</div>
                    <div className="text-sm font-medium">{formatTime(selectedStartTime)}</div>
                  </button>
                  <div className="text-gray-500">to</div>
                  <button
                    onClick={() => setActiveTimeField('end')}
                    className={`text-left ${activeTimeField === 'end' ? 'text-[#4F46E5]' : 'text-gray-400'}`}
                  >
                    <div className="text-xs mb-1">End Time</div>
                    <div className="text-sm font-medium">{formatTime(selectedEndTime)}</div>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowTimeDropdown(false);
                    setActiveTimeField(null);
                  }}
                  className="p-1 rounded hover:bg-[#2A2B35] text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeTimeField && (
                <div className="space-y-4">
                  <TimeDropdown
                    time={activeTimeField === 'start' ? selectedStartTime : selectedEndTime}
                    onChange={(time) => {
                      if (activeTimeField === 'start') {
                        setSelectedStartTime(time);
                      } else {
                        setSelectedEndTime(time);
                      }
                    }}
                    label={activeTimeField === 'start' ? 'Select Start Time' : 'Select End Time'}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowTimeDropdown(false);
                        setActiveTimeField(null);
                      }}
                      className="px-3 py-1.5 text-sm rounded text-gray-400 
                        hover:bg-[#2A2B35]/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTimeBlock}
                      className="px-3 py-1.5 text-sm rounded bg-[#4F46E5]/10 text-[#4F46E5] 
                        hover:bg-[#4F46E5]/20 transition-colors"
                    >
                      Add Block
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Time Blocks */}
      <div className="relative h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin 
        scrollbar-thumb-[#2A2B35] scrollbar-track-transparent pr-2">
        {timeSlots.map((slot) => (
          <div
            key={slot.hour}
            className="flex items-center gap-3 h-12 transition-colors relative"
          >
            <div className="w-20 text-xs text-gray-500">{slot.label}</div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 border-t border-[#2A2B35]/30" />
              {timeBlocks
                .filter(block => parseInt(block.startTime) === slot.hour)
                .map((block) => (
                  <div
                    key={block.id}
                    className={`absolute left-0 right-0 bg-[#2A2B35]/30 rounded-lg 
                      border border-[#4F46E5]/20 group transition-all cursor-move
                      hover:border-[#4F46E5]/40 hover:bg-[#2A2B35]/40`}
                    style={{
                      height: `${(block.duration / 15) * 12}px`
                    }}
                  >
                    <div className="p-2">
                      {editingBlock === block.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-[#1A1B23]/50 border border-[#2A2B35]/50 rounded px-2 py-1
                              text-sm text-gray-200 focus:outline-none focus:border-[#4F46E5]/30"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingBlock(null)}
                              className="p-1 rounded hover:bg-[#2A2B35] text-gray-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const updatedBlocks = timeBlocks.map(b => 
                                  b.id === block.id ? { ...b, title: editTitle } : b
                                );
                                setTimeBlocks(updatedBlocks);
                                setEditingBlock(null);
                              }}
                              className="p-1 rounded hover:bg-[#2A2B35] text-[#4F46E5]"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-white font-medium">{block.title}</div>
                            <div className="text-xs text-gray-400">
                              {formatTime({ 
                                hour: parseInt(block.startTime) % 12 || 12, 
                                minute: 0, 
                                period: parseInt(block.startTime) >= 12 ? 'PM' : 'AM' 
                              })} - 
                              {formatTime({ 
                                hour: parseInt(block.endTime) % 12 || 12, 
                                minute: 0, 
                                period: parseInt(block.endTime) >= 12 ? 'PM' : 'AM' 
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingBlock(block.id);
                                setEditTitle(block.title);
                              }}
                              className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setTimeBlocks(timeBlocks.filter(b => b.id !== block.id))}
                              className="p-1 rounded-lg hover:bg-[#2A2B35] text-gray-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}