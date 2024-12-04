import React, { useState } from 'react';
import { Clock, X, Check } from 'lucide-react';

interface HabitModalSnoozeProps {
  snoozeUntil: string;
  snoozeReason: string;
  onUpdateSnooze: (until: string, reason?: string) => void;
}

export default function HabitModalSnooze({ 
  snoozeUntil, 
  snoozeReason, 
  onUpdateSnooze 
}: HabitModalSnoozeProps) {
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [snoozeOption, setSnoozeOption] = useState({
    type: 'days' as 'days' | 'date' | 'removed',
    value: 1,
    reason: snoozeReason || '',
  });

  const handleSnoozeOptionChange = (
    type: 'days' | 'date' | 'removed',
    value?: number | string
  ) => {
    setSnoozeOption({
      ...snoozeOption,
      type,
      value: value !== undefined ? value : snoozeOption.value,
    });
  };

  const handleSaveSnooze = () => {
    let until = '';
    if (snoozeOption.type === 'days') {
      const date = new Date();
      date.setDate(date.getDate() + (snoozeOption.value as number));
      until = date.toISOString().split('T')[0];
    } else if (snoozeOption.type === 'date') {
      until = snoozeOption.value as string;
    }

    onUpdateSnooze(until, snoozeOption.reason);
    setShowSnoozeOptions(false);
  };

  const handleUnsnooze = () => {
    onUpdateSnooze('', '');
  };

  const formatSnoozeText = () => {
    if (!snoozeUntil) return '';
    const endDate = new Date(snoozeUntil);
    return `Snoozed until ${endDate.toLocaleDateString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4F46E5]" />
          Snooze
        </label>
        {!snoozeUntil ? (
          <button
            onClick={() => setShowSnoozeOptions(!showSnoozeOptions)}
            className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
              hover:bg-[#4F46E5]/20 transition-all text-sm"
          >
            Configure Snooze
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{formatSnoozeText()}</span>
            <button
              onClick={handleUnsnooze}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500
                hover:bg-red-500/20 transition-all text-sm"
            >
              Unsnooze
            </button>
          </div>
        )}
      </div>

      {showSnoozeOptions && !snoozeUntil && (
        <div className="space-y-4 p-4 rounded-lg bg-[#2A2B35]/30 border border-[#2A2B35]/50">
          <div className="flex gap-2">
            {[
              { type: 'days', label: 'Days' },
              { type: 'date', label: 'Until Date' },
              { type: 'removed', label: 'Until I change' },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() =>
                  handleSnoozeOptionChange(
                    option.type as 'date' | 'days' | 'removed'
                  )
                }
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  snoozeOption.type === option.type
                    ? 'bg-[#4F46E5]/20 text-[#4F46E5] border-[#4F46E5]/30'
                    : 'border-[#2A2B35]/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {snoozeOption.type === 'days' && (
            <input
              type="number"
              min="1"
              value={snoozeOption.value as number}
              onChange={(e) =>
                handleSnoozeOptionChange('days', parseInt(e.target.value))
              }
              className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                text-gray-200 focus:outline-none focus:border-[#4F46E5]/50"
              placeholder="Number of days"
            />
          )}

          {snoozeOption.type === 'date' && (
            <input
              type="date"
              value={snoozeOption.value as string}
              onChange={(e) => handleSnoozeOptionChange('date', e.target.value)}
              className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                text-gray-200 focus:outline-none focus:border-[#4F46E5]/50"
            />
          )}

          <textarea
            value={snoozeOption.reason}
            onChange={(e) =>
              setSnoozeOption({ ...snoozeOption, reason: e.target.value })
            }
            placeholder="Reason for snoozing (optional)"
            className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
              text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50
              resize-none h-20"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSnoozeOptions(false)}
              className="px-3 py-1.5 rounded-lg text-gray-400 
                hover:bg-[#2A2B35]/50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSnooze}
              className="px-3 py-1.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
                hover:bg-[#4F46E5]/20 transition-all text-sm"
            >
              Save Snooze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}