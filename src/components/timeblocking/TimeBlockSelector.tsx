import React, { useState } from 'react';
import { Plus, X, Check, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useHabits } from '../../hooks/useHabits';
import { useDailies } from '../../hooks/useDailies';
import { useTodos } from '../../hooks/useTodos';
import type { TimeBlockFormData } from '../../types/timeblock';

interface TimeBlockSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (data: TimeBlockFormData) => void;
}

export function TimeBlockSelector({ isOpen, onClose, onSelect }: TimeBlockSelectorProps) {
  const [selectedType, setSelectedType] = useState<'habit' | 'daily' | 'todo' | 'custom'>('custom');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [timeRange, setTimeRange] = useState({
    startTime: '',
    endTime: ''
  });

  const { habits } = useHabits();
  const { dailies } = useDailies();
  const { todos } = useTodos();

  const handleSubmit = () => {
    const formData: TimeBlockFormData = {
      title: selectedType === 'custom' ? customTitle : 
        selectedItem ? getItemTitle(selectedItem) : '',
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      type: selectedType,
      referenceId: selectedType !== 'custom' ? selectedItem : undefined
    };

    onSelect(formData);
    resetForm();
    onClose();
  };

  const getItemTitle = (id: string): string => {
    switch (selectedType) {
      case 'habit':
        return habits.find(h => h.id === id)?.title || '';
      case 'daily':
        return dailies.find(d => d.id === id)?.title || '';
      case 'todo':
        return todos.find(t => t.id === id)?.title || '';
      default:
        return '';
    }
  };

  const resetForm = () => {
    setSelectedType('custom');
    setSelectedItem(null);
    setCustomTitle('');
    setTimeRange({ startTime: '', endTime: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Time Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type Selection */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { type: 'habit', label: 'Habit' },
              { type: 'daily', label: 'Daily' },
              { type: 'todo', label: 'Todo' },
              { type: 'custom', label: 'Custom' }
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type as any);
                  setSelectedItem(null);
                }}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedType === type
                    ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                    : 'text-gray-400 hover:bg-[#2A2B35]/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Item Selection or Custom Title */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              {selectedType === 'custom' ? 'Title' : 'Select Item'}
            </label>
            
            {selectedType === 'custom' ? (
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                  text-gray-200 focus:outline-none focus:border-[#4F46E5]/50"
                placeholder="Enter title"
              />
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedType === 'habit' && habits.map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => setSelectedItem(habit.id)}
                    className={`w-full p-2 rounded-lg text-left transition-all ${
                      selectedItem === habit.id
                        ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                        : 'bg-[#2A2B35]/30 border border-[#2A2B35]/50 text-gray-300 hover:border-[#4F46E5]/30'
                    }`}
                  >
                    {habit.title}
                  </button>
                ))}

                {selectedType === 'daily' && dailies.map(daily => (
                  <button
                    key={daily.id}
                    onClick={() => setSelectedItem(daily.id)}
                    className={`w-full p-2 rounded-lg text-left transition-all ${
                      selectedItem === daily.id
                        ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                        : 'bg-[#2A2B35]/30 border border-[#2A2B35]/50 text-gray-300 hover:border-[#4F46E5]/30'
                    }`}
                  >
                    {daily.title}
                  </button>
                ))}

                {selectedType === 'todo' && todos.map(todo => (
                  <button
                    key={todo.id}
                    onClick={() => setSelectedItem(todo.id)}
                    className={`w-full p-2 rounded-lg text-left transition-all ${
                      selectedItem === todo.id
                        ? 'bg-[#4F46E5]/20 text-[#4F46E5] border border-[#4F46E5]/30'
                        : 'bg-[#2A2B35]/30 border border-[#2A2B35]/50 text-gray-300 hover:border-[#4F46E5]/30'
                    }`}
                  >
                    {todo.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Start Time</label>
              <input
                type="time"
                value={timeRange.startTime}
                onChange={(e) => setTimeRange({ ...timeRange, startTime: e.target.value })}
                className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                  text-gray-200 focus:outline-none focus:border-[#4F46E5]/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">End Time</label>
              <input
                type="time"
                value={timeRange.endTime}
                onChange={(e) => setTimeRange({ ...timeRange, endTime: e.target.value })}
                className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                  text-gray-200 focus:outline-none focus:border-[#4F46E5]/50"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-400 hover:bg-[#2A2B35]/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!timeRange.startTime || !timeRange.endTime || 
              (selectedType === 'custom' ? !customTitle : !selectedItem)}
            className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] 
              transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}